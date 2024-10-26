const { default: mongoose } = require("mongoose");
const Course = require("../model/Course");
const User = require("../model/User");
const {instance} = require("../config/razorpay");
const crypto = require("crypto");
const mailSender = require("../utils/mailSender");
const {paymentSuccessEmail} = require("../mail/templates/paymentSuccessEmail");
const CourseProgress = require("../model/CourseProgress");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail")

exports.capturePayment =async (req,res)=>{
        const {courses} = req.body;
        const userId = req.user.id;

        if (courses.length === 0) {
            return res.json({ success: false, message: "Please Provide Course ID" })
          }

          let total_amount = 0;
          for(let course_id of courses){
            let course;
            try{
                
                course = await Course.findById(course_id);
                if (!course) {
                    return res.status(200).json({ 
                        success: false, 
                        message: "Could not find the Course" 
                    })
                }

                const uid = new mongoose.Types.ObjectId(userId); // here we converting the userId into object form
                // console.log("course",course);
                if(course.studentsEnrolled && course.studentsEnrolled.includes(uid)){
                    return res.status(200).json({ 
                        success: false, 
                        message: "Student is already Enrolled" 
                    })
                }
                
                total_amount += course.price
                // console.log("total amount",total_amount)
            } catch(error){
                console.log(error)
                return res.status(500).json({ 
                    success: false,
                    message: error.message
                })
          }
        }
          // Now we will create order

          const options = {
            amount:total_amount * 100,
            currency:"INR",
            receipt : Math.random(Date.now()).toString(),
          }
        // console.log(options);
          try {
                const paymentResponse = await instance.orders.create(options)
                // console.log(paymentResponse)
                return res.status(200).json({
                success:true,
                data:paymentResponse
                })
          } catch (error) {
                console.log(error)
                res.status(500).json({ 
                success: false,
                message: "Could not initiate order."
                })
          }
}

exports.verifyPayment = async (req, res) => {
  console.log(req.body)
    const razorpay_order_id = req.body?.razorpay_order_id
    const razorpay_payment_id = req.body?.razorpay_payment_id
    const razorpay_signature = req.body?.razorpay_signature
    const courses = req.body?.courses
  
    const userId = req.user.id
  
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courses ||
      !userId
    ) {
      return res.status(200).json({ success: false, message: "Payment Failed" })
    }
  
    let body = razorpay_order_id + "|" + razorpay_payment_id
  
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex")
  
    if (expectedSignature === razorpay_signature) {
      await enrollStudents(courses, userId, res)
      return res.status(200).json({ success: true, message: "Payment Verified" })
    }
  
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }

exports.sendPaymentSuccessEmail = async (req, res) => {
    console.log(req.body)
    // console.log(req.user)
    const { orderId, paymentId, amount } = req.body
    const userId = req.user.id
    
  
    if (!orderId || !paymentId || !amount || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all the details" })
    }
  
    try {
      const enrolledStudent = await User.findById(userId)
  
      await mailSender(
        enrolledStudent.email,
        `Payment Received`,
        paymentSuccessEmail(
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
          amount / 100,
          orderId,
          paymentId
        )
      )
    } catch (error) {
      console.log("error in sending mail", error)
      return res
        .status(400)
        .json({ success: false, message: "Could not send email" })
    }
  }

const enrollStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please Provide Course ID and User ID" })
    }
  
    for (const courseId of courses) {
      try {
        const enrolledCourse = await Course.findOneAndUpdate(
          { _id: courseId },
          { $push: { studentsEnrolled: userId } },
          { new: true }
        )
  
        if (!enrolledCourse) {
          return res
            .status(500)
            .json({ success: false, error: "Course not found" })
        }
        console.log("Updated course: ", enrolledCourse);

        const courseProgress = await CourseProgress.create({
            courseID: courseId,
            userId: userId,
            completedVideos: [],
          })

        const enrolledStudent = await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              courses: courseId,
              courseProgress: courseProgress._id,
            },
          },
          { new: true }
        )

  
        console.log("Enrolled student: ", enrolledStudent);
        

        const emailResponse = await mailSender(
          enrolledStudent.email,
          `Successfully Enrolled into ${enrolledCourse.courseName}`,
          courseEnrollmentEmail(
            enrolledCourse.courseName,
            `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
          )
        )
  
        console.log("Email sent successfully: ", emailResponse)
      } catch (error) {
            console.log(error)
            return res.status(400).json({ 
                success: false, 
                error: error.message
            })
      }
    }
  }
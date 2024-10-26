const User = require("../model/User");
const Course = require("../model/Course");
const Category = require("../model/Category");
const CourseProgress = require("../model/CourseProgress");
const { convertSecondsToDuration}= require("../utils/secondToDuration");
const Section = require("../model/Section");
const SubSection = require("../model/SubSection");
const {uploadImageToCloudinary} =require("../utils/imageUploader")
exports.createCourse = async(req,res)=>{
    try{
        const userId = req.user.id;
        let {
			courseName,
			courseDescription,
			whatYouWillLearn,
			price,
			tag:_tag, // ?
			category,
			status,
			instructions:_instructions, // ?
		} = req.body;
        const thumbnail = req.files.thumbnailImage;
        

        const tag = JSON.parse(_tag)
        const instructions = JSON.parse(_instructions)
        if (
			!courseName ||
			!courseDescription ||
			!whatYouWillLearn ||
			!price ||
			!tag.length ||
			!thumbnail ||
			!category ||
            !instructions.length
		) {
			return res.status(400).json({
				success: false,
				message: "All Fields are Mandatory",
			});
		}
        if(!status || status === undefined){
            status = "Draft"
        }

        const instructorDetails = await User.findById(
            {_id:userId},
            {accountType:"Instructor"}
        )
        if (!instructorDetails) {
			return res.status(404).json({
				success: false,
				message: "Instructor Details Not Found",
			});
		}
        const categoryDetails = await Category.findById(category);
		if (!categoryDetails) {
			return res.status(404).json({
				success: false,
				message: "Category Details Not Found",
			});
		}

		const thumbnailImage = await uploadImageToCloudinary(
			thumbnail,
			process.env.FOLDER_NAME
		);
		console.log(thumbnailImage);

		const newCourse = await Course.create({
			courseName,
			courseDescription,
			instructor: instructorDetails._id,
			whatYouWillLearn: whatYouWillLearn,
			price,
			tag: tag,
			category: categoryDetails._id,
			thumbnail: thumbnailImage.secure_url,
			status: status,
			instructions: instructions,
		});

        await User.findByIdAndUpdate(
            {_id:userId},
            {
                $push:{courses:newCourse._id},
                
            },
            {new:true}
        )

        await Category.findByIdAndUpdate(
            {_id:categoryDetails._id},
            {
                $push:{courses:newCourse._id},
                
            },
            {new:true}
        )

        res.status(200).json({
            success: true,
            data: newCourse,
            message: "Course Created Successfully",
          })

    } catch(error){
        console.error(error)
        res.status(500).json({
        success: false,
        message: "Failed to create course",
        error: error.message,
    })
    }
}

exports.getAllCourses = async(req,res)=>{
    try{
        const allCourses = await Course.find(
            {},
            {courseName:true,
             price:true,
             thumbnail:true,
             instructor:true,
             ratingAndReviews:true,
             studentEnrolled:true
            }
        ).populate("instructor").exec();

        return res.status(200).json({
			success: true,
			data: allCourses,
		});
    } catch(error){
        console.log(error);
		return res.status(404).json({
			success: false,
			message: `Can't Fetch Course Data`,
			error: error.message,
		});
    }
}

exports.getCourseDetails = async(req,res)=>{
    try{
        const {courseId} = req.body;
        const courseDetails = await Course.findById(
            {_id:courseId}
        ).populate({
            path:"instructor",
            populate:{
                path:"additionalDetails",
            }
        }).populate("category")
          .populate({
            path:"ratingAndReviews",
            populate:{
                path:"user",
                select: "firstName lastName accountType image"
            }
        }).populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        }).exec()

        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Course Not Found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Course fetched successfully now",
            data:courseDetails
        })
    } catch(error){
        console.log(error);
        return res.status(404).json({
            success:false,
			message:`Can't Fetch Course Data`,
			error:error.message
        })
    }
}

exports.getInstructorCourses = async(req,res)=>{
    try{
        const userId = req.user.id;

        const allCourses = await Course.find({instructor:userId});
        res.status(200).json({
			success: true,
			data: allCourses,
		});
    } catch(error){
        console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch courses",
			error: error.message,
		});
    }
}

exports.editCourse = async(req,res)=>{
    try{
        const {courseId} = req.body;
        const updates = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success:false,
                 error: "Course not found"
             })
          }
        
        if(req.files){
            const thumbnail = req.files.thumbnailImage;
            const thumbnailImage = await uploadImageToCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
            )
            course.thumbnail = thumbnailImage.secure_url;
        }
        

        for(let key in updates){
            if (updates.hasOwnProperty(key)){
                if(key === "tag" || key === "instructor"){
                    course[key] = JSON.parse(updates[key])
                } else{
                    course[key] = updates[key];
                }
            }
        }
        await course.save();
        const updatedCourse = await Course.findOne(
            {_id:courseId}
            ).populate({
                path:"instructor",
                populate:{
                    path:"additionalDetails"
                }
            }).populate("category")
            .populate("ratingAndReviews")
            .populate({
                path:"courseContent",
                populate:{
                    path:"subSection"
                }
            }).exec();

            res.json({
                success: true,
                message: "Course updated successfully",
                data: updatedCourse,
              })
    } catch(error){
        console.error(error)
	    res.status(500).json({
		success: false,
		message: "Internal server error",
		error: error.message,
	  })
    }
}

exports.getFullCourseDetails = async(req,res)=>{
    try{

        const {courseId} = req.body;
        const userId = req.user.id;

        const courseDetails = await Course.findById(
            {_id:courseId},

            ).populate({
                path:"instructor",
                populate:{
                    path:"additionalDetails"
                }
            }).populate("category")
            .populate("ratingAndReviews")
            .populate({
                path:"courseContent",
                populate:{
                    path:"subSection"
                }
            }).exec();

            if (!courseDetails) {
                return res.status(400).json({
                  success: false,
                  message: `Could not find course with id: ${courseId}`,
                })
              }

              let courseProgressCount = await CourseProgress.findOne({
                courseID: courseId,
                userID: userId,
              })

              let totalDurationInSeconds = 0;
              courseDetails.courseContent.forEach((section)=>{
                section.subSection.forEach((subSection)=>{
                    const timeDurationInSeconds = parseInt(subSection.timeDuration)
                    totalDurationInSeconds += timeDurationInSeconds; 

                })
              })
              const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

              return res.status(200).json({
                success: true,
                data: {
                  courseDetails,
                  totalDuration,
                  completedVideos: courseProgressCount?.completedVideos
                    ? courseProgressCount?.completedVideos
                    : ["none"],
                },
              })
    }   catch (error) {
            return res.status(500).json({
            success: false,
            message: error.message,
            })
      }
}

exports.deleteCourse = async(req,res)=>{
    try{
        const {courseId} = req.body;
        const course = await Course.findById({_id:courseId});
        if (!course) {
            return res.status(404).json({ 
                message: "Course not found"
             })
          }
          const studentsEnrolled = course.studentsEnrolled
          for(let studentId of studentsEnrolled){
            await User.findByIdAndUpdate(
                {_id:studentId},
                {
                    $pull:{courses:courseId}
                }
            )
          }

          const courseSections = course.courseContent;
          for(let sectionId of courseSections){
            const section = await Section.findById(sectionId);
            if (section){
                const subSection = section.subSection;
                for(let subSectionId of subSection){
                    await SubSection.findByIdAndDelete(subSectionId);
                } 
            }
            await Section.findByIdAndDelete(section)
          }

            // Delete the course
            await Course.findByIdAndDelete(courseId)
            console.log(course)
            //Delete course id from Category
            await Category.findByIdAndUpdate(course.category._id, {
                $pull: { courses: courseId },
                })
            
            //Delete course id from Instructor
            await User.findByIdAndUpdate(course.instructor._id, {
                $pull: { courses: courseId },
                })
        
            return res.status(200).json({
                success: true,
                message: "Course deleted successfully",
            })
    } catch(error){
        console.error(error)
	    return res.status(500).json({
		success: false,
		message: "Internal Server error",
		error: error.message,
	  })
    }
}

exports.searchCourse = async (req, res) => {
        try {
        const  { searchQuery }  = req.body
        //   console.log("searchQuery : ", searchQuery)
        const courses = await Course.find({
            $or: [
            { courseName: { $regex: searchQuery, $options: "i" } },
            { courseDescription: { $regex: searchQuery, $options: "i" } },
            { tag: { $regex: searchQuery, $options: "i" } },
            ],
        })
        .populate({
            path: "instructor",  })
        .populate("category")
        .populate("ratingAndReviews")
        .exec();

         return res.status(200).json({
            success: true,
            data: courses,
        })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            })
        }		
    }
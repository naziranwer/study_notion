const { mongo, default: mongoose } = require("mongoose");
const Profile = require("../model/Profile");
const User = require("../model/User");
const Course = require("../model/Course");
const CourseProgress = require("../model/CourseProgress");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.profileUpdate = async (req, res) => {
  try {
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body;

    const userId = req.user.id;
    const user = await User.findById(userId);
    const profile = await Profile.findById(user.additionalDetails);
    profile.dateOfBirth = dateOfBirth;
    profile.about = about;
    profile.contactNumber = contactNumber;
    profile.gender = gender;
    await profile.save();

    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      {
        firstName: firstName,
        lastName: lastName,
      },
      { new: true }
    ).populate("additionalDetails").exec();
      console.log(updatedUser)

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const profile = await Profile.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(user.additionalDetails), // Here why we are converting this into a object
    });
    for (let courseId of user.courses) {
      await Course.findByIdAndUpdate(
        { _id: courseId },
        {
          $pull: {
            studentEnrolled: id,
          },
        },
        { new: true }
      );
    }

    await User.findByIdAndDelete({ _id: id });
    await CourseProgress.deleteMany({ userId: id });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "User Cannot be deleted successfully",
    });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById({ _id: id })
      .populate("additionalDetails")
      .exec();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    console.log(user);
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getEnrolledCourses=async (req,res) => {
	try {
    console.log("Inside Enrolled Courses")
        const id = req.user.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const enrolledCourses = await User.findById(id).populate({
			path : "courses",
				populate : {
					path: "courseContent",
			}
		}
		).populate("courseProgress").exec();
        // console.log(enrolledCourses);
        res.status(200).json({
            success: true,
            message: "User Data fetched successfully",
            data: enrolledCourses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.updateDisplayPicture = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const image = req.files.pfp;
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }
    const uploadDetails = await uploadImageToCloudinary(
      image,
      process.env.FOLDER_NAME
    );
    console.log(uploadDetails);

    const updatedImage = await User.findByIdAndUpdate(
      { _id: id },
      { image: uploadDetails.secure_url },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: updatedImage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.instructorDashboard = async (req, res) => {
  try {
    const id = req.user.id;
    const courseData = await Course.find({ instructor: id });
    const courseDetails = courseData.map((course) => {
      const totalStudents = course?.studentsEnrolled?.length;
      const totalRevenue = course?.price * totalStudents;
      const courseStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        totalStudents,
        totalRevenue,
      };
      return courseStats;
    });
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: courseDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const express = require("express")
const router = express.Router()
const { 
    auth,
    isInstructor
} = require("../middleware/authMiddleware");

const {
  deleteAccount,
  profileUpdate,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
} = require("../controllers/Profile");


router.delete("/deleteProfile",auth,deleteAccount)
router.put("/updateProfile", auth, profileUpdate)
router.get("/getUserDetails", auth, getAllUserDetails)
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.get("/getInstructorDashboardDetails",auth,isInstructor, instructorDashboard)

module.exports = router;
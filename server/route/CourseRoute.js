const express = require("express");
const router = express.Router();

const {
    createCourse,
    getAllCourses,
    getCourseDetails,
    getInstructorCourses,
    editCourse,
    getFullCourseDetails,
    deleteCourse,
    searchCourse,
  } = require("../controllers/Course");

  const {
    updateCourseProgress
    } = require("../controllers/courseProgress");

  const {
    showAllCategory,
    createCategory,
    categoryPageDetails,
    addCourseToCategory,
  } = require("../controllers/Category");

  const {
    createSection,
    updateSection,
    deleteSection,
  } = require("../controllers/Section");

  const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
  } = require("../controllers/SubSection");

  const {
    createRating,
    getAvgRating,
    getAllRating,
  } = require("../controllers/RatingAndReview");

  const { 
    auth, 
    isInstructor,
    isStudent, 
    isAdmin 
  } = require("../middleware/authMiddleware");


// COURSES ROUTES
router.post("/createCourse", auth,isInstructor,createCourse);
router.get("/getAllCourses",getAllCourses);
router.post("/getCourseDetails",getCourseDetails); 
router.post("/editCourse", auth,isInstructor,editCourse)

router.post("/addSection", auth,isInstructor,createSection);
router.post("/updateSection", auth,isInstructor,updateSection);
router.post("/deleteSection", auth,isInstructor,deleteSection);

router.post("/addSubSection", auth,isInstructor,createSubSection);
router.post("/updateSubSection", auth,isInstructor,updateSubSection);
router.post("/deleteSubSection", auth,isInstructor,deleteSubSection);

router.get("/getInstructorCourses", auth,isInstructor,getInstructorCourses);
router.post("/getFullCourseDetails", auth,getFullCourseDetails); 
router.delete("/deleteCourse", auth,deleteCourse);

router.post("/searchCourse", searchCourse);
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);


// CATEGORY ROUTES
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategory)
router.post("/getCategoryPageDetails", categoryPageDetails)
router.post("/addCourseToCategory", auth, isInstructor, addCourseToCategory);
// RATING ROUTES
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAvgRating)
router.get("/getReviews", getAllRating)

module.exports = router;

import { useEffect,useState } from "react";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CoursesTable from "./CourseTable";
import { FaPlus } from "react-icons/fa6";

const MyCourses = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState(null);
  const fetchedCourses = async () => {
    const result = await fetchInstructorCourses(token);
    // console.log(result)
    if (result) {
      setCourses(result);
    }
  };

  useEffect(() => {
    fetchedCourses();
  }, []);
  return (
    <div className="mx-auto w-11/12 max-w-[1000px] py-10">
      <div>
        <div className="mb-14 flex items-center justify-between">
          <h1 className="text-3xl font-medium text-richblack-5">MY Courses</h1>
          <button
            onClick={() => {
              navigate("/dashboard/add-course");
            }}
            className="flex items-center bg-yellow-50 cursor-pointer gap-x-2 rounded-md py-2 px-2 md:px-5 font-semibold text-richblack-900 undefined"
          >
            <p>Add Course</p>
            <FaPlus />
          </button>
        </div>
        <div>
          {courses && (
            <CoursesTable courses={courses} setCourses={setCourses} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;

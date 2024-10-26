import React from "react";

// Importing React Icons
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";

const CourseCard = ({cardData}) => {
  return (
    <div className={`w-[360px] lg:w-[30%] bg-richblack-700 text-richblack-5 h-[300px] box-border hover:bg-richblack-800`}>
      <div className="border-b-[2px] border-richblack-400 border-dashed h-[80%] p-6 flex flex-col gap-3">
        <div className={` font-semibold text-[20px]`} >
          {cardData?.heading}
        </div>

        <div className="text-richblack-400">
          {cardData?.description}
        </div>
      </div>

      <div
        className={`flex justify-between  text-richblack-50 px-2 pt-2`}>
        {/* Level */}
        <div className="flex items-center gap-2 text-[16px]">
          <HiUsers />
          <p>{cardData?.level}</p>
        </div>

        {/* Flow Chart */}
        <div className="flex items-center gap-2 text-[16px]">
          <ImTree />
          <p>{cardData?.lessionNumber} Lession</p>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
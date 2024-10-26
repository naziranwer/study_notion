import React from "react";
import { FiEdit } from "react-icons/fi";

const IconBtn = ({
  text,
  onclick,
  children,
  disabled,
  type,
}) => {
  return (
    <button
      className="flex items-center bg-yellow-100 cursor-pointer gap-x-2 rounded-md py-2 text-sm md:text-lg px-3 md:px-5 font-semibold text-richblack-900 hover:bg-yellow-50"
      disabled={disabled}
      onClick={onclick}
      type={type}
    >
      {children ? (
        <>
          <span>{text}</span>
          {children}
        </>
      ) : (
        text
      )}
      <FiEdit />
    </button>
  );
};

export default IconBtn;

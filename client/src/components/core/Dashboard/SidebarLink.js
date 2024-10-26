import React from "react";
import * as Icons from "react-icons/vsc";
import { useDispatch } from "react-redux";
import { NavLink, matchPath, useLocation } from "react-router-dom";
import { setEditCourse } from "../../../slices/courseSlice";

const SidebarLink = ({ link, iconName }) => {
  const Icon = Icons[iconName];
  const location = useLocation();
  const dispatch = useDispatch();

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <NavLink
      to={link.path}
      className={` py-2 px-4 relative md:px-8 md:py-2 text-sm font-medium transition-all duration-300 ${
        matchRoute(link.path) ? "bg-caribbeangreen-700" : "bg-opacity-0"
      }`}
    >
      <div
        className="flex item-center  gap-x-2 flex-col md:flex-row"
        onClick={() => {
          dispatch(setEditCourse(false));
        }}
      >
        <Icon className="md:text-lg text-3xl" />
        <span className="hidden md:block">{link.name}</span>

      </div>
    </NavLink>
  );
};

export default SidebarLink;

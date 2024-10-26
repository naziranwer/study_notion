import React, { useState, useEffect, useRef } from "react";
import logo from "../../assets/Logo/light_logo.png";
import { Link, matchPath, useLocation } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector, useDispatch } from "react-redux";
import { TiShoppingCart } from "react-icons/ti";
import ProfileDropDown from "../../components/core/Auth/ProfileDropDown";
import { categories } from "../../services/api";
import { apiConnector } from "../../services/apiConnector";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiSearch } from "react-icons/hi";
import { useNavigate } from "react-router";
import { FaChevronDown } from "react-icons/fa";

const Navbar = ({ setProgress }) => {
  const dispatch = useDispatch();

  const { token } = useSelector((store) => store.auth);
  // const token ="zafar"
  const { user } = useSelector((store) => store.profile);
  // const user = "zafar";
  const { totalItems } = useSelector((store) => store.cart);
  const navigate = useNavigate();

  const location = useLocation();
  const matchRoutes = (routes) => {
    return matchPath({ path: routes }, location.pathname);
  };

  const [sublinks, setsublinks] = useState([]);
  const fetchSublinks = async () => {
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      console.log(result);
      if (result?.data?.data?.length > 0) {
        setsublinks(result?.data?.data);
      }
      localStorage.setItem("sublinks", JSON.stringify(result.data.data));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchSublinks();
  }, []);

  const show = useRef();
  const overlay = useRef();

  const shownav = () => {
    show.current.classList.toggle("navshow");
    overlay.current.classList.toggle("hidden");
  };

  return (
    <div
      className={` flex sm:relative bg-richblack-900 w-screen relative z-50 h-14 items-center justify-center border-b-[1px] border-b-richblack-700 translate-y-  transition-all duration-500`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        <Link
          to="/"
          onClick={() => {
            dispatch(setProgress(100));
          }}
        >
          <img src={logo} width={160} alt="Study Notion" height={42} />
        </Link>
        {/* mobile Navbar: NEED TO REVESIT AND MAKE IT ERROR FREE TILL NOW GOOD BYE */}
        {user && user?.accountType !== "Instructor" && (
          <div className=" md:hidden">
            <Link
              to="/dashboard/cart"
              className=" relative left-10"
              onClick={() => {
                dispatch(setProgress(100));
              }}
            >
              <div className="">
                <TiShoppingCart className=" fill-richblack-25 w-8 h-8" />
              </div>
              {totalItems > 0 && (
                <span className=" font-medium text-[12px] shadow-[3px ] shadow-black bg-yellow-100 text-richblack-900 rounded-full px-[4px] absolute -top-[2px] right-[1px]">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        )}

        <div
          className={`flex md:hidden  relative gap- flex-row ${
            token !== null && user?.accountType !== "Instructor"
              ? " -left-12"
              : ""
          }`}
        >
          <GiHamburgerMenu
            className={`w-16 h-8 fill-richblack-25 absolute left-10 -bottom-4 `}
            onClick={shownav}
          />
          <div
            ref={overlay}
            className=" fixed top-0 bottom-0 left-0 right-0 z-30 bg w-[100vw] hidden h-[100vh] overflow-y-hidden bg-[rgba(0,0,0,0.5)] "
            onClick={shownav}
          ></div>
          <div ref={show} className="mobNav z-50">
            <nav
              className=" items-center flex flex-col absolute w-[200px] -left-[80px] -top-7  glass2"
              ref={show}
            >
              {token == null && (
                <Link
                  to="/login"
                  className=""
                  onClick={() => {
                    dispatch(setProgress(100));
                  }}
                >
                  <button
                    onClick={shownav}
                    className=" mt-4 text-center text-[15px] px-6 py-2 rounded-md font-semibold bg-yellow-50 text-black hover:scale-95 transition-all duration-200"
                  >
                    Login
                  </button>
                </Link>
              )}
              {token == null && (
                <Link
                  to="/signup"
                  className="text-yellow-50"
                  onClick={() => {
                    dispatch(setProgress(100));
                  }}
                >
                  <button
                    onClick={shownav}
                    className="mt-4 text-center text-[15px] px-5 py-2 rounded-md font-semibold bg-yellow-50 text-black hover:scale-95 transition-all duration-200"
                  >
                    Signup
                  </button>
                </Link>
              )}

              {token != null && (
                <div className=" mt-2">
                  <p className=" text-richblack-50 text-center mb-2">Account</p>
                  {/* <Link to='/dashboard' onClick={()=>{dispatch(setProgress(100));shownav()}} className="p-2"> */}
                  <ProfileDropDown />
                  {/* </Link> */}
                </div>
              )}
              <div className=" mt-4 mb-4 bg-richblack-25 w-[200px] h-[2px]"></div>
              {/* BELOW LINE OF CODE IS USE TO CREATE A WHITE LINE */}
              <p className=" text-xl text-yellow-50 font-semibold">Courses</p>

              <div className=" flex flex-col items-end pr-4">
                {sublinks?.length < 0 ? (
                  <div className="text-richblack-5">No category</div>
                ) : (
                  sublinks?.map((element, index) => (
                    <Link
                      to={`/catalog/${element?.name}`}
                      key={index}
                      onClick={() => {
                        dispatch(setProgress(30));
                        shownav();
                      }}
                      className="p-2 text-sm"
                    >
                      <p className=" text-richblack-5 ">{element?.name}</p>
                    </Link>
                  ))
                )}
              </div>
              <div className=" mt-4 mb-4 bg-richblack-25 w-[200px] h-[2px]"></div>
              <Link
                to="/about"
                onClick={() => {
                  dispatch(setProgress(100));
                  shownav();
                }}
                className="p-2"
              >
                <p className=" text-richblack-5 ">About</p>
              </Link>
              <Link
                to="/contact"
                onClick={() => {
                  dispatch(setProgress(100));
                  shownav();
                }}
                className="p-2"
              >
                <p className=" text-richblack-5 ">Contact</p>
              </Link>
            </nav>
          </div>
        </div>
                {/* DESKTOP NAV */}
        <nav>
          <ul className=" flex-row gap-x-6 text-richblack-25 gap-5 hidden md:flex">
            {NavbarLinks?.map((element, index) => (
              <li key={index}>
                {element.title === "Catalog" ? (
                  <div className=" flex items-center group relative cursor-pointer">
                    <p>{element.title}</p>
                    <FaChevronDown className="mt-1 ml-1" />

                    <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                      <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                      {sublinks?.length < 0 ? (
                        <div></div>
                      ) : (
                        sublinks?.map((element, index) => (
                          <Link
                            to={`/catalog/${element?.name}`}
                            key={index}
                            className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                            onClick={() => {
                              dispatch(setProgress(30));
                            }}
                          >
                            <p className="">{element?.name}</p>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={element?.path}>
                    <p
                      className={`${
                        matchRoutes(element?.path)
                          ? " text-yellow-25"
                          : " text-richblack-25 hidden md:block"
                      }`}
                    >
                      {element?.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
            <Link to={"/dashboard/my-profile"}>
              <li className="bg-pink-900 px-1 hover:border-b-2 box-content">
                Dashboard
              </li>
            </Link>
          </ul>
        </nav>
        <div className="flex-row gap-5 hidden md:flex items-center">
          {user && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className=" relative px-4 ">
              <div className=" z-50">
                <TiShoppingCart className=" fill-richblack-25 w-7 h-7" />
              </div>
              {totalItems > 0 && (
                <span className=" shadow-sm shadow-black text-[10px] font-bold bg-yellow-100 text-richblack-900 rounded-full px-1 absolute -top-[2px] right-[8px]">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token == null && (
            <Link
              to="/login"
              className="text-richblack-25"
              onClick={() => {
                dispatch(setProgress(100));
              }}
            >
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[7px] text-richblack-100">
                Login
              </button>
            </Link>
          )}
          {token == null && (
            <Link
              to="/signup"
              className="text-richblack-25"
              onClick={() => {
                dispatch(setProgress(100));
              }}
            >
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[7px] text-richblack-100">
                Signup
              </button>
            </Link>
          )}
          {token !== null && (
            <div className=" pt-2">
              <ProfileDropDown />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

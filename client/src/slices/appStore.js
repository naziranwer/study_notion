import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import profileReducer from "./ProfileSlice"
import loadingBarReducer from "./loadingBarSlice";
import courseReducer from "./courseSlice";
import viewCourseReducer from "./viewCourseSlice"


const appStore = configureStore({
    reducer:{
        auth:authReducer,
        cart:cartReducer,
        profile:profileReducer,
        loadingBar: loadingBarReducer,
        course:courseReducer,
        viewCourse:viewCourseReducer,
    }
})

export default appStore;
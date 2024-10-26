import toast from "react-hot-toast";
import { authEndPoints } from "../api"
import { setLoading, setToken } from "../../slices/authSlice";
import { apiConnector } from "../apiConnector";
import { setUser } from "../../slices/ProfileSlice";
import { resetCart } from "../../slices/cartSlice";

const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESETPASSTOKEN,
    RESETPASSWORD_API
} = authEndPoints;

export function sendOtp(email,navigate){
    return async (dispatch) =>{
        const toastId = toast.loading("loading");
        dispatch(setLoading(true));

        try{
            const response = await apiConnector("POST",SENDOTP_API,{
                email,
                checkUserPresent : true // CHECK BY REMOVING THIS IT IS WORKING OR NOT
            })
            console.log("SendOTP API response........", response);

            if(!response.data.success){
                toast.error(response.data.message)
                throw new Error(response.data.message)
            }
            toast.success("OTP sent successfully");
            navigate("/verify-email")
        } catch(error){
            console.log("SENDOTP API ERROR............", error)
            toast.error("Could Not Send OTP")
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId)
    }
}

export function signUp(
    accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,navigate
) {
    return async(dispatch)=>{
        const toastId = toast.loading("Loading...!!")
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST", SIGNUP_API,{
                accountType,
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                otp,
            })
            console.log("SIGNUP API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Signup Successful")
            navigate("/login")
        } catch(error){
            console.log("SIGNUP API ERROR............", error)
            toast.error("Signup Failed")
            navigate("/signup")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function login(email,password,navigate){
    return async(dispatch)=>{
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true));
        try{    
            const response = await apiConnector("POST", LOGIN_API, {
                email,
                password,
              })
        
              console.log("LOGIN API RESPONSE............", response)
        
              if (!response.data.success) {
                throw new Error(response.data.message)
              }
        
              toast.success("Login Successful");
              dispatch(setToken(response.data.token));
              const userImage = response.data.user.image 
              ? response.data.user.image 
              : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
              dispatch(setUser({...response.data.user, image : userImage}));
              localStorage.setItem("token", JSON.stringify(response.data.token));
              localStorage.setItem("user", JSON.stringify(response.data.user));
              navigate("/dashboaerd-myProfile")
        } catch(error){
            console.log("LOGIN API ERROR............", error)
            toast.error("Login Failed")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function logout (navigate){
    return (dispatch)=>{
        dispatch(setToken(null));
        dispatch(setUser(null));
        dispatch(resetCart(null)) // IF YOU WANT YOUR CART TO NOT RESET AFTER LOGOUT THEN YOU WILL HAVE TO REMOVE THIS DISPATCH
        localStorage.removeItem("token")
        localStorage.removeItem("user");
        toast.success("Logged Out");
        navigate("/")
    }
}

export function forgotPassword(email,setEmailSent){
    return async(dispatch)=>{
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST",RESETPASSTOKEN,{email});
            console.log("RESET PASSWORD TOKEN RESPONSE....", response);

            if(!response.data.success) {
              throw new Error(response.data.message);
            }
      
            toast.success("Reset Email Sent");
            setEmailSent(true);
        } catch(error){
            console.log("RESET PASSWORD TOKEN Error", error);
            toast.error("Failed to send email for resetting password");
        }
        dispatch(setLoading(false));
    }
}

export function resetPassword(password, confirmPassword, token,setresetComplete) {
    return async(dispatch) => {
      dispatch(setLoading(true));
      try{
        const response = await apiConnector("POST", RESETPASSWORD_API, {password, confirmPassword, token});
  
        console.log("RESET Password RESPONSE ... ", response);
  
  
        if(!response.data.success) {
          throw new Error(response.data.message);
        }
  
        toast.success("Password has been reset successfully");
        setresetComplete(true)
      }
      catch(error) {
        console.log("RESET PASSWORD TOKEN Error", error);
        toast.error("Unable to reset password");
      }
      dispatch(setLoading(false));
    }
  }
import toast from "react-hot-toast";
import {studentEndpoints} from "../api"
import {apiConnector} from "../apiConnector";
import razorPayLogo from"../../assets/images/rzp.png"
import { resetCart } from "../../slices/cartSlice";

const { COURSE_PAYMENT_API,
        COURSE_VERIFY_API,
        SEND_PAYMENT_SUCCESS_EMAIL_API 
    } = studentEndpoints;


function loadScript(src){
    return new Promise((resolve)=>{
        const script = document.createElement("script");
        script.src = src;
        script.onload = ()=>{
            resolve(true)
        }
        script.onerror=()=>{
            resolve(false)
        }
        document.body.appendChild(script)
    })
}

export async function buyCourse(token, courses, userDetails, navigate, dispatch){
    const toastId = toast.loading("Please wait while we redirect you to payment gateway",{
        position:"bottom-center",
        autoClose:false
    })

    try{
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        return;
        }
    
    const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API,{courses},{
        Authorisation:`Bearer ${token}`
    })
    if(!orderResponse.data.success){
        toast.error(orderResponse.data.message)
        console.log("buyCourse -> orderResponse", orderResponse)
        toast.dismiss(toastId);
        return
    }
    console.log("buyCourse ---------> orderResponse", orderResponse);
    const options = {
        key : process.env.REACT_APP_RAZORPAY_KEY_ID,
        currency : orderResponse?.data?.data?.currency,
        amount : orderResponse?.data?.data?.amount,
        order_id: orderResponse?.data?.data?.id,
        name: "Study Notion",
        description: "Thank you for purchasing the course",
        image:razorPayLogo,
        prefill:{
            name: userDetails?.firstName + " " + userDetails?.lastName,
            email:userDetails?.email
        },
        handler: async function (response){
            console.log("buyCourse -> response", response)
            //send successful wala mail
            sendPaymentSuccessEmail(response, orderResponse?.data?.data?.amount/10,token );
            //verifyPayment
            verifyPayment(response, courses, token, navigate, dispatch);
        },
        theme: {
            color: "#686CFD",
        },
    }
    // console.log(options)
    
    const paymentObject = new window.Razorpay(options)
    paymentObject.open();
    paymentObject.on("payment.failed", function (response) {
        toast.error("Payment Failed");
    });
    toast.dismiss(toastId);
    } catch(error){
        toast.dismiss(toastId);
        toast.error("Something went wrong");
        console.log("buyCourse -> error", error)
    }
}

async function sendPaymentSuccessEmail (response,amount,token) {
    // console.log('-------------------------')
    // console.log(response)
    const res = await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API,{
        amount,
        paymentId:response.razorpay_payment_id,
        orderId:response.razorpay_order_id,
    }, {
        Authorisation:`Bearer ${token}`
    });
    if (!res.success) {
        console.log("error while sending")
        console.log(res.message);
        toast.error(res.message);
    }
}


async function verifyPayment(res,courses,token,navigate,dispatch){
    const toastId = toast.loading("Please wait while we verify your payment")
    try{
        const response = await apiConnector("POST", COURSE_VERIFY_API,{
            razorpay_payment_id: res.razorpay_payment_id,
            razorpay_order_id: res.razorpay_order_id,
            razorpay_signature: res.razorpay_signature,
            courses:courses.courses || courses,
        },{
            Authorisation:`Bearer ${token}`
        })
        console.log("verifypament -> res", response)
        if (!response.data.success) {
            toast.error(response.message);
            return;
        }
        toast.success("Payment Successfull");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    } catch(error){
        toast.error("Payment Failed");
        console.log(error);
    }
    toast.dismiss(toastId)
}
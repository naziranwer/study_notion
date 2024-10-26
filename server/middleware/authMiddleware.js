const jwt = require("jsonwebtoken");
require("dotenv").config()

exports.auth = async(req,res,next)=>{
    // console.log("cookie"+req.cookies.token)
    try{
        // extract token
    const token =   req.body.token ||
                    req.cookies.token ||
                    req.header("Authorisation").replace("Bearer ", "")

    // velidate token
    if(!token){
        return res.status(401).status({
        status:false,
        message:"Token is misssing"
        })
}

    // verify token
    try{
        // console.log(token)
        const decode =  jwt.verify(token, process.env.JWT_SECRET);
        // console.log("decode: ",decode);
        req.user = decode; // VERY IMPORTANT LINE OF CODE

    } catch(err){
        return res.status(401).json({
            success:false,
            message:err.message,
        });
    }
    next();

    } catch(error){
        return res.status(401).json({
            success:false,
            // message:'Something went wrong while validating the token',
            message:error.message
        });
    }
}

exports.isAdmin = async(req,res,next)=>{
    try{
        // console.log(req.user)
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Admin only',
            });
        }
        next();
    } catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, please try again'
        })
    }
}


exports.isStudent = async(req,res,next)=>{
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Student only',
            });
        }
        next();
    } catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, please try again'
        })
    }
}

exports.isInstructor = async(req,res,next)=>{
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Instructor only',
            });
        }
        next();
    } catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, please try again'
        })
    }
}

const User = require("../model/User");
const crypto = require("crypto");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

exports.resetPasswordToken = async(req,res)=>{
    try{
        const {email} = req.body;

    const user = await User.findOne({email:email});
    if (!user) {

        
        return res.json({
            success: false,
            message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
        });
    }
    const token = crypto.randomBytes(20).toString("hex");
    const updatedDetails = await User.findOneAndUpdate(
        {email:email},
        {
            token:token,
            resetPasswordExpires:Date.now() + 60 * 60 * 1000
        },
        {new:true}
    )
        // YOU NEED TO CHANGE THIS IN FUTURE
    const url = `https://studynotion/update-password/${token}`; // YOU NEED TO UPDATE WITH ORIGINAL URL THEN IT WILL WORK

    await mailSender(
        email,
        "Password Reset",
        `Your Link for email verification is ${url}. Please click this url to reset your password.`
    )
    console.log(updatedDetails);
    return res.status(200).json({
        success: true,
        message: "Email Sent Successfully, Please Check Your Email to Continue Further",
    });
    } catch(error){
        return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Sending the Reset Message`,
		});
    }
}

exports.resetPassword = async(req,res)=>{
    try{
        const{password, confirmPassword} = req.body;
        const {token} = req.params;

        if (confirmPassword !== password) {
			return res.status(401).json({
				success: false,
				message: "Password and Confirm Password Does not Match",
			});
		}

        const userDetails = await User.findOne({token:token});
        if (!userDetails) {
			return res.status(400).json({
				success: false,
				message: "Token is Invalid",
			});
		}
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.status(400).json({
                status:false,
                message:"Token has been expired.Please try to regenerate token"
            })
        }
        const encryptedPassword = await bcrypt.hash(password,10);
        await User.findOneAndUpdate(
            {token:token},
            {
                password:encryptedPassword
            },
            {new:true}
        );
        return res.status(200).json({
			success: true,
			message: `Password Reset Successful`,
		});

    } catch(error){
        return res.status(400).json({
			error: error.message,
			success: false,
			message: `Some Error in Updating the Password`,
		});
    }
}
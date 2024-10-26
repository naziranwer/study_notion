const mailSender = require("../utils/mailSender");
const {contactUsEmail} = require("../mail/templates/contactUsFormEmail");

exports.contactUs = async(req,res)=>{
    try{
        const {email,firstName,lastName,phoneNumber,message,countryCode} = req.body;
        console.log(req.body);

        const emailResponse = await mailSender(
            email,
            `Message from ${firstName} ${lastName}`,
            contactUsEmail(email,firstName,lastName,phoneNumber,message,countryCode)
        )
        console.log(emailResponse);

        return res.status(200).json({
            success: true,
            message: "Email send successfully",
          })

    } catch(error){
        console.log("Error message :", error.message)
        return res.json({
        success: false,
        message: "Something went wrong...!!"
        })
    }
}
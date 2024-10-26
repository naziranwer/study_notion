const User = require("../model/User");
const OTP = require("../model/OTP");
const Profile = require("../model/Profile");
const bcrypt = require("bcrypt");
const otpGenarator = require("otp-generator");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
const mailSender = require("../utils/mailSender");
const { otpTemplate } = require("../mail/templates/emailVerificationTemplate");
const { passwordUpdate } = require("../mail/templates/passwordUpdate");
dotenv.config();

exports.signup = async (req, res) => {
  try {
    // fetch the data from req body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;
    // validate all the details
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      });
    }
    // check if password and confirm password matches or not
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password didn't match. Please try again.",
      });
    }
    // check if user already exist or not
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }
    // find the most recent otp
    const response = await OTP.find({ email: email })
      .sort({ createdAt: -1 })
      .limit(1);
    // otp not found
    if (response.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP doesn't exist",
      });
    }
    // Invalid otp
    else if (response[0].otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // create additional detail(profile) for user
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });
    // create entry in DB
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType: accountType,
      additionalDetails: profileDetails._id,
    });
    // return response
    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log("Failed to signUp", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    // get email and password form req body
    const { email, password } = req.body;
    // validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }
    // check user exist or not
    const user = await User.findOne({ email: email }).populate(
      "additionalDetails"
    );
    if (!user) {
      return res.status(401).json({
        status: false,
        message: "User is not registered.Plaese signup",
      });
    }
    // compare password and generate JWT token
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {
          email: user.email,
          id: user._id,
          accountType: user.accountType,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );
      user.token = token;
      user.password = null;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      // send cookies and return response
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "User logged in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cannot login.Please try again",
    });
  }
};
exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUserPresent = await User.findOne({ email: email });
    if (checkUserPresent) {
      return res.status(401).json({
        status: false,
        message: "User already exist",
      });
    }
    let otp = otpGenarator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    //  console.log("OTP is", otp);

    const result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenarator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    const otpBody = await OTP.create({ email: email, otp: otp });
    console.log("otp Body", otpBody, "otp", otp);

    const emailSender = await mailSender(
      email,
      "Study Notion - Otp Verification",
      otpTemplate(otp)
    );

    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
    });
  } catch (error) {
    console.log("Failed to send otp");
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    // Get user data from req.user
    const id = req.user.id;
    const userDetail = await User.findById(id);

    // get data from req body
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // validate old password
    const isPasswordMatched = await bcrypt.compare(
      oldPassword,
      userDetail.password
    );
    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "The password is incorrect",
      });
    }
    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New Password cannot be same as Old Password",
      });
    }
    // validate new password
    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New Password cannot be same as Old Password",
      });
    }
    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update in DB
    const updatedUserDetails = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
    // send mail to user
    try {
      const emailSender = await mailSender(
        updatedUserDetails.email,
        "Study Notion - Password Update",
        passwordUpdate(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      );
      console.log("Email sent successfully:", emailSender);
    } catch (err) {
      console.error("Error occurred while sending email:", err);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: err.message,
      });
    }
    // return response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error occurred while updating password");
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};

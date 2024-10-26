const mongoose = require("mongoose");

const ratingAndReviewSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    rating:{
        type:Number
    },
    review:{
        type:String
    },
    course :{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Course"
    }
})

module.exports = mongoose.model("RatingAndReview",ratingAndReviewSchema)
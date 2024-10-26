const { default: mongoose } = require("mongoose");
const Course = require("../model/Course");
const RatingAndReview = require("../model/RatingAndReview");
exports.createRating = async(req,res)=>{
    try{
        const userId = req.user.id;
        const {rating,review,courseId} = req.body;
        console.log("----------------------------------------")
        console.log(req)
        const courseDetails = await Course.find({_id:courseId,studentEnrolled:{$elemMatch:{$eq:userId}}})
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                emessage: "Student not enrolled in course"
            });
        }
        
        const alreadyReviewed = await RatingAndReview.find({user:userId,course:courseId})
        
        if(alreadyReviewed.length){
            return res.status(404).json({
                success: false,
                message: "Already reviewed"
            });
        }
        const ratingReview = await RatingAndReview.create({
            rating,
            review,
            user:userId,
            course:courseId
        })

        await Course.findByIdAndUpdate(
            {_id:courseId},
            {$push:{ratingAndReviews:ratingReview._id}}
        )
        return res.status(200).json({
            success: true,
            message: "Rating added successfully",
            ratingReview});


    } catch(error){
            console.log(error);
             return res.status(500).json({
            status:false,
            message: error.message}
            ); 
    }
}

exports.getAvgRating = async(req,res)=>{
    try{
        const {cousreId} = req.body;
        const finalRating = await RatingAndReview.aggregate([
            {$match:{course:new mongoose.Types.ObjectId(cousreId)}},
            {
                $group:{
                    id:null,
                    averageRaing:{$avg:"$rating"}
                }
            }
        ])
        if(finalRating.length > 0){
            return res.status(200).json({
                averageRating: result[0].averageRating
            });
        } else{
            return res.status(400).json({
                message:"Average rating is 0",
                averageRaing:0
            })
        }
    } catch(error){
        console.log(error);
        return res.status(500).json({
            status:false,
            message: error.message
        });
    }
}

exports.getAllRating = async(req,res)=>{
    try{
        // console.log("Inside getAllRatingController")
        const allRatingAndreview = await RatingAndReview.find({}) 
                                            .sort({rating:-1})
                                            .populate({
                                                path:"user",
                                                select:"firstName lastName email image"
                                            })
                                            .populate({
                                                path:"course",
                                                select:"courseName"
                                            })
                                            .exec()
         return res.status(200).json({
            success: true,
            message:"all reviews fetched successfully",
            data:allRatingAndreview,
        });                                    
    } catch(error){
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
}
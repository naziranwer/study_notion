const Course = require("../model/Course");
const Section = require("../model/Section");
const SubSection = require("../model/SubSection");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
require("dotenv").config();

exports.createSubSection = async(req,res)=>{
    try{
        const {sectionId,courseId,title,description} = req.body;
        const video = req.files.videoFile;
        console.log(video)

        if (!sectionId || !title || !description || !video || !courseId ) {
			return res.status(404).json({ 
                success: false,
                 message: "All Fields are Required" 
            });
		}

		const section= await Section.findById(sectionId);
		if (!section) {
            return res.status(404).json({
                 success: false,
                  message: "Section not found"
             });
        }

        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        console.log(uploadDetails)

        const subSectiondetails = await SubSection.create({
            title:title,
            description:description,
            videoUrl:uploadDetails.secure_url
        })

        const updatedSection = await Section.findByIdAndUpdate(
            {_id:sectionId},
            {
                $push:{subSection:subSectiondetails._id},
            },
            {new:true}
        ).populate("subSection").exec()

        const updatedCourse = await Course.findById(courseId)
        .populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        }).exec();

        return res.status(200).json({
             success: true, 
             data: updatedCourse 
            
        });

    } catch(error){
        console.error("Error creating new sub-section:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
    }
}


exports.updateSubSection = async(req,res)=>{
    try{
        const {courseId,sectionId,subSectionId,title,description} = req.body;
        const video = req?.files?.videoFile; // why we are using optional channing;

        let videoDetails = null;
        if(video){
            videoDetails = await uploadImageToCloudinary(video,process.env.FOLDER_VIDEO)
        }

        const updatedSubSection = await SubSection.findByIdAndUpdate(
            {_id:subSectionId},
            {
                title: title || SubSection.title,
                description : description || SubSection.description,
                videoUrl : videoDetails.secure_url || SubSection.videoUrl
            },
            {new:true}
        ).exec()

        await Section.findById(sectionId) // I have written this extra line of code . check whether it is required or not
        .populate("subSection")

        const updatedCourse = await Course.findById(courseId)
        .populate({
            path:"courseContent",
            populate:{
                path:"subsection"
            }
        }).exec()

        return res.status(200).json({ 
            success: true, 
            data: updatedCourse
        });

    } catch(error){
        console.error("Error creating new sub-section:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
    }
}

exports.deleteSubSection = async (req,res)=>{
    try{
        console.log(req.body)
        const {courseId,sectionId,subSectionId} = req.body;
        if(!subSectionId || !sectionId || !courseId){
            return res.status(404).json({
                success: false,
                message: "all fields are requiredddd",
            });
        }
        const ifsubSection = await SubSection.findById({_id:subSectionId});
	    const ifsection= await Section.findById({_id:sectionId});
        if(!ifsubSection){
            return res.status(404).json({
                success: false,
                message: "Sub-section not found",
            });
        }
        if(!ifsection){
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }

        await SubSection.findByIdAndDelete(subSectionId);
        await Section.findByIdAndUpdate(
            {_id:sectionId},
            {
                $pull:{subSection:subSectionId}
            },
            {new:true}
         )

         const updatedCourse = await Course.findById(courseId)
         .populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
         }).exec()

         return res.status(200).json({ 
            success: true, 
            message: "Sub-section deleted", 
            data: updatedCourse 
        });
		
    } catch(error){
        console.error("Error deleting sub-section:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}
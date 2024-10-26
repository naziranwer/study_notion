const Course = require("../model/Course");
const Section = require("../model/Section")

exports.createSection = async(req,res)=>{
    try{
        const {sectionName,courseId} = req.body;
        if (!sectionName || !courseId) {
			return res.status(400).json({
				success: false,
				message: "Missing required properties",
			});
		}
        const course = await Course.findById(courseId);
        if (!course) {
			return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }
        const newSection = await Section.create({sectionName});

        const updatedCourse = await Course.findByIdAndUpdate(
            {_id:courseId},
            {
                $push:{
                    courseContent:newSection._id
                }
            },
            {new:true}

        ).populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        }).exec();

        res.status(200).json({
			success: true,
			message: "Section created successfully",
			updatedCourse,
		});    

    } catch(error){
        res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
    }
}

exports.updateSection = async(req,res)=>{
    try{
        const {sectionName,sectionId,courseId} = req.body;
        if(!sectionName || !sectionId || !courseId){
            return res.status(400).json({
                status:false,
                message:"Please enter all the fields"
            })
        }
        await Section.findByIdAndUpdate(
            {_id:sectionId},
            {sectionName:sectionName},
            {new:true}
        )
        
        const updatedCourse = await Course.findById(courseId)
        .populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        }).exec();

        return res.status(200).json({
			success: true,
			message: "Section updated successfully",
			updatedCourse,

		})

    } catch(error){
        res.status(500).json({
			success: false,
			message: "Internal server error",
		});
    }
}

exports.deleteSection = async(req,res)=>{
    try{
        console.log("Inside delete section APi")
        const {sectionId,courseId} = req.body;

        await Section.findByIdAndDelete(sectionId);

        const updatedCourse = await Course.findById(courseId)
        .populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        }).exec()

        res.status(200).json({
			success: true,
			message: "Section deleted",
			updatedCourse,
		});

    } catch(error){
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
    }
}
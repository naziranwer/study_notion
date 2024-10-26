exports.isDemo = async (req, res, next)=> {
    console.log(req.user.email);
    if (req.user.email === "zimam8588@gmail.com" || req.user.email === "ourbetterworld0@gmail.com") {
        return res.status(401).json({
            success: false,
            message: "This is a Demo User",
        });
    }
    next();
}


//  INCLUDE THIS MIDDLEWARE IN ALL ROUTES(PENDING)
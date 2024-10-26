const express = require("express");
const router = express.Router();

const { capturePayment,
     sendPaymentSuccessEmail, 
     verifyPayment
    } = require("../controllers/payments");

const { auth, 
    isInstructor, 
    isStudent, 
    isAdmin
 } = require("../middleware/authMiddleware")

router.post("/capturePayment", auth,isStudent,capturePayment);
router.post("/verifyPayment", auth,verifyPayment);
router.post("/sendPaymentSuccessEmail", auth,sendPaymentSuccessEmail);


module.exports = router;
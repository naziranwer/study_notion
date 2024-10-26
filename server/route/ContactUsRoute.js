const express = require("express");
const router = express.Router();

const {ContactUs, contactUs} = require("../controllers/ContactUs");


router.post("/contactUs", contactUs);

module.exports = router;
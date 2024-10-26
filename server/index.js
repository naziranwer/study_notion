const express = require("express");
const app = express();

// ALL ROUTES
const contactUsRoutes = require("./route/ContactUsRoute");
const courseRoutes = require("./route/CourseRoute");
const paymentRoutes = require("./route/PaymentRoute");
const profileRoutes = require("./route/ProfileRoute");
const userRoutes = require("./route/UserRoute");
// DATABASE CONNECTION
const database = require("./config/database");
database.connect();

const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5000;

const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");

app.use(express.json());
app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://studynotion-client-aq59.onrender.com",
    ],
    credentials: true,
  })
);

app.use("/api/v1/auth", userRoutes);

app.use("/api/v1/payment", paymentRoutes);

app.use("/api/v1/profile", profileRoutes);

app.use("/api/v1/course", courseRoutes);

app.use("/api/v1/contact", contactUsRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

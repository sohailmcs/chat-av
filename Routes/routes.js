const express = require("express");
const router = express.Router();
const path = require("path");

// video page
router.get("/public/video", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "video.html"));
});

//sign  in / register page
router.get("/public/signin", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "signin.html"));
});

// login page
router.get("/public/login", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "login.html"));
});

//forget password
router.get("/public/forgetPassword", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "forgetPassword.html"));
});

//sign  in / appointment
router.get("/public/upcomingappointment", (req, res, next) => {
  res.sendFile(
    path.join(__dirname, "../", "public", "upcomingappointment.html")
  );
});

// user dashboard
router.get("/public/userDashboard", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "userDashboard.html"));
});

//all doctors
router.get("/public/doctors", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "doctors.html"));
});

//landing page
router.get("/public/index", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "index.html"));
});

module.exports = router;

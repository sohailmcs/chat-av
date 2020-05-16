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

//sign  in doctor dashboard
router.get("/public/doctordashboard", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "doctordashboard.html"));
});

//sign  in video call dashboard
router.get("/public/videocall", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "videocall.html"));
});

//sign  in kindah Patients dashboard
router.get("/public/kindahPatients", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "kindahPatients.html"));
});

//sign  in video call log
router.get("/public/callLog", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "callLog.html"));
});

//sign  in call queue
router.get("/public/callQueue", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "callQueue.html"));
});

//sign  in call queue
router.get("/public/callQueue", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "callQueue.html"));
});

//sign  in call queue
router.get("/public/callQueue", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "callQueue.html"));
});

//sign  in doctorAppointments
router.get("/public/doctorAppointments", (req, res, next) => {
  res.sendFile(
    path.join(__dirname, "../", "public", "doctorAppointments.html")
  );
});

//sign  in edit profile
router.get("/public/editProfile", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "editProfile.html"));
});

//sign  in patient video
router.get("/public/patientVideo", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "patientVideo.html"));
});

module.exports = router;

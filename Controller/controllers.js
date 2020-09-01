var OpenTok = require("opentok");
const request = require("request");

//var OpenTok = require("opentok");
require("dotenv").config();
//=====================get apikey from environment variable=======
var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;

var opentok = new OpenTok(apiKey, apiSecret);
var sessionId;
var gentoken;

opentok.createSession({ mediaMode: "routed" }, function (err, session) {
  if (err) {
    console.log(err);
    res.status(500).send({ error: "createSession error:" + err });
    return;
  }

  // generate token
  token = opentok.generateToken(session.sessionId);
  sessionId = session.sessionId;
  gentoken = token;

  // res.setHeader("Content-Type", "application/json");
  // res.send({
  //   apiKey: apiKey,
  //   sessionId: session.sessionId,
  //   token: token,
  // });
});

exports.getHomePage = (req, res, next) => {
  res.render("index", {
    pageTitle: "Kindah Home",
  });
};
//admin Controllers========
exports.getkindahAdmin = (req, res, next) => {
  var UserName = req.cookies.kindahUserName;
  var userId = req.cookies.kindahUserId;
  res.render("Admin/KindahAdmin.ejs", {
    pageTitle: "Kindah Admin",
    UserName: UserName,
    userId: userId,
  });
};
exports.getkindahCreateDoctor = (req, res, next) => {
  var UserName = req.cookies.kindahUserName;
  var userId = req.cookies.kindahUserId;
  res.render("Admin/KindahCreateDoctor.ejs", {
    pageTitle: "Kindah Create Doctor",
    UserName: UserName,
    userId: userId,
  });
};

exports.getkindahGetAllDoctors = (req, res, next) => {
  var UserName = req.cookies.kindahUserName;
  var userId = req.cookies.kindahUserId;
  res.render("Admin/KindahGetAllDoctors.ejs", {
    pageTitle: "Kindah All Doctors",
    UserName: UserName,
    userId: userId,
  });
};

exports.getDoctorEditProfile = (req, res, next) => {
  var UserName = req.cookies.kindahUserName;
  var userId = req.cookies.kindahUserId;
  res.render("Admin/KindahDocEditProfile.ejs", {
    pageTitle: "Doctor  Edit Profile",
    UserName: UserName,
    userId: userId,
  });
};

//Patient Routes
exports.getPatientDashboard = (req, res, next) => {
  var UserName = req.cookies.kindahUserName;
  var userId = req.cookies.kindahUserId;
  res.render("Patient/patientDashboard.ejs", {
    pageTitle: "Patient Dashboard",
    UserName: UserName,
    userId: userId,
    apiKey: apiKey,
    sessionId: sessionId,
    token: gentoken,
  });
};

exports.getPatientAppointments = (req, res, next) => {
  var UserName = req.cookies.kindahUserName;
  var userId = req.cookies.kindahUserId;
  res.render("Patient/patientAppointments.ejs", {
    pageTitle: "Patient Appointments ",
    UserName: UserName,
    userId: userId,
    apiKey: apiKey,
    sessionId: sessionId,
    token: gentoken,
  });
};

exports.getPatientVideo = (req, res, next) => {
  var UserName = req.cookies.kindahUserName;
  var userId = req.cookies.kindahUserId;
  res.render("Patient/patientVideo.ejs", {
    pageTitle: "Patient Video Call ",
    UserName: UserName,
    userId: userId,
  });
};

exports.getPatientReqAppointment = (req, res, next) => {
  var UserName = req.cookies.kindahUserName;
  var userId = req.cookies.kindahUserId;
  res.render("Patient/patientReqAppointment.ejs", {
    pageTitle: "Patient Req Appointment ",
    UserName: UserName,
    userId: userId,
    apiKey: apiKey,
    sessionId: sessionId,
    token: gentoken,
  });
};

//Doctors Routes

exports.getDoctorViewProfile = (req, res, next) => {
  var UserName = req.cookies.kindahUserName;
  var userId = req.cookies.kindahUserId;
  res.render("Doctor/docViewProfile.ejs", {
    pageTitle: "Doctor View Profile ",
    UserName: UserName,
    userId: userId,
  });
};

exports.getDoctorCallLog = (req, res, next) => {
  var UserName = req.cookies.kindahUserName;
  var userId = req.cookies.kindahUserId;
  res.render("Doctor/docCallLog.ejs", {
    pageTitle: "Doctor Call Log ",
    UserName: UserName,
    userId: userId,
    apiKey: apiKey,
    sessionId: sessionId,
    token: gentoken,
  });
};

exports.getDoctorCallQueue = (req, res, next) => {
  var UserName = req.cookies.kindahUserName;
  var userId = req.cookies.kindahUserId;
  res.render("Doctor/docCallQueue.ejs", {
    pageTitle: "Doctor Call Queue ",
    UserName: UserName,
    userId: userId,
    apiKey: apiKey,
    sessionId: sessionId,
    token: gentoken,
  });
};

exports.getDoctorAppointments = (req, res, next) => {
  var UserName = req.cookies.kindahUserName;
  var userId = req.cookies.kindahUserId;
  res.render("Doctor/docAppointments.ejs", {
    pageTitle: "Doctor Appointments ",
    UserName: UserName,
    userId: userId,
    apiKey: apiKey,
    sessionId: sessionId,
    token: gentoken,
  });
};

exports.getDoctorDashboard = (req, res, next) => {
  var UserName = req.cookies.kindahUserName;
  var userId = req.cookies.kindahUserId;
  res.render("Doctor/docDashboard.ejs", {
    pageTitle: "Doctor Dashboard ",
    UserName: UserName,
    userId: userId,
    apiKey: apiKey,
    sessionId: sessionId,
    token: gentoken,
  });
};

exports.getKindahPatients = (req, res, next) => {
  var UserName = req.cookies.kindahUserName;
  var userId = req.cookies.kindahUserId;
  res.render("Doctor/kindahPatients.ejs", {
    pageTitle: "Kindah Patients ",
    UserName: UserName,
    userId: userId,
    apiKey: apiKey,
    sessionId: sessionId,
    token: gentoken,
  });
};

/// test video call page =====
exports.getDoctorvideocall = (req, res, next) => {
  var UserName = req.cookies.kindahUserName;
  var userId = req.cookies.kindahUserId;
  res.render("Doctor/videocall.ejs", {
    pageTitle: "Doctor Video Call ",
    UserName: UserName,
    userId: userId,
  });
};

exports.getDoctorVideoCall = (req, res, next) => {
  var UserName = req.cookies.kindahUserName;
  var userId = req.cookies.kindahUserId;

  res.render("Doctor/docVideoCall.ejs", {
    pageTitle: "Doctor Video",
    UserName: UserName,
    userId: userId,
    apiKey: apiKey,
    sessionId: sessionId,
    token: gentoken,
  });
};

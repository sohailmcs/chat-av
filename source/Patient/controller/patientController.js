// var flashMessage = require(appRoot+'/common/flashMessageUtils'),
//     Const = require(appRoot+'/common/flashMessageStrings').CONST,
//     config = require(appRoot+'/config/'+appRoot_config+'/sqlConfig');

//model class
// const defaultModel = require('../model/defaultModel');

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

opentok.createSession({ mediaMode: "relayed" }, function (err, session) {
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

class patientController {
  //Contructor Declaration
  constructor() {
    this.name = "Patient";
  }

  async getPatientDashboard(req, res, next) {
    //  var UserName = req.cookies.kindahUserName;
    // var userId = req.cookies.kindahUserId;
    //res.render("Patient/patientDashboard.ejs", {
    res.render(appRoot + "/source/Patient/view/patientDashboard", {
      pageTitle: "Patient Dashboard",
      userName: req.session.userName,
      userId: req.session.userId,
      apiKey: apiKey,
      sessionId: sessionId,
      token: gentoken,
    });
  }

  async getPatientAppointments(req, res, next) {
    //  var UserName = req.cookies.kindahUserName;
    // var userId = req.cookies.kindahUserId;
    //res.render("Patient/patientAppointments.ejs", {
    res.render(appRoot + "/source/Patient/view/patientAppointments", {
      pageTitle: "Patient Appointments ",
      userName: req.session.userName,
      userId: req.session.userId,
      apiKey: apiKey,
      sessionId: sessionId,
      token: gentoken,
    });
  }
  async getPatientWizerd(req, res, next) {
    res.render(appRoot + "/source/Patient/view/AddPatientWizerd", {
      pageTitle: "Add Patient ",
      userName: req.session.userName,
      userId: req.session.userId,
      apiKey: apiKey,
      sessionId: sessionId,
      token: gentoken,
    });
  }
  async getSpeciality(req, res, next) {
    res.render(appRoot + "/source/Patient/view/Speciality", {
      pageTitle: "Speciality ",
      userName: req.session.userName,
      userId: req.session.userId,
      apiKey: apiKey,
      sessionId: sessionId,
      token: gentoken,
    });
  }

  async getPatientVideo(req, res, next) {
    // var UserName = req.cookies.kindahUserName;
    //var userId = req.cookies.kindahUserId;
    //res.render("Patient/patientVideo.ejs", {
    res.render(appRoot + "/source/Patient/view/patientVideo", {
      pageTitle: "Patient Video Call ",
      userName: req.session.userName,
      userId: req.session.userId,
    });
  }

  async getPatientReqAppointment(req, res, next) {
    // var UserName = req.cookies.kindahUserName;
    // var userId = req.cookies.kindahUserId;
    //res.render("Patient/patientReqAppointment.ejs", {
    res.render(appRoot + "/source/Patient/view/patientReqAppointment", {
      pageTitle: "Patient Req Appointment ",
      userName: req.session.userName,
      userId: req.session.userId,
      apiKey: apiKey,
      sessionId: sessionId,
      token: gentoken,
    });
  }
}

module.exports = patientController;

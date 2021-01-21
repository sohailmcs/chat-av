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
  console.log("doctor=" + session.sessionId);
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

class doctorController {
  //Contructor Declaration
  constructor() {
    this.name = "Doctor";
  }

  async getDoctorViewProfile(req, res, next) {
    // var UserName = req.cookies.kindahUserName;
    // var userId = req.cookies.kindahUserId;
    //res.render("Doctor/docViewProfile.ejs", {
    res.render(appRoot + "/source/Doctor/view/docViewProfile", {
      pageTitle: "Doctor View Profile ",
      userName: req.session.userName,
      userId: req.session.userId,
      apiKey: apiKey,
      sessionId: sessionId,
      token: gentoken,
      roleId:req.session.roleId
    });
  }

  async getDoctorCallLog(req, res, next) {
    // var UserName = req.cookies.kindahUserName;
    // var userId = req.cookies.kindahUserId;
    //res.render("Doctor/docCallLog.ejs", {
    res.render(appRoot + "/source/Doctor/view/docCallLog", {
      pageTitle: "Doctor Call Log ",
      userName: req.session.userName,
      userId: req.session.userId,
      apiKey: apiKey,
      sessionId: sessionId,
      token: gentoken,
      roleId:req.session.roleId
    });
  }

  async getDoctorCallQueue(req, res, next) {
    // var userName = req.cookies.userName;
    // var userId = req.cookies.userId;
    //res.render("Doctor/docCallQueue.ejs", {
    res.render(appRoot + "/source/Doctor/view/docCallQueue", {
      pageTitle: "Doctor Call Queue ",
      userName: req.session.userName,
      userId: req.session.userId,
      apiKey: apiKey,
      sessionId: sessionId,
      token: gentoken,
      roleId:req.session.roleId
    });
  }

  async getDoctorAppointments(req, res, next) {
    // var userName = req.cookies.userName;
    // var userId = req.cookies.userId;
    //res.render("Doctor/docAppointments.ejs", {
    res.render(appRoot + "/source/Doctor/view/docAppointments", {
      pageTitle: "Doctor Appointments ",
      userName: req.session.userName,
      userId: req.session.userId,
      apiKey: apiKey,
      sessionId: sessionId,
      token: gentoken,
      roleId:req.session.roleId
    });
  }

  async getDoctorDashboard(req, res, next) {  
    res.render(appRoot + "/source/Doctor/view/docDashboard", {
      pageTitle: "Doctor Dashboard ",
      userName: req.session.userName,
      userId: req.session.userId,
      apiKey: apiKey,
      sessionId: sessionId,
      token: gentoken,
      roleId:req.session.roleId
    });
  }

  async getKindahPatients(req, res, next) {
    // var userName = req.session.userName;
    // var userId = req.session.userId;
    //res.render("Doctor/kindahPatients.ejs", {
    res.render(appRoot + "/source/Doctor/view/kindahPatients", {
      pageTitle: "Kindah Patients ",
      userName: req.session.userName,
      userId: req.session.userId,
      apiKey: apiKey,
      sessionId: sessionId,
      token: gentoken,
      roleId:req.session.roleId
    });
  }

  async getDoctorvideocall(req, res, next) {
    // var userName = req.session.userName;
    // var userId = req.session.userId;
    //res.render("Doctor/videocall.ejs", {
    res.render(appRoot + "/source/Doctor/view/videocall", {
      pageTitle: "Doctor Video Call ",
      userName: req.session.userName,
      userId: req.session.userId,
      roleId:req.session.roleId
    });
  }

  async getDoctorVideoCallQueue(req, res, next) {
    // var userName = req.session.userName;
    // var userId = req.session.userId;

    //res.render("Doctor/docVideoCall.ejs", {
    res.render(appRoot + "/source/Doctor/view/docVideoCall", {
      pageTitle: "Doctor Video",
      userName: req.session.userName,
      userId: req.session.userId,
      apiKey: apiKey,
      sessionId: sessionId,
      token: gentoken,
      roleId:req.session.roleId
    });
  }
}

module.exports = doctorController;

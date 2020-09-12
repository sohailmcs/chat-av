var express = require('express');
var router = express.Router();
var isAuth = require(appRoot+'/middleware/is-Auth.js');
//const isAuth = require("../middleware/is-Auth.js");

//Define Routes Files
const defaultRoute = require(appRoot+'/source/Default/route/defaultRoute');
const loginRoute = require(appRoot+'/source/Login/route/loginRoute');
const logoutRoute = require(appRoot+'/source/Logout/route/logoutRoute');
const signupRoute = require(appRoot+'/source/Signup/route/signupRoute');
const forgetRoute = require(appRoot+'/source/ForgetPassword/route/forgetRoute');
const resetRoute = require(appRoot+'/source/ResetPassword/route/resetRoute');

const adminRoute = require(appRoot+'/source/Admin/route/adminRoute');
const doctorRoute = require(appRoot+'/source/Doctor/route/doctorRoute');
const patientRoute = require(appRoot+'/source/Patient/route/patientRoute');

//#region Agent related routes
// const agentRoute = require(appRoot+'/source/Agent/route/agentRoute');
// const agentFolderSyncRoute = require(appRoot+'/source/Agent/route/agentFolderSyncRoute');
// const agentStubRoute = require(appRoot+'/source/Agent/route/agentStubRoute');
//#endregion

//Define Routes redirections

// router.post('/login', auth.checkLogin, function (req, res, next) {
//     next();
// });

//login routes
//router.get('/', auth.api_protected, defaultRoute);
router.get('/', defaultRoute);
//router.use('/login', auth.api_protected, loginRoute);
router.use('/login',  loginRoute);

router.use('/logout', isAuth.isAuthorization,  logoutRoute);

router.use('/signup',  signupRoute);

router.use('/forgetpassword',  forgetRoute);

router.use('/resetpassword',  resetRoute);

router.use('/admin',  isAuth.isAuthorization, adminRoute);
// router.use('/doctor', isAuth.isAuthorization, doctorRoute);
// router.use('/patient', isAuth.isAuthorization, patientRoute);

router.use('/doctor', isAuth.isAuthorization, doctorRoute);
router.use('/patient', isAuth.isAuthorization, patientRoute);


//logout routes
//router.use('/logout', auth.api_protected,  logoutRoute);
// default routes
//router.use('/default', auth.api_protected, defaultRoute);



module.exports = router;

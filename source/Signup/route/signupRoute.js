const express = require('express');
const router = express.Router();
 
let signupController = require(appRoot+'/source/Signup/controller/signupController');
let SignupController = new signupController();


router.get('/',  SignupController.getSignup.bind(SignupController));

module.exports = router;
const express = require('express');
const router = express.Router();
 
let fogetController = require(appRoot+'/source/ForgetPassword/controller/forgetController');
let ForgetController = new fogetController();


router.get('/',  ForgetController.ForgetPassword.bind(ForgetController));

module.exports = router;
const express = require('express');
const router = express.Router();
 
let resetController = require(appRoot+'/source/ResetPassword/controller/resetController');
let ResetController = new resetController();


router.get('/',  ResetController.ResetPassword.bind(ResetController));

module.exports = router;
const express = require('express');
const router = express.Router();
 
let logoutController = require(appRoot+'/source/Logout/controller/logoutController');
let LogoutController = new logoutController();


router.get('/',  LogoutController.logout.bind(LogoutController));

module.exports = router;
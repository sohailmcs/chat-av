const express = require('express');
const router = express.Router();
 
let loginController = require(appRoot+'/source/Login/controller/loginController');
let LoginController = new loginController();


//router.post('/',  LoginController.checkCredentials.bind(LoginController));
// router.get('/',  LoginController.isTokenValid.bind(LoginController));

router.get('/',  LoginController.getLogin.bind(LoginController));
router.post('/',  LoginController.postLogin.bind(LoginController));

module.exports = router;
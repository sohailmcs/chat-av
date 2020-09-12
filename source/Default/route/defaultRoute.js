const express = require('express');
const router = express.Router();
 
let defaultController = require(appRoot+'/source/Default/controller/defaultController');
let DefaultController = new defaultController();


//router.get('/',  DefaultController.welcome.bind(DefaultController)); 
router.get('/',  DefaultController.HomePage.bind(DefaultController)); 
//router.get("/", KindahController.getHomePage);

module.exports = router;
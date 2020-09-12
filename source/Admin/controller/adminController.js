// var flashMessage = require(appRoot+'/common/flashMessageUtils'),
//     Const = require(appRoot+'/common/flashMessageStrings').CONST,
//     config = require(appRoot+'/config/'+appRoot_config+'/sqlConfig');

     //model class
  // const defaultModel = require('../model/defaultModel');

class defaultController {
    //Contructor Declaration
    constructor() {
        this.name = 'Admin';          
    }    

// async welcome(req, res) {    
//     return res.json(flashMessage.success(Const.SUCCESS, {
//         output:["Welcome to sonasoft api."]
//     }));      
// };

async getkindahAdmin (req, res, next) {
   // var UserName = req.cookies.kindahUserName;
   // var userId = req.cookies.kindahUserId;
    //res.render("Admin/KindahAdmin.ejs", {
      res.render(appRoot+'/source/Admin/view/KindahAdmin', {
      pageTitle: "Kindah Admin",
      userName: req.session.userName ,
      userId: req.session.userId ,
    });
  };

  async getkindahCreateDoctor (req, res, next) {
   // var UserName = req.cookies.kindahUserName;
    //var userId = req.cookies.kindahUserId;
    //res.render("Admin/KindahCreateDoctor.ejs", {
      res.render(appRoot+'/source/Admin/view/KindahCreateDoctor', {
      pageTitle: "Kindah Create Doctor",
      userName: req.session.userName ,
      userId: req.session.userId ,
    });
  };
  
  async getkindahGetAllDoctors (req, res, next) {
   // var UserName = req.cookies.kindahUserName;
    //var userId = req.cookies.kindahUserId;
    //res.render("Admin/KindahGetAllDoctors.ejs", {
      res.render(appRoot+'/source/Admin/view/KindahGetAllDoctors', {
      pageTitle: "Kindah All Doctors",
      userName: req.session.userName ,
      userId: req.session.userId ,
    });
  };
  
  async getDoctorEditProfile  (req, res, next) {
   // var UserName = req.cookies.kindahUserName;
   // var userId = req.cookies.kindahUserId;
    //res.render("Admin/KindahDocEditProfile.ejs", {
      res.render(appRoot+'/source/Admin/view/KindahDocEditProfile', {
      pageTitle: "Doctor  Edit Profile",
      userName: req.session.userName ,
      userId: req.session.userId ,
    });
  };

}

module.exports = defaultController;
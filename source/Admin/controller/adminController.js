// var flashMessage = require(appRoot+'/common/flashMessageUtils'),
//     Const = require(appRoot+'/common/flashMessageStrings').CONST,
//     config = require(appRoot+'/config/'+appRoot_config+'/sqlConfig');

//model class
// const defaultModel = require('../model/defaultModel');

class defaultController {
  //Contructor Declaration
  constructor() {
    this.name = "Admin";
  }

  // async welcome(req, res) {
  //     return res.json(flashMessage.success(Const.SUCCESS, {
  //         output:["Welcome to sonasoft api."]
  //     }));
  // };

  async getkindahAdmin(req, res, next) {
    // var UserName = req.cookies.kindahUserName;
    // var userId = req.cookies.kindahUserId;
    //res.render("Admin/KindahAdmin.ejs", {
    res.render(appRoot + "/source/Admin/view/KindahAdmin", {
      pageTitle: "Kindah Admin",
      userName: req.session.userName,
      userId: req.session.userId,
    });
  }

  async getkindahCreateDoctor(req, res, next) {
    // var UserName = req.cookies.kindahUserName;
    //var userId = req.cookies.kindahUserId;
    //res.render("Admin/KindahCreateDoctor.ejs", {
    res.render(appRoot + "/source/Admin/view/KindahCreateDoctor", {
      pageTitle: "Kindah Create Doctor",
      userName: req.session.userName,
      userId: req.session.userId,
    });
  }

  async getkindahGetAllDoctors(req, res, next) {
    // var UserName = req.cookies.kindahUserName;
    //var userId = req.cookies.kindahUserId;
    //res.render("Admin/KindahGetAllDoctors.ejs", {
    res.render(appRoot + "/source/Admin/view/KindahGetAllDoctors", {
      pageTitle: "Kindah All Doctors",
      userName: req.session.userName,
      userId: req.session.userId,
    });
  }

  async getDoctorEditProfile(req, res, next) {
    // var UserName = req.cookies.kindahUserName;
    // var userId = req.cookies.kindahUserId;
    //res.render("Admin/KindahDocEditProfile.ejs", {
    res.render(appRoot + "/source/Admin/view/KindahDocEditProfile", {
      pageTitle: "Doctor  Edit Profile",
      userName: req.session.userName,
      userId: req.session.userId,
    });
  }

  async getkindahGetAllSpecialities(req, res, next) {
    res.render(appRoot + "/source/Admin/view/KindahGetAllSpecialities", {
      pageTitle: "Kindah All Specialities",
      userName: req.session.userName,
      userId: req.session.userId,
    });
  }

  async getEditSpeciality(req, res, next) {
    res.render(appRoot + "/source/Admin/view/KindahEditSpeciality", {
      pageTitle: "Kindah Edit Speciality",
      userName: req.session.userName,
      userId: req.session.userId,
    });
  }

  async getkindahGetAllRole(req, res, next) {    
    res.render(appRoot + "/source/Admin/view/KindahGetAllRole", {
      pageTitle: "Kindah All Roles",
      userName: req.session.userName,
      userId: req.session.userId,
    });
  }

  async getEditRole(req, res, next) {
    res.render(appRoot + "/source/Admin/view/KindahAddEditRole", {
      pageTitle: "Kindah Edit Roles",
      userName: req.session.userName,
      userId: req.session.userId,
    });
  }

  async getkindahGetAllMenu(req, res, next) {    
    res.render(appRoot + "/source/Admin/view/KindahGetAllMenus", {
      pageTitle: "Kindah All Menus",
      userName: req.session.userName,
      userId: req.session.userId,
    });
  }

  async getEditMenu(req, res, next) {
    res.render(appRoot + "/source/Admin/view/KindahAddEditMenus", {
      pageTitle: "Kindah Edit Menus",
      userName: req.session.userName,
      userId: req.session.userId,
    });
  }

  async getPermission(req, res, next) {
    res.render(appRoot + "/source/Admin/view/KindahManagePermissions", {
      pageTitle: "Kindah Permissions",
      userName: req.session.userName,
      userId: req.session.userId,
    });
  }


  async getkindahGetAllUsers(req, res, next) {    
    res.render(appRoot + "/source/Admin/view/KindahGetAllUsers", {
      pageTitle: "Kindah All Users",
      userName: req.session.userName,
      userId: req.session.userId,
    });
  }


  async getEditUser(req, res, next) {
    res.render(appRoot + "/source/Admin/view/KindahAddEditUser", {
      pageTitle: "Kindah Edit Menus",
      userName: req.session.userName,
      userId: req.session.userId,
    });
  }

  async getkindahGetAllPatient(req, res, next) {    
    res.render(appRoot + "/source/Admin/view/KindahGetAllPatients", {
      pageTitle: "Kindah All Roles",
      userName: req.session.userName,
      userId: req.session.userId,
    });
  }

  async getEditPatient(req, res, next) {
    res.render(appRoot + "/source/Admin/view/KindahAddEditPatient", {
      pageTitle: "Kindah Edit Roles",
      userName: req.session.userName,
      userId: req.session.userId,
    });
  }



}




module.exports = defaultController;

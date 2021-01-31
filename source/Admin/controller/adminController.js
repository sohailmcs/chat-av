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
      roleId:req.session.roleId
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
      roleId:req.session.roleId
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
      roleId:req.session.roleId
    });
  }

  async getkindahGetAllSpecialities(req, res, next) {
    res.render(appRoot + "/source/Admin/view/KindahGetAllSpecialities", {
      pageTitle: "Kindah All Specialities",
      userName: req.session.userName,
      userId: req.session.userId,
      roleId:req.session.roleId
    });
  }

  async getEditSpeciality(req, res, next) {
    res.render(appRoot + "/source/Admin/view/KindahEditSpeciality", {
      pageTitle: "Kindah Edit Speciality",
      userName: req.session.userName,
      userId: req.session.userId,
      roleId:req.session.roleId
    });
  }

  async getkindahGetAllRole(req, res, next) {    
    res.render(appRoot + "/source/Admin/view/KindahGetAllRole", {
      pageTitle: "Kindah All Roles",
      userName: req.session.userName,
      userId: req.session.userId,
      roleId:req.session.roleId
    });
  }

  async getEditRole(req, res, next) {
    res.render(appRoot + "/source/Admin/view/KindahAddEditRole", {
      pageTitle: "Kindah Edit Roles",
      userName: req.session.userName,
      userId: req.session.userId,
      roleId:req.session.roleId
    });
  }

  async getkindahGetAllMenu(req, res, next) {    
    res.render(appRoot + "/source/Admin/view/KindahGetAllMenus", {
      pageTitle: "Kindah All Menus",
      userName: req.session.userName,
      userId: req.session.userId,
      roleId:req.session.roleId
    });
  }

  async getEditMenu(req, res, next) {
    res.render(appRoot + "/source/Admin/view/KindahAddEditMenus", {
      pageTitle: "Kindah Edit Menus",
      userName: req.session.userName,
      userId: req.session.userId,
      roleId:req.session.roleId
    });
  }

  async getPermission(req, res, next) {
    res.render(appRoot + "/source/Admin/view/KindahManagePermissions", {
      pageTitle: "Kindah Permissions",
      userName: req.session.userName,
      userId: req.session.userId,
      roleId:req.session.roleId
    });
  }


  async getkindahGetAllUsers(req, res, next) {    
    res.render(appRoot + "/source/Admin/view/KindahGetAllUsers", {
      pageTitle: "Kindah All Users",
      userName: req.session.userName,
      userId: req.session.userId,
      roleId:req.session.roleId
    });
  }


  async getEditUser(req, res, next) {
    res.render(appRoot + "/source/Admin/view/KindahAddEditUser", {
      pageTitle: "Kindah Edit Users",
      userName: req.session.userName,
      userId: req.session.userId,
      roleId:req.session.roleId
    });
  }

  async getkindahGetAllValues(req, res, next) {    
    res.render(appRoot + "/source/Admin/view/KindahGetAllValueAndStatus", {
      pageTitle: "Kindah All Status",
      userName: req.session.userName,
      userId: req.session.userId,
      roleId:req.session.roleId
    });
  }


  async getEditValues(req, res, next) {
    res.render(appRoot + "/source/Admin/view/KindahAddEditTermsConditions", {
      pageTitle: "Kindah Edit Status",
      userName: req.session.userName,
      userId: req.session.userId,
      roleId:req.session.roleId
    });
  }

  async getkindahGetAllPatient(req, res, next) {    
    res.render(appRoot + "/source/Admin/view/KindahGetAllPatients", {
      pageTitle: "Kindah All Patient",
      userName: req.session.userName,
      userId: req.session.userId,
      roleId:req.session.roleId
    });
  }

  async getEditPatient(req, res, next) {
    res.render(appRoot + "/source/Admin/view/KindahAddEditPatient", {
      pageTitle: "Kindah Edit Patient",
      userName: req.session.userName,
      userId: req.session.userId,
      roleId:req.session.roleId
    });
  }

 async getkindahGetAllFee(req, res, next) {    
    res.render(appRoot + "/source/Admin/view/KindahGetAllFeeStructure", {
      pageTitle: "Kindah All Fee",
      userName: req.session.userName,
      userId: req.session.userId,
      roleId:req.session.roleId
    });
  }

  async getEditFee(req, res, next) {
    res.render(appRoot + "/source/Admin/view/KindahAddEditFeeStructure", {
      pageTitle: "Kindah Edit Fee",
      userName: req.session.userName,
      userId: req.session.userId,
      roleId:req.session.roleId
    });
  }



  async getkindahGetAllFeedBack(req, res, next) {    
    res.render(appRoot + "/source/Admin/view/KindahGetAllFeedback", {
      pageTitle: "Kindah All Feedback",
      userName: req.session.userName,
      userId: req.session.userId,
      roleId:req.session.roleId
    });
  }

  async getViewFeedBack(req, res, next) {
    res.render(appRoot + "/source/Admin/view/KindahAddEditFeedBack", {
      pageTitle: "Kindah Edit Feedback",
      userName: req.session.userName,
      userId: req.session.userId,
      roleId:req.session.roleId
    });
  }

  async getkindahGetAllSuggestion(req, res, next) {    
    res.render(appRoot + "/source/Admin/view/KindahGetAllSuggestion", {
      pageTitle: "Kindah All Suggestions",
      userName: req.session.userName,
      userId: req.session.userId,
      roleId:req.session.roleId
    });
  }

  async getViewSuggestion(req, res, next) {
    res.render(appRoot + "/source/Admin/view/KindahAddEditSuggestions", {
      pageTitle: "Kindah View Suggestions",
      userName: req.session.userName,
      userId: req.session.userId,
      roleId:req.session.roleId
    });
  }


}


module.exports = defaultController;

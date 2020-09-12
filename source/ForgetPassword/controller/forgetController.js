// var flashMessage = require(appRoot + '/common/flashMessageUtils'),    
//     infLog = require(appRoot + '/services/loggerService').infoLog,
//     errLog = require(appRoot + '/services/loggerService').errorLog,
//     sqlUtils = require(appRoot + '/db/SqlDAL'),        
//     Const = require(appRoot + '/common/flashMessageStrings').CONST,    
//     msg = require(appRoot + '/common/flashMessageStrings').g_msg;

//model class

//let UserComponent = require(appRoot + '/components/userMasterComponent');
//let userComponent = new UserComponent();


class forgetPasswordController {
    //Contructor Declaration
    constructor() {
        this.name = 'Forget Password';
    }   

    async ForgetPassword (req, res, next) {
      //res.render("Auth/forgetPassword", {
        res.render(appRoot+'/source/ForgetPassword/view/forgetPassword', {
        PageTitle: "Forget Password",
      });
    };
    
}

module.exports = forgetPasswordController;

// var flashMessage = require(appRoot + '/common/flashMessageUtils'),    
//     infLog = require(appRoot + '/services/loggerService').infoLog,
//     errLog = require(appRoot + '/services/loggerService').errorLog,
//     sqlUtils = require(appRoot + '/db/SqlDAL'),        
//     Const = require(appRoot + '/common/flashMessageStrings').CONST,    
//     msg = require(appRoot + '/common/flashMessageStrings').g_msg;

//model class

//let UserComponent = require(appRoot + '/components/userMasterComponent');
//let userComponent = new UserComponent();


class signupController {
    //Contructor Declaration
    constructor() {
        this.name = 'SignUp';
    }   

    async getSignup (req, res, next) 
    {   
      
      if(!req.session.userId)
      {
          res.render(appRoot+'/source/Signup/view/signup', {
            PageTitle: "Sign Up",
          });
     }
    else{

          if (req.session.userType == "Patient")
          {      
            return res.redirect('/patient/speciality/');
          }   
          else  if (req.session.userType == "Doctor")
          {              
            return res.redirect('/doctor/dashboard/');     
          }         

        }
      

      };
      
}

module.exports = signupController;

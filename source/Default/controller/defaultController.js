// var flashMessage = require(appRoot+'/common/flashMessageUtils'),
//     Const = require(appRoot+'/common/flashMessageStrings').CONST,
//     config = require(appRoot+'/config/'+appRoot_config+'/sqlConfig');

     //model class
  // const defaultModel = require('../model/defaultModel');

class defaultController {
    //Contructor Declaration
    constructor() {
        this.name = 'Default';          
    }    

// async welcome(req, res) {    
//     return res.json(flashMessage.success(Const.SUCCESS, {
//         output:["Welcome to sonasoft api."]
//     }));      
// };

async HomePage(req, res, next){
    //res.render("index", {
      res.render(appRoot+'/source/Default/view/index', {
      pageTitle: "Kindah Home",
    });
  };


}

module.exports = defaultController;
class resetPasswordController {
    //Contructor Declaration
    constructor() {
        this.name = 'Reset Password';
    }   

    async ResetPassword (req, res, next) {
      //res.render("Auth/forgetPassword", {
        res.render(appRoot+'/source/ResetPassword/view/resetPassword', {
        PageTitle: "Reset Password",
      });
    };
    
}

module.exports = resetPasswordController;

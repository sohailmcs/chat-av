class logoutController {
  //Contructor Declaration
  constructor() {
    this.name = "Logout";
  }

  async logout(req, res) {
    try {
      console.log("session destory");
      req.session.destroy();
      res.redirect("/");
    } catch (error) {
      // errLog.err(msg[Const.ERR_SOMETHING_WENT_WRONG] + ' ' + error);
      // return res.json(flashMessage.error_custom(req, Const.ERR_SOMETHING_WENT_WRONG, msg[Const.ERR_SOMETHING_WENT_WRONG] + ' ' + error, {
      //     output: [],
      // }));
    }
  }
}

module.exports = logoutController;

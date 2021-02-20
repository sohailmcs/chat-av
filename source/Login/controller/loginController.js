
const request = require("request");
const config = require(appRoot + "/config/" + appRoot_config + "/config.js");

class loginController {
  //Contructor Declaration
  constructor() {
    this.name = "Login";
  }

  async getLogin(req, res, next) {
    // console.log('login ' + appRoot+'/source/Login/view/login');

    //console.log('login controller ' + req.session.userId);
    if (!req.session.userId) {
      res.render(appRoot + "/source/Login/view/login", {
        PageTitle: "Login",
        PageError: "",
        show_modal: false,
        data: "",
      
      });
    } else {
      if (req.session.userType.toLowerCase() == "Patient".toLowerCase()) {
        return res.redirect("/patient/speciality/");
      } else if (req.session.userType.toLowerCase() == "Doctor".toLowerCase()) {
        return res.redirect("/doctor/dashboard/");
      }
    }
    
  }

  async postLogin(req, res, next) {
    // console.log("action fire " + req.body.email);

    var url = config.serviceURL + "User/SignIn";
    //console.log('url '+url);
    var userInfo = {
      UserName: req.body.email,
      Password: req.body.Password,
    };

    const options = {
      url: url,
      json: true,
      body: {
        UserName: req.body.email,
        Password: req.body.Password,
      },
    };

    request.post(options, (err, resp, data) => {      
     
      if (err) {
        console.log("err " + err);
        // return console.log(err);
        res.render(appRoot + "/source/Login/view/login", {
          PageTitle: "Login",
          PageError: err,
          show_modal: false,
          data: "",
        });
        //return console.log(err);
      } else {
        if (data.UserType!=null) {
          req.session.userType = data.UserType;
          req.session.userId = data.UserId;
          req.session.userName = data.FullName;
          req.session.roleId = data.RoleId;
          req.session.photo = data.Photo

          if (data.UserType.toLowerCase() == "Patient".toLowerCase()) {
            return res.redirect("/patient/speciality/");
            // return res.redirect("/patient/dashboard/");
          } else if (data.UserType.toLowerCase() == "Doctor".toLowerCase()) {
            return res.redirect("/doctor/dashboard/");
          } else if (data.UserType.toLowerCase() == "Admin".toLowerCase()) {
            return res.redirect("/Admin/all-doctors/");
          }
        } else {
          if (resp.statusCode == "401") {
            res.render(appRoot + "/source/Login/view/login", {
              PageTitle: "Login",
              PageError: "User UnVerified",
              show_modal: true,
              data: "",
              //data: resp.body,
            });
          } else if (
            resp.statusCode == "417" &&
            resp.body == "Wrong userName or password"
          ) {
            res.render(appRoot + "/source/Login/view/login", {
              PageTitle: "Login",
              PageError: resp.body,
              show_modal: false
            });
          } else if (
            resp.statusCode == "404" &&
            resp.body == "User does not exist"
          ) {
            res.render(appRoot + "/source/Login/view/login", {
              PageTitle: "Login",
              PageError: resp.body,
              show_modal: false
            });
          } else {
            res.render(appRoot + "/source/Login/view/login", {
              PageTitle: "Login",
              PageError: "Wrong user detail. Please try ager later",
              show_modal: false
            });
          }
        }
      }
    });
  }
}

module.exports = loginController;

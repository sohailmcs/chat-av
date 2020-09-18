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
      });
    } else {
      if (req.session.userType == "Patient") {
        return res.redirect("/patient/dashboard/");
      } else if (req.session.userType == "Doctor") {
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
      //console.log('fire method '+JSON.stringify(data));      
      if (err) {
        //console.log('err '+err);
       // return console.log(err);
          res.render(appRoot + "/source/Login/view/login", {
            PageTitle: "Login",
            PageError: err,
          });        
        //return console.log(err);

      } else {
        //console.log(`Status: ${resp.statusCode}`);
        //console.log(data);
        //   setCookie("kindahUserType", data.UserType, 1);
        // setCookie("kindahUserId", data.UserId, 1);
        // setCookie("kindahUserName", data.FullName, 1);
        req.session.userType = data.UserType;
        req.session.userId = data.UserId;
        req.session.userName = data.FullName;

        // console.log('resp '+JSON.stringify(resp));
        // console.log('data '+JSON.stringify(data));
        // console.log('resp.status '+ resp[0]['status']);

        if (data == "Wrong userName or Password") {
          //console.log('error count');
          // res.send('User already exist but unverified');
          res.render(appRoot + "/source/Login/view/login", {
            PageTitle: "Login",
            PageError: data,
          });
        }
        else if (data.Message == "User doest not exist") {
          //console.log('error count');
          // res.send('User already exist but unverified');
          res.render(appRoot + "/source/Login/view/login", {
            PageTitle: "Login",
            PageError: data.Message,
          });
        }
         else if (data.UserType == "Patient") {
          //window.location.href = "/patient/dashboard";
          //res.redirect('/patient/dashboard');
          // res.render(appRoot+'/source/Patient/view/patientDashboard', {
          //   pageTitle: "Patient Dashboard",
          //   UserName: data.FullName,
          //   userId: data.UserId,
          // });
          return res.redirect("/patient/dashboard/");
        } else if (data.UserType == "Doctor") {
          //req.location.href = "/doctor/dashboard";
          // console.log('redirect url');
          // console.log('session userName '+req.session.userName);
          //res.redirect('/doctor');
          return res.redirect("/doctor/dashboard/");
          //res.redirect('/patient/dashboard');
          // res.render(appRoot+'/source/Doctor/view/docDashboard', {
          //   pageTitle: "Doctor Dashboard",
          //   UserName: data.FullName,
          //   userId: data.UserId,
          // });
        } else {
          //window.location.href = "/docDashboard";
          //res.redirect('/docDashboard');

          if (data.status == "401" && data.statusText == "Unauthorized") {
            // res.send('User already exist but unverified');
            res.render(appRoot + "/source/Login/view/login", {
              PageTitle: "Login",
              PageError: data.statusText,
            });
          }

          //   $(".error").show().text("User already exist but unverified");
          // else if (xhr.status == "404" && xhr.statusText == "Not Found")
          //   $(".error").show().text(xhr.statusText);
          // else if (xhr.status == "406" && xhr.statusText == "NotAcceptable")
          //   $(".error").show().text("Invalid user type");
          // else if (xhr.status == "417")
          //   $(".error").show().text("Wrong userName or Password");
          // else $(".error").show().text(xhr.statusText);
        }
      }
    });
  }
}

module.exports = loginController;

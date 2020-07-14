function isAuthorization(req, res, next) {
  // if (!req.cookies.kindahUserName) {
  //   return res.redirect("/login");
  // }
  next();
}

function isLoginExist(req, res, next) {
  // if (req.cookies.kindahUserName) {
  //   if (req.cookies.kindahUserType == "Patient")
  //     return res.redirect("/patientDashboard");
  //   else return res.redirect("/docDashboard");
  // }
  next();
}

module.exports = {
  isLoginExist: isLoginExist,
  isAuthorization: isAuthorization,
};

function isAuthorization(req, res, next) {
  // if (!req.cookies.kindahUserName) {
  console.log("req.session  " + req.session.userId);
  if (!req.session.userId) {
    //console.log('middle second ' + req.session.userId);
    return res.redirect("/login");
    
  } else {
    res.set(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );

    next();
  }
}

function isLoginExist(req, res, next) {
  // if (req.cookies.kindahUserName) {
  //   if (req.cookies.kindahUserType == "Patient")
  if (req.session.userId) {
    if (req.session.userType == "Patient")
      return res.redirect("/speciality/");
    if (req.session.userType == "Doctor") return res.redirect("/docDashboard");
    else return res.redirect("/Admin/all-doctors/");
  }
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
}

module.exports = {
  isLoginExist: isLoginExist,
  isAuthorization: isAuthorization,
};

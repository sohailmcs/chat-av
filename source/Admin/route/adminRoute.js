const express = require("express");
const router = express.Router();

let adminController = require(appRoot +
  "/source/Admin/controller/adminController");
let AdminController = new adminController();

// router.get('/KindahAdmin',  AdminController.getkindahAdmin.bind(AdminController));
// router.get('/KindahCreateDoctor',  AdminController.getkindahCreateDoctor.bind(AdminController));
// router.get('/KindahGetAllDoctors',  AdminController.getkindahGetAllDoctors.bind(AdminController));
// router.get('/KindahDocEditProfile',  AdminController.getDoctorEditProfile.bind(AdminController));

router.get("/", AdminController.getkindahAdmin.bind(AdminController));
router.get(
  "/create-doctor",
  AdminController.getkindahCreateDoctor.bind(AdminController)
);
router.get(
  "/all-doctors",
  AdminController.getkindahGetAllDoctors.bind(AdminController)
);
router.get(
  "/edit-profile",
  AdminController.getDoctorEditProfile.bind(AdminController)
);

// router.get("/KindahAdmin", KindahController.getkindahAdmin);
// router.get("/KindahCreateDoctor", KindahController.getkindahCreateDoctor);
// router.get("/KindahGetAllDoctors", KindahController.getkindahGetAllDoctors);
// router.get("/KindahDocEditProfile", KindahController.getDoctorEditProfile);

module.exports = router;

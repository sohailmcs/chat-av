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
router.get(
  "/all-specialities",
  AdminController.getkindahGetAllSpecialities.bind(AdminController)
);
router.get(
  "/edit-speciality",
  AdminController.getEditSpeciality.bind(AdminController)
);
router.get(
  "/all-role",
  AdminController.getkindahGetAllRole.bind(AdminController)
);

router.get(
  "/edit-role",
  AdminController.getEditRole.bind(AdminController)
);

router.get(
  "/all-menus",
  AdminController.getkindahGetAllMenu.bind(AdminController)
);

router.get(
  "/edit-menu",
  AdminController.getEditMenu.bind(AdminController)
);

router.get(
  "/manage-permission",
  AdminController.getPermission.bind(AdminController)
);

router.get(
  "/all-users",
  AdminController.getkindahGetAllUsers.bind(AdminController)
);
router.get(
  "/edit-user",
  AdminController.getEditUser.bind(AdminController)
);

router.get(
  "/all-values",
  AdminController.getkindahGetAllValues.bind(AdminController)
);

router.get(
  "/edit-values",
  AdminController.getEditValues.bind(AdminController)
);

router.get(
  "/all-patient",
  AdminController.getkindahGetAllPatient.bind(AdminController)
);

router.get(
  "/edit-patient",
  AdminController.getEditPatient.bind(AdminController)
);

router.get(
  "/all-feedBack",
  AdminController.getkindahGetAllFeedBack.bind(AdminController)
);

router.get(
  "/view-details",
  AdminController.getViewFeedBack.bind(AdminController)
);

router.get(
  "/all-fee",
  AdminController.getkindahGetAllFee.bind(AdminController)
);

router.get(
  "/addEdit-Fee",
  AdminController.getEditFee.bind(AdminController)
);


router.get(
  "/all-suggestions",
  AdminController.getkindahGetAllSuggestion.bind(AdminController)
);

router.get(
  "/view-detialSuggestions",
  AdminController.getViewSuggestion.bind(AdminController)
);

router.get(
  "/view-financial",
  AdminController.getKindahFinancial.bind(AdminController)
);


// router.get("/KindahAdmin", KindahController.getkindahAdmin);
// router.get("/KindahCreateDoctor", KindahController.getkindahCreateDoctor);
// router.get("/KindahGetAllDoctors", KindahController.getkindahGetAllDoctors);
// router.get("/KindahDocEditProfile", KindahController.getDoctorEditProfile);

module.exports = router;

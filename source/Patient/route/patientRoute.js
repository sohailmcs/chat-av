const express = require("express");
const router = express.Router();

let patientController = require(appRoot +
  "/source/Patient/controller/patientController");
let PatientController = new patientController();

router.get(
  "/appointments",
  PatientController.getPatientAppointments.bind(PatientController)
);
router.get(
  "/dashboard",
  PatientController.getPatientDashboard.bind(PatientController)
);

router.get(
  "/Speciality",
  PatientController.getSpeciality.bind(PatientController)
);
router.get(
  "/AddPatient",
  PatientController.getPatientWizerd.bind(PatientController)
);

router.get("/video", PatientController.getPatientVideo.bind(PatientController));
router.get(
  "/appointment/:docId?/:docName?/:date?/:appId?",
  PatientController.getPatientReqAppointment.bind(PatientController)
);

// router.get("/patientAppointments",isAuth.isAuthorization,KindahController.getPatientAppointments);
// router.get("/patientDashboard",isAuth.isAuthorization,KindahController.getPatientDashboard);
// router.get("/patientVideo",isAuth.isAuthorization,KindahController.getPatientVideo);
// router.get("/patientReqAppointment/:DoctorId?/:DocName?/:date?/:appId?",isAuth.isAuthorization,KindahController.getPatientReqAppointment);

module.exports = router;

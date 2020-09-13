const express = require("express");
const router = express.Router();

let doctorController = require(appRoot +
  "/source/Doctor/controller/doctorController");
let DoctorController = new doctorController();

router.get(
  "/call-log",
  DoctorController.getDoctorCallLog.bind(DoctorController)
);
router.get(
  "/call-queue",
  DoctorController.getDoctorCallQueue.bind(DoctorController)
);
router.get(
  "/dashboard",
  DoctorController.getDoctorDashboard.bind(DoctorController)
);
router.get(
  "/appointments",
  DoctorController.getDoctorAppointments.bind(DoctorController)
);
router.get(
  "/kindahPatients",
  DoctorController.getKindahPatients.bind(DoctorController)
);

router.get(
  "/video-call",
  DoctorController.getDoctorvideocall.bind(DoctorController)
);
router.get(
  "/call/:queId?/:patientId?/:patientName?/:docId?/:docName?/:userLoginId?",
  DoctorController.getDoctorVideoCallQueue.bind(DoctorController)
);
router.get(
  "/profile/:id?",
  DoctorController.getDoctorViewProfile.bind(DoctorController)
);

// router.get("/videocall",isAuth.isAuthorization,KindahController.getDoctorvideocall);
// router.get("/docVideoCall/:queId?/:patientId?/:patientName?/:DocId?/:docName?/:userLoginId?",isAuth.isAuthorization,KindahController.getDoctorVideoCall);
// router.get("/docViewProfile",isAuth.isAuthorization,KindahController.getDoctorViewProfile);

// router.get("/docCallLog",isAuth.isAuthorization,KindahController.getDoctorCallLog);
// router.get("/docCallQueue",isAuth.isAuthorization,KindahController.getDoctorCallQueue);
// router.get("/docDashboard",isAuth.isAuthorization,KindahController.getDoctorDashboard);
// router.get("/docAppointments",isAuth.isAuthorization,KindahController.getDoctorAppointments);
// router.get("/kindahPatients",isAuth.isAuthorization,KindahController.getKindahPatients);

module.exports = router;

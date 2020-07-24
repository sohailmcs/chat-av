var baseURL = "https://kindahclinic.com/KindahService/";

var clientCurrentDt = new Date().toLocaleDateString("en-US");

var options = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};
var currentDt = new Date().toLocaleDateString("en-US", options);

var userLoginId = $(".user-name").attr("UserInfo");
var uName = $(".user-name").text();
var socket = io();
$(function () {
  GetDoctorBookedScheduled(userLoginId, clientCurrentDt, true);
  GetAllQuedScheduled(userLoginId, clientCurrentDt);
  GetCallLog(userLoginId, clientCurrentDt);

  //=================Update patient EMR ==============
  $(document).on("click", ".btnUpdatePrescription", function () {
    var callLogId = $(this).attr("callLogId");
    getCallLogDetils(callLogId, false);
  });

  //=================Complete call log  ==============
  $(document).on("click", ".btn_complateCall", function () {
    var callLogId = $(this).attr("cLogId");
    ComplatecallLog(callLogId, "Completed");
  });

  //=================open dialog to update patient EMR ==============
  $(document).on("click", "#btnSaveUpdateEMR", function () {
    var callLogId = $("#hdncallLogId").val();
    updatePatientEMR(callLogId, "");
  });

  //===============Accept call ==============
  $(document).on("click", ".btnAcceptCall", function () {
    var callreqId = $(this).attr("callreqID");
    var docId = $(this).attr("docID");
    var patientId = $(this).attr("PatientID");
    var PatientName = $(this).attr("PName");

    AcceptOrRejectCallSaveToQue(
      callreqId,
      "Accepted",
      docId,
      "Direct",
      patientId,
      currentDt
    )
      .then((data) => {
        GetAllQuedScheduled(docId, clientCurrentDt);
        GetDoctorBookedScheduled(docId, clientCurrentDt);
        toast("Patient Has Been Added in Call Queue");
        socket.emit("AcceptRejectCall", {
          AcceptCall: true,
          TokenNo: data,
          username: PatientName,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  });
  //=================get patient History ==============
  $(document).on("click", ".btnViewHistory", function () {
    var callLogId = $(this).attr("clogid");
    getCallLogDetils(callLogId, true);
  });
  //==================Reject call================
  $(document).on("click", ".btnRejectCall", function () {
    var callreqId = $(this).attr("callreqID");
    var docId = $(this).attr("docID");
    var patientId = $(this).attr("PatientID");
    var PatientName = $(this).attr("PName");

    AcceptOrRejectCallSaveToQue(
      callreqId,
      "Reject",
      docId,
      "Direct",
      patientId,
      currentDt
    )
      .then((data) => {
        GetAllQuedScheduled(docId, clientCurrentDt);
        GetDoctorBookedScheduled(docId, clientCurrentDt, false);
        toast("Patient request has been cancelled");

        socket.emit("AcceptRejectCall", {
          AcceptCall: false,
          TokenNo: "",
          username: PatientName,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  });
  //=============Accept/Add scheduled request to Que======
  $(document).on("click", ".btnAcceptSch", function () {
    var callreqId = $(this).attr("scheId");
    var docId = $(this).attr("docID");
    var patientId = $(this).attr("PatientID");

    AcceptOrRejectCallSaveToQue(
      callreqId,
      "Accepted",
      docId,
      "Scheduled",
      patientId,
      currentDt
    )
      .then((data) => {
        GetAllQuedScheduled(docId, currentDt);
        GetDoctorBookedScheduled(docId, currentDt, false);
      })
      .catch((error) => {
        console.log(error);
      });
  });
}); //==end of jquery $function

function GetDoctorBookedScheduled(DoctorId, date, isSync) {
  var url =
    baseURL +
    "Appointments/GetDoctorBookedSchedule?DoctorId=" +
    DoctorId +
    "&date=" +
    date;

  $.ajax({
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    type: "GET",
    datatype: "application/json",
    contentType: "application/json; charset=utf-8",
    data: "",
    beforeSend: function () {
      if (!isSync) $.LoadingOverlay("show");
    },
    success: function (data, textStatus, xhr) {
      $.LoadingOverlay("hide");
      var scheduledTemplate = $("#Scheduled-template").html();
      $("#schTemplate").html(Mustache.to_html(scheduledTemplate, data));

      var reqTemplate = $("#req-template").html();
      $("#reqTemplate").html(Mustache.to_html(reqTemplate, data));
    },
    error: function (xhr, textStatus, err) {
      if (xhr.status == "500" && xhr.statusText == "InternalServerError")
        console.log(xhr.statusText);
      else console.log(xhr.statusText);
    },
    complete: function (data) {
      // Hide Loading
      $.LoadingOverlay("hide");
    },
  });
}

function AcceptOrRejectCallSaveToQue(
  callreqId,
  status,
  docId,
  reqType,
  patientId,
  currentDt
) {
  return new Promise((resolve, reject) => {
    var url = baseURL + "PatientCallRequest/AcceptRejectPatientCallRequest";
    //======= set post model======//
    var callRequest = {
      callReQuestID: callreqId,
      status: status,
      doctorId: docId,
      requestType: reqType,
      patientId: patientId,
      currDt: currentDt,
      pageName: window.location.pathname,
      pageUrl: window.location.href,
    };
    $.ajax({
      url: url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      type: "POST",
      datatype: "application/json",
      contentType: "application/json; charset=utf-8",
      data: callRequest,
      beforeSend: function () {
        $.LoadingOverlay("show");
      },
      success: function (data, textStatus, xhr) {
        $.LoadingOverlay("hide");
        resolve(data);
      },
      error: function (xhr, textStatus, err) {
        reject(err);
      },
      complete: function (data) {
        // Hide Loading
        $.LoadingOverlay("hide");
      },
    });
  });
}

function GetAllQuedScheduled(doctorId, date) {
  var url =
    baseURL + "CallQue/GetCallQue?doctorID=" + doctorId + "&date=" + date;
  $.ajax({
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    type: "GET",
    datatype: "application/json",
    contentType: "application/json; charset=utf-8",
    data: "",
    beforeSend: function () {
      $.LoadingOverlay("show");
    },
    success: function (data, textStatus, xhr) {
      $.LoadingOverlay("hide");

      var queTemplate = $("#que-template").html();
      $("#QueTemplate").html(Mustache.to_html(queTemplate, data));
    },
    error: function (xhr, textStatus, err) {
      if (xhr.status == "500" && xhr.statusText == "InternalServerError")
        console.log(xhr.statusText);
      else console.log(xhr.statusText);
    },
    complete: function (data) {
      // Hide Loading
      //======show patient waiting time in quee=========
      updateClock();
      $.LoadingOverlay("hide");
    },
  });
}

function UpdateQueAddSaveCallLog(CallQueId, status, doctorID, PatientId) {
  var url =
    baseURL +
    "CallQue/UpdateCallQueStatus?CallQueId=" +
    CallQueId +
    "&status=" +
    status;

  var model = {
    DoctorID: doctorID,
    PatientID: PatientId,
    CallQueID: CallQueId,
    AddedBy: doctorID,
    AddedDate: new Date().toLocaleDateString("en-us"),
  };
  $.ajax({
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    type: "GET",
    datatype: "application/json",
    contentType: "application/json; charset=utf-8",
    data: model,
    beforeSend: function () {
      $.LoadingOverlay("show");
    },
    success: function (data, textStatus, xhr) {
      $.LoadingOverlay("hide");

      // var queTemplate = $("#que-template").html();
      // $("#QueTemplate").html(Mustache.to_html(queTemplate, data));
    },
    error: function (xhr, textStatus, err) {
      if (xhr.status == "500" && xhr.statusText == "InternalServerError")
        console.log(xhr.statusText);
      else console.log(xhr.statusText);
    },
    complete: function (data) {
      // Hide Loading
      $.LoadingOverlay("hide");
    },
  });
}

///====================== show timer for patient added in que======================
var timer;
function updateClock() {
  $(".spnWaitingTime").each(function () {
    var dtCalllQue = $(this).siblings(".hdnCallQueDate").val();

    var startDateTime = new Date(dtCalllQue); // YYYY (M-1) D H m s ms (start time and date from DB)
    var startStamp = startDateTime.getTime();

    var newDate = new Date();
    var newStamp = newDate.getTime();

    newDate = new Date();
    newStamp = newDate.getTime();
    var diff = Math.round((newStamp - startStamp) / 1000);

    var d = Math.floor(
      diff / (24 * 60 * 60)
    ); /* though I hope she won't be working for consecutive days :) */
    diff = diff - d * 24 * 60 * 60;
    var h = Math.floor(diff / (60 * 60));
    diff = diff - h * 60 * 60;
    var m = Math.floor(diff / 60);
    diff = diff - m * 60;
    var s = diff;

    $(this).text(m + " min " + s + " sec");
  });
}
timer = setInterval(updateClock, 1000);
///====================== show timer for patient added in que======================

function GetCallLog(doctorId, date) {
  var url =
    baseURL +
    "CallLogs/GetDoctorRecentCallLog?doctorID=" +
    doctorId +
    "&date=" +
    date;

  $.ajax({
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    type: "GET",
    datatype: "application/json",
    contentType: "application/json; charset=utf-8",
    data: "",
    beforeSend: function () {
      $.LoadingOverlay("show");
    },
    success: function (data, textStatus, xhr) {
      $.LoadingOverlay("hide");

      var queTemplate = $("#callLog-template").html();
      $("#tblCallLogs").html(Mustache.to_html(queTemplate, data));
    },
    error: function (xhr, textStatus, err) {
      if (xhr.status == "500" && xhr.statusText == "InternalServerError")
        console.log(xhr.statusText);
      else console.log(xhr.statusText);
    },
    complete: function (data) {
      // Hide Loading
      $.LoadingOverlay("hide");
    },
  });
}

function getCallLogDetils(callLogId, details) {
  var url = baseURL + "CallLogs/GetPatientHistory?callLogId=" + callLogId;

  $.ajax({
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    type: "GET",
    datatype: "application/json",
    contentType: "application/json; charset=utf-8",
    data: "",
    beforeSend: function () {
      $.LoadingOverlay("show");
    },
    success: function (data, textStatus, xhr) {
      $.LoadingOverlay("hide");

      if (details) {
        //========show only details========
        var ViewHistoryTemplate = $("#viewHistory-template").html();
        $("#viewhistory").html(Mustache.to_html(ViewHistoryTemplate, data));
        $("#viewhistory").modal("show");
      } else {
        //=========open dialog for update==========
        $("#hdncallLogId").val(callLogId);
        $("#imgPatient").attr(
          "src",
          data.PatientPhoto == null
            ? "/assets/images/patient.png"
            : data.PatientPhoto
        );
        $("#patientName").text(data.PatientName);
        $("#details").html(
          "<p><b>Visit Date :</b>" +
            data.CallLogStartDateTime +
            "<br><b>Contact Number :</b>" +
            data.PatientPhone +
            "</P>"
        );
        $("#txtExam").val(data.HistoryAndExam);
        $("#txtAllergies").val(data.Allergies);
        $("#txtDiagnosis").val(data.Diagnosis);
        $("#txtRx").val(data.PatientRX);
        $("#txtmedication").val(data.Medication);
        $("#prescription").modal("show");
      }
    },
    error: function (xhr, textStatus, err) {
      if (xhr.status == "500" && xhr.statusText == "InternalServerError")
        console.log(xhr.statusText);
      else console.log(xhr.statusText);
    },
    complete: function (data) {
      // Hide Loading
      $.LoadingOverlay("hide");
    },
  });
}

function updatePatientEMR(callLogId, status) {
  var url = baseURL + "CallLogs/UpdateCallLog";

  var model = {
    CallLogID: callLogId,
    HistoryAndExam: $("#txtExam").val(),
    Allergies: $("#txtAllergies").val(),
    Diagnosis: $("#txtDiagnosis").val(),
    PatientRX: $("#txtRx").val(),
    Medication: $("#txtmedication").val(),
    callStatus: status,
  };

  $.ajax({
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    type: "POST",
    datatype: "application/json",
    contentType: "application/json; charset=utf-8",
    data: model,
    beforeSend: function () {
      $.LoadingOverlay("show");
    },
    success: function (data, textStatus, xhr) {
      $.LoadingOverlay("hide");
      Swal.fire({
        title: "Confirmation!",
        text: "Patient EMR Updated ",
        type: "success",
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: false,
        confirmButtonText: "Ok",
      }).then((result) => {
        window.location.reload();
      });
    },
    error: function (xhr, textStatus, err) {
      if (xhr.status == "500" && xhr.statusText == "InternalServerError")
        console.log(xhr.statusText);
      else console.log(xhr.statusText);
    },
    complete: function (data) {
      // Hide Loading
      $.LoadingOverlay("hide");
    },
  });
}

function ComplatecallLog(callLogId, status) {
  var url =
    baseURL +
    "CallLogs/CompleteCallLog?callLogId=" +
    callLogId +
    "&status=" +
    status;

  $.ajax({
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    type: "GET",
    datatype: "application/json",
    contentType: "application/json; charset=utf-8",
    data: "",
    beforeSend: function () {
      $.LoadingOverlay("show");
    },
    success: function (data, textStatus, xhr) {
      $.LoadingOverlay("hide");
      Swal.fire({
        title: "Confirmation!",
        text: "Call Complated ",
        type: "success",
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: false,
        confirmButtonText: "Ok",
      }).then((result) => {
        window.location.reload();
      });
    },
    error: function (xhr, textStatus, err) {
      if (xhr.status == "500" && xhr.statusText == "InternalServerError")
        console.log(xhr.statusText);
      else console.log(xhr.statusText);
    },
    complete: function (data) {
      // Hide Loading
      $.LoadingOverlay("hide");
    },
  });
}

function OpenCommunicationWindow(btn) {
  var CallQueId = $(btn).attr("CallQueId");
  var PatientID = $(btn).attr("PatientID");
  var callLogId = $(btn).attr("cLogId");
  var pname = $(btn).attr("patientName");

  params = "width=" + screen.width;
  params += ", height=" + screen.height;
  params += ", top=0, left=0";
  params += ", fullscreen=yes";
  var myWindow = window.open(
    "/docVideoCall?queId=" +
      CallQueId +
      "&patientId=" +
      PatientID +
      "&patientName=" +
      pname +
      "&DocId=" +
      userLoginId +
      "&docName=" +
      uName +
      "&CallLogId=" +
      callLogId +
      "&comm=1",
    "CommunicationWindow",
    params
  );
}

Mustache.Formatters = {
  date: function (str) {
    var options = {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(str).toLocaleDateString("en-US", options);
  },
  Upper: function (str) {
    return str.toUpperCase();
  },
};

function toast(msg) {
  // make sure..
  setTimeout(function () {
    // create the notification
    var notification = new NotificationFx({
      message: "<p>" + msg + " </p>",
      layout: "growl",
      effect: "genie",
      type: "notice", // notice, warning or error
      // onClose: function () {
      // // bttn.disabled = false;
      // },
    });
    // show the notification
    notification.show();
    this.disabled = true;
  }, 100);
}

//======for automatic play sound we just need to add this code for modern===
window.onload = function () {
  context = new AudioContext();
};

//==========push notification from patient
soc.on("SendNotificationToDoctor", function (data) {
  GetDoctorBookedScheduled(data.docId, clientCurrentDt, true);
  //======Play Notification sould for incomming CallRequest
  $(
    ' <audio id="chatAudio"><source src="/js/Services/notify.ogg" type="audio/ogg"> <source src="/js/Services/notify.mp3" type="audio/mpeg"><source src="/js/Services/notify.wav" type="audio/wav"></audio>'
  ).appendTo("body");

  $("#chatAudio").get(0).play();
});

var baseURL = "https://kindahclinic.com/KindahService/";
var urlParams = new URLSearchParams(window.location.search);
var queId = urlParams.get("queId");
var docId = urlParams.get("DocId");
var docName = urlParams.get("docName");
var cLogId = urlParams.get("CallLogId");
var patientId = urlParams.get("patientId");
var PatientName = urlParams.get("patientName");
var area = urlParams.get("area");
var timer;
var onCallduration;
var callPerformed = false;
var insertedCallLogID;

function refreshParent() {
  if (window.opener != null && !window.opener.closed) {
    // && area == "Patient") {
    window.opener.location.reload();
  }
}
//call the refresh page on closing the window
window.onunload = refreshParent;

$(window).bind("beforeunload", function () {
  //==========if user has on called then called disconnect=====
  if (callPerformed) disconnect();
  soc.emit("ClosePatientScreen", {
    username: PatientName,
  });
});

$(function () {
  $(".btnSave").click(function () {
    updateDoctorNotes(cLogId, "");
  });

  //============start of patient streaming======================
  if (area == "Patient") {
    $("#divCallNow").hide();
    $(".rightcardContainer").remove();
    $(".leftcardContainer").removeClass("col-lg-7");

    $("<iframe>", {
      src:
        "https://tokbox.com/embed/embed/ot-embed.js?embedId=665f6ca0-7039-4a63-bca6-2bafd7656a3c&room=DEFAULT&iframe=true",
      id: "myFrame",
      frameborder: 0,
      scrolling: "no",
      width: "600",
      height: "600",
      allow: "microphone; camera",
    }).appendTo(".main-video-div");
    $(".videocol").addClass("patientCallingWindow");
  }

  $(".btnSaveNSend").click(function () {
    updatePrescription(cLogId, $("#patientAge").val(), patientId);
  });
  //========get patient history===============
  if (area != "Patient") {
    PatientHistory(patientId);
    $("#divCallNow").show();
    $("#call-heading")
      .text("Calling with " + PatientName)
      .css("width", "100%");
  } else {
    $("#call-heading").text("Calling with DR." + docName);
    $(".videocol").find("div.icons").remove();
    $(".rightcardContainer").remove();
  }
  //==========ge doctor not==========
  if (cLogId != 0 && area != "Patient") {
    GetDoctorNotes(cLogId);
  } else if (queId != 0 && area != "Patient") {
    getPatientInfo(patientId);
  }

  $(document).on("click", ".btnViewPres", function () {
    var CallLogId = $(this).attr("CallID");
    if (cLogId != 0 && area != "Patient") {
      ViewPrescription(CallLogId);
    }
  });

  $(document).on("click", ".btnviewhistory", function () {
    var CallLogId = $(this).attr("CallID");
    ViewHistory(CallLogId);
  });

  //===========start functionality calling=================
  $("#btnCallNow").click(function () {
    if (queId != "0") {
      UpdateQueAddSaveCallLog(queId, "Called", docId, patientId);
    }
    //=============Play calling sound =====================
    PlayCallingSound(true);
    //=========send call request to paatient============
    soc.emit("SendCallRequestToPatient", {
      pName: PatientName,
      username: docName,
    });
  });
  //===========end functionality calling======================

  //============end of patient streaming======================
}); //=====================end of $function==========================
function performCall() {
  callPerformed = true;
  PlayCallingSound(false);
  timer = setInterval(countTimer, 1000);
  $("<iframe>", {
    src:
      "https://tokbox.com/embed/embed/ot-embed.js?embedId=665f6ca0-7039-4a63-bca6-2bafd7656a3c&room=DEFAULT&iframe=true",
    id: "myFrame",
    frameborder: 0,
    scrolling: "no",
    width: "600",
    height: "600",
    allow: "microphone; camera",
  }).appendTo(".main-video-div");
}

//============calculate calling time==============
//var timerVar = setInterval(countTimer, 1000);
var totalSeconds = 0;
function countTimer() {
  ++totalSeconds;
  var hour = Math.floor(totalSeconds / 3600);
  var minute = Math.floor((totalSeconds - hour * 3600) / 60);
  var seconds = totalSeconds - (hour * 3600 + minute * 60);
  if (hour < 10) hour = "0" + hour;
  if (minute < 10) minute = "0" + minute;
  if (seconds < 10) seconds = "0" + seconds;
  document.getElementById("timer").innerHTML =
    "Time Duration: " + hour + ":" + minute + ":" + seconds;
  onCallduration = hour + ":" + minute + ":" + seconds;
}

//============calculate calling time==============

function disconnect() {
  clearInterval(timer);
  var newCallLoginId;
  if (cLogId == 0 && queId != 0) newCallLoginId = insertedCallLogID;
  else newCallLoginId = cLogId;

  if (callPerformed) UpdateCallLogEndtime(newCallLoginId, onCallduration);
  $(".three-icons").css("display", "none");
  $("#divCallNow").css("display", "block");
  PlayCallingSound(false);

  soc.emit("ClosePatientScreen", {
    username: PatientName,
  });
}

function PlayCallingSound(play) {
  $(
    ' <audio id="chatAudio" loop="loop"><source src="/js/Services/calling.ogg" type="audio/ogg"> <source src="/js/Services/calling.mp3" type="audio/mpeg"><source src="/js/Services/calling.wav" type="audio/wav"></audio>'
  ).appendTo("body");

  var audio = $("#chatAudio");
  if (play == true) audio.get(0).play();
  else $("#chatAudio").remove();
}

// ========prescription modal pop up==========
function ViewPrescription(CallLogId) {
  var url = baseURL + `CallLogs/GetPatientHistory?callLogId=${CallLogId}`;
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
      // $.LoadingOverlay("show");
    },
    success: function (data, textStatus, xhr) {
      var PrescTemplate = $("#viewPres-template").html();
      $("#viewprescription").html(Mustache.to_html(PrescTemplate, data));
      $("#viewprescription").modal("show");
    },
    error: function (xhr, textStatus, err) {
      console.log("error");
      if (xhr.status == "500" && xhr.statusText == "InternalServerError")
        console.log(xhr.statusText);
      else console.log(xhr.statusText);
    },
    complete: function (data) {
      // Hide Loading
      // $.LoadingOverlay("hide");
    },
  });
}

//history pop up
function ViewHistory(CallLogId) {
  var url = baseURL + `CallLogs/GetPatientHistory?callLogId=${CallLogId}`;
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
      // $.LoadingOverlay("show");
    },
    success: function (data, textStatus, xhr) {
      console.log("success ");
      console.log(data);
      var ViewHistoryTemplate = $("#viewHistory-template").html();
      $("#viewhistory").html(Mustache.to_html(ViewHistoryTemplate, data));
      $("#viewhistory").modal("show");
    },
    error: function (xhr, textStatus, err) {
      console.log("error");
      if (xhr.status == "500" && xhr.statusText == "InternalServerError")
        console.log(xhr.statusText);
      else console.log(xhr.statusText);
    },
    complete: function (data) {
      // Hide Loading
      // $.LoadingOverlay("hide");
    },
  });
}
function PatientHistory(patientId) {
  var url = baseURL + `CallLogs/GetPatientCalllogs?PatientId=${patientId}`;

  // view visit history table
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
      var CallLogTableTemplate = $("#call-history-docVideo").html();
      $("#callLogTable").html(Mustache.to_html(CallLogTableTemplate, data));
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
    type: "POST",
    datatype: "application/json",
    contentType: "application/json; charset=utf-8",
    data: model,
    beforeSend: function () {
      $.LoadingOverlay("show");
    },
    success: function (data, textStatus, xhr) {
      insertedCallLogID = data;
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

function GetDoctorNotes(callLogId) {
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

      //=========open dialog for update==========
      $("#txtExam").val(data.HistoryAndExam);
      $("#txtAllergies").val(data.Allergies);
      $("#txtDiagnosis").val(data.Diagnosis);
      $("#txtRx").val(data.PatientRX);
      $("#txtName").val(data.PatientName);
      $("#txtMedication").val(data.Medication);
      $("#patientAge").val(data.Age);
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

function getPatientInfo(PatientId) {
  var url = baseURL + "Patient/GetPatientDetails?PatientId=" + PatientId;

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

      //=========open dialog for update==========
      $("#txtName").val(data.FullName);
      $("#patientAge").val(data.Age);
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

function updateDoctorNotes(callLogId, status) {
  $(".doctorNotesLoading").show();
  $(".btnSave").prop("disabled", true);
  var url = baseURL + "CallLogs/UpdateCallLog";
  var model = {
    CallLogID: callLogId,
    HistoryAndExam: $("#txtExam").val(),
    Allergies: $("#txtAllergies").val(),
    Diagnosis: $("#txtDiagnosis").val(),
    PatientRX: $("#txtRx").val(),
    callStatus: status,
  };

  $.ajax({
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    type: "Post",
    datatype: "application/json",
    contentType: "application/json; charset=utf-8",
    data: model,
    beforeSend: function () {},
    success: function (data, textStatus, xhr) {
      $(".msg")
        .text("Doctor note addedd successfully")
        .css({ color: "green", "font-weight": "bold" });
    },
    error: function (xhr, textStatus, err) {
      if (xhr.status == "500" && xhr.statusText == "InternalServerError")
        console.log(xhr.statusText);
      else console.log(xhr.statusText);
    },
    complete: function (data) {
      $(".doctorNotesLoading").hide();
      $(".btnSave").prop("disabled", false);

      $(".msg").delay(1000).fadeOut("slow");
    },
  });
}

function updatePrescription(callLogId, age, patientId) {
  $(".PrescripeLoading").show();
  $(".btnSaveNSend").prop("disabled", true);
  var url =
    baseURL +
    "CallLogs/UpatePrescription?Age=" +
    age +
    "&PatientId=" +
    patientId;
  var model = {
    CallLogID: callLogId,
    Medication: $("#txtMedication").val(),
    Diagnosis: $("#txtPresDiagnosis").val(),
    prescribeDt: $("#prescribeDT").val(),
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
    beforeSend: function () {},
    success: function (data, textStatus, xhr) {
      $(".msgPrescription")
        .text("Prescription addedd successfully")
        .css({ color: "green", "font-weight": "bold" });
    },
    error: function (xhr, textStatus, err) {
      if (xhr.status == "500" && xhr.statusText == "InternalServerError")
        console.log(xhr.statusText);
      else console.log(xhr.statusText);
    },
    complete: function (data) {
      $(".btnSaveNSend").prop("disabled", false);
      $(".PrescripeLoading").hide();
      $(".msgPrescription").delay(1000).fadeOut("slow");
    },
  });
}

function UpdateCallLogEndtime(CallLogId, duration) {
  var url =
    baseURL +
    "CallLogs/UpdateCallLogEndtime?CallLogId=" +
    CallLogId +
    "&Duration=" +
    duration;

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
    success: function (data, textStatus, xhr) {},
    error: function (xhr, textStatus, err) {
      if (xhr.status == "500" && xhr.statusText == "InternalServerError")
        console.log(xhr.statusText);
      else console.log(xhr.statusText);
    },
    complete: function (data) {
      // Hide Loading
    },
  });
}

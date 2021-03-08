//var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";

var isShowVideo = false;
var isAudioEnable = false;
var AudioVideosession;
var publisher;
var subscriber;
var allsubscribers;
var page;

if ($(".modal-backdrop").length > 1) {
  $(".modal-backdrop").not(":first").remove();
}
var mCallQueId;
var mPatientID;
var mCallLogId;
var mPname;
var mParentId;
var pType;
var mParentName;
var mDocName;
var mDocId;
var mArea;
var mSpeciality;
var fistCallLogId = 0;


var timer;
var onCallduration;
var callPerformed = false;

var options = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};
dragElement(document.getElementById("publisher"));

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(elmnt.id)) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id).onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

$(function () {
  // $("#patientAge").on("change", function () {
  //   CalculateAge($(this).val());
  // });
  $(document).on("click", "button.close", function (event) {
    event.preventDefault();
    var $this = $(event.currentTarget);
    var modalId = $this.closest("div.modal").attr("id");

    if (modalId == "windowComm") {
      disconnect();
    }
    $("#" + modalId + "").modal("hide");
  });

  var $content, $modal, $apnData, $modalCon;
  $content = $(".min");

  $(".btnDisconnect").click(function () {
    disconnect();
  });

  $(".modalMinimize").on("click", function () {
    $("body").removeClass("modal-open");
    $modalCon = $(this).closest(".mymodal").attr("id");
    $apnData = $(this).closest(".mymodal");
    $modal = "#" + $modalCon;
    $(".modal-backdrop").addClass("display-none");
    $($modal).toggleClass("min");
    if ($($modal).hasClass("min")) {
      $(".minmaxCon").append($apnData);
      $(this).find("i").toggleClass("bx-minus").toggleClass("bx-minus");
      $("#windowComm .modal-header").removeClass("bg-primary");
      //   .addClass("bg-primaryMin");
      $("#windowComm .bg-primary").css("border", "1px solid rgb(151 148 148)");
    } else {
      $("body").append($apnData);
      $(this).find("i").toggleClass("bx-minus").toggleClass("bx-minus");
      $("#windowComm .bg-primary").css("border", "none");
      $("#windowComm .modal-header")
        .removeClass("bg-primaryMin")
        .addClass("bg-primary");
      $(".modal-backdrop").removeClass("display-none");
    }
  });

  $("button[data-dismiss='modal']").on("click", function () {
    // disconnect();
    $(this).closest(".mymodal").removeClass("min");

    // $(".container").removeClass($apnData);
  });
  $(".btnSave").on("click", function () {
    var newCalllogId =
      $("#insertedID").val() == "0" ? mCallLogId : $("#insertedID").val();
    updateDoctorNotes(newCalllogId, "OnGoing");
  });

  $(".btnSaveNSend").on("click", function () {
    var newCalllogId =
      $("#insertedID").val() == "0" ? mCallLogId : $("#insertedID").val();
    updatePrescription(
      newCalllogId,
      $("#patientAge").val(),
      $("#txtName").val(),
      mPatientID
    );
  });
  //========get patient history===============
  if (mArea != "Patient") {
    //PatientHistory(patientId);
    $("#divCallNow").show();
    $("#callImg").css("display", "block");
  } else {
    $("#callImg").css("display", "none");
    $(".three-icons").css("display", "block");
    $(".videocol").find("div.icons").remove();
    $(".rightcardContainer").remove();

    $("#divCallNow").hide();
    $(".leftcardContainer").removeClass("col-lg-7");
    $(".videocol").addClass("patientCallingWindow");
  }

  $(document).on("click", ".btnViewPres", function () {
    var CallLogId = $(this).attr("CallID");
    ViewPrescription(CallLogId);
  });

  $(document).on("click", ".btnviewhistory", function () {
    var CallLogId = $(this).attr("CallID");
    ViewHistory(CallLogId);
  });

  //===========start functionality calling=================
  $("#btnCallNow").on("click", function () {
    var patientId = mPatientID;
    if (pType != "Me") patientId = mParentId;
    checkOnlineStatusandCall(patientId, "Patient")
      .then((data) => {
        if (data) {
          //=============Play calling sound =====================
          $("#callImg").css("display", "none");
          PlayCallingSound(true);
          //=========send call request to paatient============
        
          soc.emit("SendCallRequestToPatient", {
            pName: mPname,
            username: mDocName,
            DoctorSpeciality : mSpeciality,
            apiKey: apiKey,
            sessionId: sessionId,
            token: token,
          });

          initializeSession(apiKey, sessionId, token);
          $("#divCallNow").hide();
          $(".three-icons").show();
        } else {
          Swal.fire({
            type: "SORRY!",
            title: "info...",
            text: "Patient is not available ",
            confirmButtonClass: "btn btn-primary",
            buttonsStyling: false,
            confirmButtonText: "Ok",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

  //===========end functionality calling======================
}); //=====================end of $function==========================

//======================= start managing Audio/Video communication=======================
function handleError(error) {
  if (error) {
    console.log(error.message);
    // disconnect();
  }
}

function initializeSession(key, sessId, tokenId) {
  AudioVideosession = OT.initSession(key, sessId, tokenId);

  AudioVideosession.on({
    sessionReconnecting: function (event) {
      $("#log")
        .css("display", "block")
        .text("Disconnected. Attempting to reconnect...");
    },
    sessionReconnected: function (event) {
      $("#log").css("display", "block").text("Connected.");
      $("#log").delay(3000).fadeOut("slow");
    },
    sessionDisconnected: function (event) {
      if (event.reason == "networkDisconnected") {
        $("#log")
          .css({ display: "block", color: "#525a65" })
          .text("No internet connection.Please check and try connecting again.")
          .delay(3000)
          .fadeOut("slow");
      } else {
        if (publisher) {
          AudioVideosession.unpublish(publisher, handleError);
          publisher.destroy();
        }
        if (subscriber) AudioVideosession.unsubscribe(subscriber);

        $("#log")
          .css({ display: "block", color: "#525a65" })
          .text("Disconnected")
          .delay(3000)
          .fadeOut("slow");
        if (mArea == "Patient") {
          $("#windowComm").modal("hide");
        }
      }
      PlayCallingSound(false);
      clearInterval(timer);
    },
    connectionCreated: function (event) {
      if (
        event.connection.connectionId !=
        AudioVideosession.connection.connectionId
      ) {
        PlayCallingSound(false);
        timer = setInterval(countTimer, 1000);
        $("#timer").css("display", "block");
        callPerformed = true;
        $("#home-tab-justified, #profile-tab-justified").removeClass(
          "disabled"
        );
        $("#home-tab-justified, #home-just").addClass("active");
        $("#messages-tab-justified,#messages-just").removeClass("active");
        if (mCallQueId != "0" && typeof(mCallQueId) != "undefined" && $("#insertedID").val() == "0") {
          UpdateQueAddSaveCallLog(
            mCallQueId,
            "Called",
            mDocId,
            mPatientID,
            page
          );
        }
      }
    },
    connectionDestroyed: function connectionDestroyedHandler(event) {
      //letting others know you left the connection in this method.
      disconnect();
      clearInterval(timer);
      PlayCallingSound(false);
      $(".three-icons, #timer").css("display", "none");
      $("#divCallNow").css("display", "block");
      $("#callImg").css("display", "block");

      $("#log")
        .css({ display: "block", color: "#525a65" })
        .text("Disconnected")
        .delay(3000)
        .fadeOut("slow");
    },
    streamCreated: function (event) {
      $("#divCallNow").hide();
      $(".three-icons").show();

      var subscriberOptions = {
        insertMode: "append",
        width: "100%",
        height: "100%",
        style: { buttonDisplayMode: "off" },
      };
      subscriber = AudioVideosession.subscribe(
        event.stream,
        "subscribers",
        subscriberOptions,
        handleError
      );
      subscriber.on({
        audioBlocked: function (event) {
          $("#log")
            .css("display", "block")
            .text("Your partner audio is block.")
            .delay(4000)
            .fadeOut("slow");
        },
        audioUnblocked: function (event) {
          $("#log")
            .css("display", "block")
            .text("Your partner audio is unblocked.")
            .delay(4000)
            .fadeOut("slow");
        },
      });
    },
  });

  // initialize the publisher
  var publisherOptions = {
    insertMode: "append",
    width: "100%",
    height: "100%",
    style: { buttonDisplayMode: "off" },
  };
  publisher = OT.initPublisher("publisher", publisherOptions, handleError);

  // Connect to the session
  AudioVideosession.connect(tokenId, function callback(error) {
    if (error) {
      if (error.name === "OT_NOT_CONNECTED") {
        console.log(
          "You are not connected to the internet. Check your network connection."
        );
      }
      console.log("Failed to connect: ", error.message);
      handleError(error);
    } else {
      // If the connection is successful, publish the publisher to the session
      AudioVideosession.publish(publisher, handleError).on(
        "streamDestroyed",
        function (event) {
          streamDestroyed(event);
        }
      );
    }
  });
}

function enabldDisableCamera() {
  if (isShowVideo) {
    AudioVideosession.publish(publisher);
    publisher.publishVideo(true);
    isShowVideo = false;
    $("#btncam i").addClass("bx-video").removeClass("bxs-video-off"); //replace icon
  } else {
    AudioVideosession.unpublish(publisher);
    publisher.publishVideo(false);
    isShowVideo = true;
    $("#btncam i").addClass("bxs-video-off").removeClass("bx-video"); //replace icon
  }
}
function enabldDisableMic() {
  if (isAudioEnable) {
    publisher.publishAudio(true);
    isAudioEnable = false;
    $("#btnMic i").addClass("bx-microphone").removeClass("bxs-microphone-off"); //replace icon
  } else {
    publisher.publishAudio(false);
    isAudioEnable = true;
    $("#btnMic i").addClass("bxs-microphone-off").removeClass("bx-microphone"); //replace icon
  }
}

//======================= end managing Audio/Video communication=======================

function performCall() {}

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

function streamDestroyed(event) {
  event.preventDefault();
  //  AudioVideosession.disconnect();
  //  AudioVideosession.destroy();
  //  AudioVideosession.unpublish(publisher);
  //                  console.log("The publisher stopped streaming. Reason: "
  //                   + event.reason);
}

function disconnect() {
  clearInterval(timer);
  if ($(".slide-left").css("display") == "inline-block")
    $(".slide-left").trigger("click");

  if (publisher) {
    AudioVideosession.unpublish(publisher, handleError);
    publisher.destroy();
  }
  var newCalllogId = mCallLogId == 0 ? $("#insertedID").val() : mCallLogId;
  //clearInterval(timer);
  if (subscriber) AudioVideosession.unsubscribe(subscriber);
  if (AudioVideosession) {
    AudioVideosession.off();
    AudioVideosession.disconnect();
  }

  // $("#windowComm").modal("hide");
  PlayCallingSound(false);
  $(".three-icons, #timer").css("display", "none");
  $("#divCallNow").css("display", "block");
  $("#callImg").css("display", "block");

  //if (callPerformed && mArea == "Doctor") {
  if (callPerformed && mArea == "Doctor") {
    soc.emit("ClosePatientScreen", {
      pName: mPname,
      CallLogId: mCallLogId,
      DoctorId: mDocId,
      PatientId: mPatientID,
      callConnect: callPerformed,
    });
    // AudioVideosession.unsubscribe(subscriber);
    UpdateCallLogEndtime(newCalllogId, onCallduration);
  } else {
    // else only close patient incomming call window.
    soc.emit("ClosePatientScreen", {
      pName: mPname,
      CallLogId: mCallLogId,
      DoctorId: mDocId,
      PatientId: mPatientID,
    });
  }
  callPerformed = false;
}

function PlayCallingSound(play) {
  $(
    ' <audio id="chatAudio" loop="loop"><source src="/js/Services/calling.ogg" type="audio/ogg"> <source src="/js/Services/calling.mp3" type="audio/mpeg"><source src="/js/Services/calling.wav" type="audio/wav"></audio>'
  ).appendTo("body");

  var audio = $("#chatAudio");
  if (play) audio.get(0).play();
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
      getAge();
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
      getAge();
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

function checkOnlineStatusandCall(patientId, userType) {
  return new Promise((resolve, reject) => {
    var url =
      baseURL +
      "User/getUserInfo?patientId=" +
      patientId +
      "&userType=" +
      userType;

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

function UpdateQueAddSaveCallLog(CallQueId, status, doctorID, PatientId, page) {
  
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
    CallLogStartDateTime: new Date().toLocaleDateString("en-US", options),
    AddedDate: new Date().toLocaleDateString("en-us", options),
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
      // $.LoadingOverlay("show");
    },
    success: function (data, textStatus, xhr) {
      // $.LoadingOverlay("hide");

      $("#insertedID").val(data);
    },
    error: function (xhr, textStatus, err) {
      if (xhr.status == "500" && xhr.statusText == "InternalServerError")
        console.log(xhr.statusText);
      else console.log(xhr.statusText);
    },
    complete: function (data) {
      if (page == "DashBoard") getDashBoardAllScheduled(true);
      else GetDoctorTodayCallQue(userLoginId, true);
    },
  });
}

function GetDoctorNotes(callLogId) {
  var url = baseURL + "CallLogs/GetPatientHistory?callLogId=" + callLogId;
  $("textarea").val("");

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
      if (data != null) {
        //=========open dialog for update==========
        $("#txtExam").val(data.HistoryAndExam);
        $("#txtAllergies").val(data.Allergies);
        $("#txtDiagnosis").val(data.Diagnosis);
        $("#txtRx").val(data.PatientRX);
        $("#txtName").val(data.PatientName);
        $("#txtPresDiagnosis").val(data.Diagnosis);
        // $("#txtMedication").val(data.Medication);
        $("#txtMedication").data("kendoEditor").value(data.Medication);
        //==Get DOB=====

        $("#patientAge").val(data.Age);
        //==Calculate age from DOB=====
        CalculateAge(data.Age);
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
      CalculateAge(data.Age);
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
    CallQueID: mCallQueId,
    DoctorID: mDocId,
    PatientID: mPatientID,
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
      Swal.fire({
        title: "Confirmation!",
        text: "Doctor note addedd successfully",
        timer: 3000,
        type: "success",
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: false,
        confirmButtonText: "Ok",
      });

      if (mCallQueId != 0 && mCallLogId == 0) mCallLogId == data.cLogId;
    },
    error: function (xhr, textStatus, err) {
      if (xhr.status == "500" && xhr.statusText == "InternalServerError")
        console.log(xhr.statusText);
      else console.log(xhr.statusText);
    },
    complete: function (data) {
      $(".doctorNotesLoading").hide();
      $(".btnSave").prop("disabled", false);
    },
  });
}

function updatePrescription(callLogId, age, name, patientId) {
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
    Medication: $("#txtMedication").data("kendoEditor").value(), //$("#txtMedication").val(),
    Diagnosis: $("#txtPresDiagnosis").val(),
    prescribeDt: $("#prescribeDT").val(),
    PatientName: name,
    DoctorName: mDocName,
    CallQueID: mCallQueId,
    DoctorID: mDocId,
    PatientID: patientId,
    Age: $("#patientAge").val(),
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
      Swal.fire({
        title: "Confirmation!",
        text: "Prescription send  successfully",
        timer: 3000,
        type: "success",
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: false,
        confirmButtonText: "Ok",
      });
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
  var currentDt = new Date().toLocaleDateString("en-US", options);

  var url =
    baseURL +
    "CallLogs/UpdateCallLogEndtime?CallLogId=" +
    CallLogId +
    "&Duration=" +
    duration +
    "&CallLogEndDateTime=" +
    currentDt;

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
      $.LoadingOverlay("hide");
      if (mArea == "Doctor" && page == "DashBoard")
        getDashBoardAllScheduled(true);
    },
  });
}

function CalculateAge(userinput) {
  //collect input from HTML form and convert into date format
  // var userinput = document.getElementById("txtInfoAge").value;
  var dob = new Date(userinput);

  //check user provide input or not
  if (userinput == null || userinput == "") {
    document.getElementById("spnAge").innerHTML = "**Choose a date please!";
    return false;
  }

  //execute if the user entered a date
  else {
    //extract the year, month, and date from user date input
    var dobYear = dob.getYear();
    var dobMonth = dob.getMonth();
    var dobDate = dob.getDate();

    //get the current date from the system
    var now = new Date();
    //extract the year, month, and date from current date
    var currentYear = now.getYear();
    var currentMonth = now.getMonth();
    var currentDate = now.getDate();

    //declare a variable to collect the age in year, month, and days
    var age = {};
    var ageString = "";

    //get years
    yearAge = currentYear - dobYear;

    //get months
    if (currentMonth >= dobMonth)
      //get months when current month is greater
      var monthAge = currentMonth - dobMonth;
    else {
      yearAge--;
      var monthAge = 12 + currentMonth - dobMonth;
    }

    //get days
    if (currentDate >= dobDate)
      //get days when the current date is greater
      var dateAge = currentDate - dobDate;
    else {
      monthAge--;
      var dateAge = 31 + currentDate - dobDate;

      if (monthAge < 0) {
        monthAge = 11;
        yearAge--;
      }
    }
    //group the age in a single variable
    age = {
      years: yearAge,
      months: monthAge,
      days: dateAge,
    };

    if (age.years > 0 && age.months > 0 && age.days > 0)
      ageString = age.years + " years ";
    //  +
    // age.months +
    // " months, and " +
    // age.days +
    // " days old.";
    else if (age.years == 0 && age.months == 0 && age.days > 0)
      ageString = age.days + " days ";
    //ageString = "Only " + age.days + " days old!";
    //when current month and date is same as birth date and month
    else if (age.years > 0 && age.months == 0 && age.days == 0)
      ageString = age.years + " years";
    // ageString = age.years + " years old. Happy Birthday!!";
    else if (age.years > 0 && age.months > 0 && age.days == 0)
      // ageString = age.years + " years and " + age.months + " months old.";
      ageString = age.years + " years";
    else if (age.years == 0 && age.months > 0 && age.days > 0)
      ageString = age.months + " months";
    //ageString = age.months + " months and " + age.days + " days old.";
    else if (age.years > 0 && age.months == 0 && age.days > 0)
      ageString = age.years + " years ";
    //ageString = age.years + " years, and" + age.days + " days old.";
    else if (age.years == 0 && age.months > 0 && age.days == 0)
      ageString = age.months + " months";
    //ageString = age.months + " months old.";
    //when current date is same as dob(date of birth)
    else ageString = "It's first day on Earth!";

    //display the calculated age
    return (document.getElementById("spnAge").innerHTML =
      "(" + ageString + ")");
  }
}

// Mustache.Formatters = {

//   Shortdate: function (str) {
//     var options = {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     };
//     return new Date(str).toLocaleDateString("en-US", options);
//   },
// };

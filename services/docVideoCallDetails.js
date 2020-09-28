var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";

var isShowVideo = false;
var isAudioEnable = false;
var AudioVideosession;
var publisher;
var subscriber;
var allsubscribers;

var mCallQueId;
if ($(".modal-backdrop").length > 1) {
  $(".modal-backdrop").not(":first").remove();
}
var mPatientID;
var mCallLogId;
var mPname;
var mDocName;
var mDocId;
var mArea;
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

$(function () {
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
    $(this).closest(".mymodal").removeClass("min");

    // $(".container").removeClass($apnData);
  });
  $(".btnSave").on("click", function () {
    updateDoctorNotes(mCallLogId, "");
  });

  $(".btnSaveNSend").on("click", function () {
    updatePrescription(
      mCallLogId,
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
    checkOnlineStatusandCall(mPatientID, "Patient")
      .then((data) => {
        if (data) {
          //=============Play calling sound =====================
          $("#callImg").css("display", "none");
          PlayCallingSound(true);
          //=========send call request to paatient============

          soc.emit("SendCallRequestToPatient", {
            pName: mPname,
            username: mDocName,
            apiKey: apiKey,
            sessionId: sessionId,
            token: token,
          });

          initializeSession(apiKey, sessionId, token);
          $("#divCallNow").hide();
          $(".three-icons").show();
        } else {
          Swal.fire({
            type: "error",
            title: "Oops...",
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
      if (mArea == "Patient") {
        $("#windowComm").modal("hide");
      }
      if (publisher) {
        AudioVideosession.unpublish(publisher, handleError);
        publisher.destroy();
      }
      if (subscriber) AudioVideosession.unsubscribe(subscriber);

      if (event.reason == "networkDisconnected") {
        $("#log")
          .css({ display: "block", color: "#525a65" })
          .text("No internet connection.Please check and try connecting again.")
          .delay(3000)
          .fadeOut("slow");
      } else {
        $("#log")
          .css({ display: "block", color: "#525a65" })
          .text("Disconnected")
          .delay(3000)
          .fadeOut("slow");
      }

      // disconnect();
    },
    connectionCreated: function (event) {
      if (
        event.connection.connectionId !=
        AudioVideosession.connection.connectionId
      ) {
        PlayCallingSound(false);
      }
    },
    connectionDestroyed: function connectionDestroyedHandler(event) {
      //letting others know you left the connection in this method.

      PlayCallingSound(false);
      $(".three-icons, #timer").css("display", "none");
      $("#divCallNow").css("display", "block");
      $("#callImg").css("display", "block");
      if (publisher) {
        AudioVideosession.unpublish(publisher, handleError);
        publisher.destroy();
      }
      if (subscriber) AudioVideosession.unsubscribe(subscriber);
      AudioVideosession.disconnect();
      $("#log")
        .css({ display: "block", color: "#525a65" })
        .text("Disconnected")
        .delay(3000)
        .fadeOut("slow");
    },
    streamCreated: function (event) {
      callPerformed = true;
      if (mCallQueId != "0" && $("#insertedID").val() == "0") {
        UpdateQueAddSaveCallLog(mCallQueId, "Called", mDocId, mPatientID);
      }
      timer = setInterval(countTimer, 1000);
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
}

function disconnect() {
  if (publisher) {
    AudioVideosession.unpublish(publisher, handleError);
    publisher.destroy();
  }
  var newCalllogId = mCallLogId == 0 ? $("#insertedID").val() : mCallLogId;
  clearInterval(timer);
  if (subscriber) AudioVideosession.unsubscribe(subscriber);
  AudioVideosession.off();
  AudioVideosession.disconnect();

  // $("#windowComm").modal("hide");
  PlayCallingSound(false);
  $(".three-icons, #timer").css("display", "none");
  $("#divCallNow").css("display", "block");
  $("#callImg").css("display", "block");

  if (callPerformed && mArea == "Doctor") {
    soc.emit("ClosePatientScreen", {
      pName: mPname,
    });
    AudioVideosession.unsubscribe(subscriber);
    UpdateCallLogEndtime(newCalllogId, onCallduration);
  } else {
    // else only close patient incomming call window.
    soc.emit("ClosePatientScreen", {
      pName: mPname,
    });
  }
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
      if (data != null) {
        //=========open dialog for update==========
        $("#txtExam").val(data.HistoryAndExam);
        $("#txtAllergies").val(data.Allergies);
        $("#txtDiagnosis").val(data.Diagnosis);
        $("#txtRx").val(data.PatientRX);
        $("#txtName").val(data.PatientName);
        // $("#txtMedication").val(data.Medication);
        $("#txtMedication").data("kendoEditor").value(data.Medication);
        $("#patientAge").val(data.Age);
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
      if (mArea == "Doctor") getDashBoardAllScheduled(true);
    },
  });
}

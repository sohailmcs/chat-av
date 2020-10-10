//var baseURL = "https://kindahclinic.com/KindahService/";
var baseURL = "http://localhost:1042/KindahService/";

var urlParams = new URLSearchParams(window.location.search);
var doctorId = 0;
var name = "";
if (urlParams.has("doctorId")) doctorId = urlParams.get("doctorId");
if (urlParams.has("name")) name = urlParams.get("name");
var userLoginId = $(".user-name").attr("UserInfo");
$(function () {
  PatientBasicInfo(userLoginId);

  $(".btnChild, .btnRelative").on("click", function () {
    var type = $(this).attr("PatientType");
    GetChildPatientInfo(userLoginId, type);
  });

  $(".btnMe").on("click", function () {
    PatientBasicInfo(userLoginId);
  });

  //=============start wizard==================
  var current_fs, next_fs, previous_fs; //fieldsets
  var opacity;

  $(".next").click(function () {
    current_fs = $(this).parents("fieldset");
    next_fs = $(this).parents("fieldset").next();

    //Add Class Active
    $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

    //show the next fieldset
    next_fs.show();
    //hide the current fieldset with style
    current_fs.animate(
      { opacity: 0 },
      {
        step: function (now) {
          // for making fielset appear animation
          opacity = 1 - now;

          current_fs.css({
            display: "none",
            position: "relative",
          });
          next_fs.css({ opacity: opacity });
        },
        duration: 600,
      }
    );
  });

  $(".previous").click(function () {
    current_fs = $(this).parents("fieldset");
    previous_fs = $(this).parents().prev("fieldset");

    //Remove class active
    $("#progressbar li")
      .eq($("fieldset").index(current_fs))
      .removeClass("active");

    //show the previous fieldset
    previous_fs.show();

    //hide the current fieldset with style
    current_fs.animate(
      { opacity: 0 },
      {
        step: function (now) {
          // for making fielset appear animation
          opacity = 1 - now;

          current_fs.css({
            display: "none",
            position: "relative",
          });
          previous_fs.css({ opacity: opacity });
        },
        duration: 600,
      }
    );
  });

  $(".radio-group .radio").click(function () {
    $(this).parent().find(".radio").removeClass("selected");
    $(this).addClass("selected");
  });

  $(".submit").click(function () {
    var param = encodeURIComponent(doctorId + "&name=" + name);
    window.location.href = "/patient/payment?doctorId=" + param;
  });

  //================end wizard ===============
});

function PatientBasicInfo(PatientId) {
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
      //=====set values for slots templates======
      var patientInfo = $("#template-BasicInfo").html();
      $("#patientBasicInfo").html(Mustache.to_html(patientInfo, data));
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

function GetChildPatientInfo(patientId, patientType) {
  var url =
    baseURL +
    "Patient/GetChildPatient?PatientId=" +
    patientId +
    "&PatientType=" +
    patientType;
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
      //=====set values for slots templates======
      var patientInfo = $("#template-ChildInfo").html();
      $("#patientBasicInfo").html(Mustache.to_html(patientInfo, data));
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

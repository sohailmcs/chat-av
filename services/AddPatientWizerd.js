var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";

var urlParams = new URLSearchParams(window.location.search);
var doctorId = 0;
var name = "";
var spName;
var type;
var appId;
if (urlParams.has("doctorId")) doctorId = urlParams.get("doctorId");
if (urlParams.has("name")) name = urlParams.get("name");
if (urlParams.has("spName")) spName = urlParams.get("spName");
if (urlParams.has("type")) type = urlParams.get("type");
if (urlParams.has("appId")) appId = urlParams.get("appId");

var userLoginId = $(".user-name").attr("UserInfo");

var pType = "Me";
$("#hdnPatientId").val(userLoginId);

function EnableMedCondition(EleOv) {
  $("#rdoTakeMedYes").prop("checked", true);
  $(".rdoCondition").prop("disabled", false);
  $(EleOv).parent().find(".rdoCondition").prop("checked", true);
}

function EnableOtherOption(EleOverlay) {
  $("#otherCondition").prop("checked", true);
  $("#txtMedCondition").prop("disabled", false);
  $("#txtMedCondition").focus();
  //$(EleOverlay).parent().find(".rdoCondition").prop("checked", true);
}

$(function () {
  $("#dboCountry, #dboCity").select2(); //searchable dropdown
  $(document).on("change", ".MedicationReciept", function (event) {
    var files = event.target.files; //FileList object
    var imgHidden = $(this).siblings(".imgMedicine");
    var file = $(this)
      .val()
      .replace(/C:\\fakepath\\/gi, "");

    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      //Only pics
      if (!file.type.match("image")) continue;
      var picReader = new FileReader();
      picReader.addEventListener("load", function (event) {
        var picFile = event.target;
        imgHidden.val(picFile.result);
      });
      //Read the image
      picReader.readAsDataURL(file);
    }
  });

  PatientBasicInfo(userLoginId, false, "Parent");
  $(".dbInfo").css("display", "none");
  $(".btnMe").on("click", function () {
    pType = $(this).attr("patienttype");
    ShowHideChildInfoDropDown($(this));
    PatientBasicInfo(userLoginId, false, "Parent");
    $("#hdnPatientId").val(userLoginId);
    $(".btnChild, .btnRelative,.btnMe").removeClass("btnPatientTypeSelected");
    $(this).addClass("btnPatientTypeSelected");
    ShowHideChildInfoDropDown($(this));
  });

  $(".btnChild, .btnRelative").on("click", function () {
    pType = $(this).attr("patienttype");
    ShowHideChildInfoDropDown($(this));
    GetChildPatientInfo(userLoginId, pType);
    $("#patientBasicInfo").html("");
    $("#hdnPatientId").val("0");
    $(".btnChild, .btnRelative,.btnMe").removeClass("btnPatientTypeSelected");
    $(this).addClass("btnPatientTypeSelected");
  });

  $("#dboInfo").change(function () {
    $(this).css("border-color", " ");
    var childId = $(this).val();
    GetChildDetails(childId);
    $("#hdnPatientId").val(childId);
  });

  $("#btnPatientimgUpload").click(function () {
    $("#imgupload").click();
  });

  //========Add new Medication============
  $("#btnAddMedication").click(function () {
    AddMedication();
  });

  $(document).on("click", ".btnRemoveMedication", function () {
    $(this).parents(".divMed").remove();
  });
  $(document).on("click", ".btnAddAlergy", function () {
    $(this).parents(".PatientAlergy").remove();
  });

  //========Add new Medication============
  $("#btnAddAlergy").click(function () {
    AddAlergy();
  });

  $(".divMed").find("*").prop("disabled", true);
  $(".PatientAlergy").find("*").prop("disabled", true);
  $(".divCondition").find("*").prop("disabled", true);
  $("#txtMedCondition").prop("disabled", true);

  $('input:radio[name="medication"]').change(function () {
    if (this.checked && this.value == "0") {
      $(".divMed").find("*").prop("disabled", true);
    } else $(".divMed").find("*").prop("disabled", false);
  });
  $(document).on("click", ".divMed", function () {
    $("#rdTakingMedYes").prop("checked", true);
    $(this).find("*").prop("disabled", false);
    $(this).find(".txtMedicationName").focus();
  });

  $('input:radio[name="alergy"]').change(function () {
    if (this.checked && this.value == "0") {
      $(".PatientAlergy").find("*").prop("disabled", true);
    } else $(".PatientAlergy").find("*").prop("disabled", false);
  });

  $(document).on("click", ".PatientAlergy", function () {
    $("#rdoHaveAlergyYes").prop("checked", true);
    $(this).find("*").prop("disabled", false);
    $(this).find(".txtAlergy").focus();
  });

  $('input:radio[name="condition"]').change(function () {
    if (this.checked && this.value == "0") {
      $(".rdoCondition").prop("checked", false);
      $(".divCondition").find("*").prop("disabled", true);
    } else $(".divCondition").find("*").prop("disabled", false);
  });
  // $(document).on("click", ".divCondition input ", function () {
  //   $("#rdoTakeMedYes").prop("checked", true);
  //   $(this).find("*").prop("disabled", false);
  // });

  $("#otherCondition").change(function () {
    if ($(this).is(":checked")) {
      $("#txtMedCondition").prop("disabled", false);
    } else $("#txtMedCondition").prop("disabled", true);
  });
  $(document).on("click", "#txtMedCondition", function () {
    alert("asdfasd");
    $("#otherCondition").prop("checked", true);
    $(this).prop("disabled", false);
  });

  //=============start wizard==================
  var current_fs, next_fs, previous_fs; //fieldsets
  var opacity;

  $(".next").click(function () {
    //==========on first next button click in wazerd======
    var step = $(this).attr("step");

    switch (step) {
      case "first":
        CheckIFcalledBefore(doctorId, $("#hdnPatientId").val())
          .then((data) => {
            if (data > 0 && type == "Call") {
              Swal.fire({
                type: "error",
                title: "Oops...",
                text: "Your's today call already pending",
                confirmButtonClass: "btn btn-primary",
                buttonsStyling: false,
                confirmButtonText: "Ok",
              });
              return false;
            } else {
              PatientBasicInfo($("#hdnPatientId").val(), true, "Child");
              ShowHideNextStep($(this));
            }
          })
          .catch((error) => {
            console.log(error);
          });
        break;
      case "second":
        AddUpdatePatientDetails();
        ShowHideNextStep($(this));
        break;
      case "third":
        AddPatientMedication();
        ShowHideNextStep($(this));
      default:
      // return true;
    }
    //ShowHideNextStep($(this));
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

    if ($(this).attr("step") == "second") $(".btnMe").trigger("click");

    if ($(this).attr("step") == "third")
      PatientBasicInfo($("#hdnPatientId").val(), true, pType);

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
    AddPatientConditon();
  });

  //================end wizard ===============
});

function ShowHideNextStep(btnNext) {
  //==========on first next button click in wazerd======
  current_fs = btnNext.parents("fieldset");
  next_fs = btnNext.parents("fieldset").next();

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
}

function ShowHideChildInfoDropDown(ths) {
  var txt = ths.attr("patienttype");
  if (txt == "Me") {
    $(".dbInfo").css("display", "none");
  } else if (txt == "Child") {
    $(".dbInfo").css("display", "block");
    $(".spnDboInfo").text("Select Child Info");
  } else {
    $(".dbInfo").css("display", "block");
    $(".spnDboInfo").text("Select Relative Info");
  }
}
function Validate() {
  var result = true;

  var len = $("select#dboInfo option").length;
  if ((pType == "Child" || pType == "Relative") && len > 1) {
    if ($("#dboInfo").val() == "0") {
      $("#dboInfo").css("border-color", "red");
      result = false;
    }
  } else {
    $("#dboInfo").css("border-color", " ");
    result = true;
  }
  return result;
}

function CheckIFcalledBefore(doctorId, patientId) {
  return new Promise((resolve, reject) => {
    var currentDt = new Date().toLocaleDateString("en-US");
    var url =
      baseURL +
      "CallQue/CheckIfCallQuesExist?doctorID=" +
      doctorId +
      "&patiendId=" +
      patientId +
      "&date=" +
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
      success: function (data, textStatus, xhr) {
        resolve(data);
        $.LoadingOverlay("hide");
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

function FillCity() {
  var url = baseURL + "City/GetCity";
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
      // $.LoadingOverlay("hide");

      $("#dboCity").append(
        $("<option>").text("Select City").attr("value", "0")
      );

      for (var key in data.info) {
        $("#dboCity").append(
          $("<option>")
            .text(data.info[key].NameEn)
            .attr("value", data.info[key].CityID)
        );
      }
    },
    error: function (xhr, textStatus, err) {
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

function FillCountry() {
  var url = baseURL + "Country/GetCountry";
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
      //  $.LoadingOverlay("show");
    },
    success: function (data, textStatus, xhr) {
      // $.LoadingOverlay("hide");

      $("#dboCountry").append(
        $("<option>").text("Select Country").attr("value", "0")
      );

      for (var key in data.info) {
        $("#dboCountry").append(
          $("<option>")
            .text(data.info[key].NameEn)
            .attr("value", data.info[key].CountryID)
        );
      }
    },
    error: function (xhr, textStatus, err) {
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
function FillDetails(d) {
  $("#txtInfoFirstName").val(d.FirstName);
  $("#txtInfoLastName").val(d.LastName);

  $("#txtInfoAge").val(d.Age);
  if (d.Gender == "Male") $("#rdoMale").prop("checked", true);
  else $("#rdoFemale").prop("checked", true);
  
  $("#dboCountry").val(d.CountryId);
  $("#dboCity").val(d.CityId);
  $("#select2-dboCountry-container").text(d.CountryName);
  $("#select2-dboCity-container").text(d.CityName);

  var div = document.createElement("div");
  if (d.PatientPhoto != null) {
    div.innerHTML =
      "<img class='infoProfilePic' src='" +
      d.PatientPhoto +
      "'" +
      "title='ProfilePicture'/>";
  } else {
    div.innerHTML =
      "<img class='infoProfilePic' src='/assets/images/maledoc.png'/>";
  }
  //=========set image control============
  $("#result").html(div);
}

function PatientBasicInfo(PatientId, isDetails, type) {
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
      if (type == "Parent") {
        $("#txtPhoneNo").val(parseInt(data.PhoneNo));

        if (data.PhoneExt) $("#txtphoneExt").val(parseInt(data.PhoneExt));

        $("#txtEmail").val(data.Email);
      }
      FillCountry();
      FillCity();
      if (isDetails) FillDetails(data);
      else {
        //=====set values for slots templates======
        var patientInfo = $("#template-BasicInfo").html();
        $("#patientBasicInfo").html(Mustache.to_html(patientInfo, data));

        $("#dboInfo option").remove();
        $("#dboInfo").append(
          $("<option>").text("New patient").attr("value", "0")
        );
        $("#dboInfo").attr("disabled", "disabled");
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

function GetChildPatientInfo(patientId, patientType) {
  var url =
    baseURL +
    "Patient/GetChildsPatient?PatientId=" +
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

      //==========enabled child patient dropdown============
      $("#dboInfo").removeAttr("disabled");
      $("#dboInfo option").remove();
      $("#dboInfo").append(
        $("<option>").text("New patient").attr("value", "0")
      );

      for (var key in data.info) {
        $("#dboInfo").append(
          $("<option>")
            .text(data.info[key].FullName)
            .attr("value", data.info[key].PatientId)
        );
      }

      //==========fill child patient dropdown============
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

function GetChildDetails(patientId) {
  var url = baseURL + "Patient/GetChildDetails?PatientId=" + patientId;
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
      console.log(JSON.stringify(data));
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

function AddUpdatePatientDetails() {
  var gender = $("#rdoMale").prop("checked") ? "Male" : "Female";
  var model = {
    PatientId: $("#hdnPatientId").val(),
    parentId: userLoginId,
    PatientType: pType,
    FirstName: $("#txtInfoFirstName").val(),
    LastName: $("#txtInfoLastName").val(),
    FullName: $("#txtInfoFirstName").val() + " " + $("#txtInfoLastName").val(),
    Email: $("#txtEmail").val(),
    PatientType: pType,
    PhoneNo: $("#txtPhoneNo").val().replace(/^0+/, ""), //======remove leadng zero from phone number
    PhoneExt: $("#txtphoneExt").val(),
    PatientPhoto: $(".infoProfilePic").attr("src"),
    AddedBy: userLoginId,
    Gender: gender,
    Age: $("#txtInfoAge").val(),
    CountryId: $("#dboCountry").val(),
    CityId: $("#dboCity").val(),
  };

  var url = baseURL + "Patient/AddUpdatePatient";
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
      if (xhr.status == "200" && xhr.statusText == "OK")
        $("#hdnPatientId").val(data);
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

function AddMedication() {
  var newMedication =
    "<div class='row divMed'>" +
    "<div class='col-sm-5'>" +
    "<label>Medication Name</label>" +
    "<input type='text' placeholder='Name' class='txtMedicationName txtInfo'>" +
    "</div>" +
    "<div class='col-sm-7'>" +
    "<label>Upload Image</label>" +
    "<div class='input-group'>" +
    "<div class='input-group-prepend'>" +
    "</div>" +
    "<div class='custom-file'>" +
    "<input type='hidden' value='' class='imgMedicine'>" +
    "<input type='file' style='cursor:pointer' class='custom-file-input MedicationReciept'>" +
    "<label class='custom-file-label'>Choose file</label>" +
    "</div>" +
    "<div class='ml-1 mb-1'>" +
    "<button  style='font-size:1rem;padding: 10px 17px;font-weight: bolder;' type='button'" +
    "class='btnRemoveMedication btn btn-primary  mr-1 mb-1  btn-sm'>-</button>" +
    "</div>" +
    "</div>";
  $("#divMedication").find(".row").last().prev().after(newMedication);
  //$("#divMedication .row").eq(-1).before(newMedication);
}

function AddAlergy() {
  var newAlergy =
    "<div class='row PatientAlergy'>" +
    "<div class='col-sm-10'>" +
    "<label>Allergy 01</label>" +
    "<input type='text' placeholder='Alergy' class='txtInfo txtAlergy'>" +
    "</div>" +
    "<div class='col-sm-2 mt-0'>" +
    "<br>" +
    "<button style='font-size:1rem;padding: 10px 17px;font-weight: bolder;'" +
    "type='button' class='btnAddAlergy btn btn-primary  mr-1 mb-1  btn-sm'>-</button>" +
    "</div>" +
    "</div>";
  $("#divAlergy").find(".row").last().prev().after(newAlergy);
}

function AddPatientMedication() {
  var PatientMedication = new Array();
  var PatientAlergy = new Array();

  //===========create Medication if any======
  $(".divMed").each(function (i) {
    if ($("#rdTakingMedYes").prop("checked")) {
      PatientMedication.push({
        PatientId: $("#hdnPatientId").val(),
        IsTakingMedication: $("#rdTakingMedYes").prop("checked"),
        MedicationName: $(this).find(".txtMedicationName").val(),
        ImageUrl: $(this).find(".imgMedicine").val(),
        AddedBy: userLoginId,
      });
    }
    if ($("#rdTakingMedNo").prop("checked")) {
      PatientMedication.push({
        PatientId: $("#hdnPatientId").val(),
        IsTakingMedication: false,
        MedicationName: "",
        ImageUrl: "",
        AddedBy: userLoginId,
      });
    }
  });

  $(".PatientAlergy").each(function (i) {
    if ($("#rdoHaveAlergyYes").prop("checked")) {
      PatientAlergy.push({
        PatientId: $("#hdnPatientId").val(),
        IsAlergy: $("#rdoHaveAlergyYes").prop("checked"),
        AlergyName: $(this).find(".txtInfo").val(),
        AddedBy: userLoginId,
      });
    }

    if ($("#rdoHaveAlergyNo").prop("checked")) {
      PatientAlergy.push({
        PatientId: $("#hdnPatientId").val(),
        IsAlergy: false,
        AlergyName: "",
        AddedBy: userLoginId,
      });
    }
  });

  var model = {
    PatientMedication: PatientMedication,
    PatientAlergy: PatientAlergy,
  };

  var url = baseURL + "PatientMedication/AddPatientMedication";
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

function AddPatientConditon() {
  var PatientMedCondition = new Array();

  if ($("#rdoTakeMedNo").prop("checked")) {
    PatientMedCondition.push({
      PatientId: $("#hdnPatientId").val(),
      IsCondition: false,
      Condition: null,
      IsOtherCondition: $("#otherCondition").prop("checked"),
      MedConditionDesc:
        $("#otherCondition").prop("checked") == true
          ? $("#txtMedCondition").val()
          : "",
      AddedBy: userLoginId,
    });
  }

  //===========create Medication if any======

  if ($("#rdoTakeMedYes").prop("checked")) {
    $(".divCondition").each(function (i) {
      if ($(this).find(".rdoCondition").prop("checked")) {
        PatientMedCondition.push({
          PatientId: $("#hdnPatientId").val(),
          IsCondition: true,
          Condition: $(this).find(".rdoCondition").val(),
          IsOtherCondition: $("#otherCondition").prop("checked"),
          MedConditionDesc:
            $("#otherCondition").prop("checked") == true
              ? $("#txtMedCondition").val()
              : "",
          AddedBy: userLoginId,
        });
      }
    });
  }

  var PatientComplain = {
    PatientId: $("#hdnPatientId").val(),
    PatientComplainDesc: $("#txtcomplain").val(),
    PatComplainImage: $(".hdnimgcomplain").val(),
    // "/assets/images/" +
    // $("#imgcomplain")
    //   .val()
    //   .replace(/.*(\/|\\)/, ""),
    AddedBy: userLoginId,
  };

  var model = {
    PatientMedCondition: PatientMedCondition,
    PatientComplain: PatientComplain,
  };

  var url = baseURL + "PatientMedCondition/AddPatientMedCondition";
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
      var param;
      if (type == "call") {
        param =
          "doctorId=" +
          doctorId +
          "&name=" +
          name +
          "&spName=" +
          spName +
          "&type=" +
          type +
          "&pId=" +
          $("#hdnPatientId").val();
      } else {
        param =
          "doctorId=" +
          doctorId +
          "&name=" +
          name +
          "&spName=" +
          spName +
          "&type=" +
          type +
          "&pId=" +
          $("#hdnPatientId").val() +
          "&appointmentId=" +
          appId;
      }

      window.location.href = "/patient/payment?" + param;
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

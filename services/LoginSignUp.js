//var baseURL = "https://kindahclinic.com/KindahService/";
var baseURL = "http://localhost:1042/KindahService/";

var modelDetails;
var hdnUserType = $("#hdnUserType").val();
function setCookie(cname, cvalue, exdays) {
  var expires = "";
  if (exdays) {
    var date = new Date();
    date.setTime(date.getTime() + exdays * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function validtion() {
  $("form").validate({
    rules: {
      email: {
        required: true,
        email: true,
      },
      Password: {
        required: true,
        maxlength: 10,
      },
      firstName: {
        required: true,
      },
      lastName: {
        required: true,
      },
      contactNo: {
        required: true,
        number: true,
      },
    },
    messages: {
      email: {
        required: "this field is required",
        email: "The email should be in the format: abc@domain.tld",
      },
      Password: {
        required: "this field is required",
        maxlength: 10,
      },
      firstName: {
        required: "this field is required",
      },
      lastName: {
        required: "this field is required",
      },
      contactNo: {
        required: "this field is required",
        number: "Allow only number",
      },
    },
  });
}
function moveToNext() {
  $(".square").keyup(function (e) {
    if ($(this).val().length == $(this).attr("maxlength"))
      $(this).next(':input[type="number"]').focus();
  });
}
//==login==========
$(function () {
  moveToNext();

  $("#btnResendOTP").on("click", function () {
    ResendOTP("Patient");
  });

  $("#frmLogin").submit(function (e) {
    e.preventDefault();

    //  Validate requried fileds
    validtion();

    var url = baseURL + "User/SignIn";
    var userInfo = {
      UserName: $("#txtEmail").val(),
      Password: $("#txtPassword").val(),
    };

    $.ajax({
      url: url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      type: "POST",
      datatype: "application/json",
      contentType: "application/json; charset=utf-8",
      data: userInfo,
      beforeSend: function () {
        //Show Loading if validate pass
        $.LoadingOverlay("show");
      },
      success: function (data, textStatus, xhr) {
        $(".error").hide();
        // console.log(data.FullName);
        // return false;
        setCookie("kindahUserType", data.UserType, 1);
        setCookie("kindahUserId", data.UserId, 1);
        setCookie("kindahUserName", data.FullName, 1);
        if (data.UserType == "Patient") {
          window.location.href = "/patientDashboard";
        } else {
          window.location.href = "/docDashboard";
        }
      },
      error: function (xhr, textStatus, err) {
        if (xhr.status == "401" && xhr.statusText == "Unauthorized")
          $(".error").show().text("User already exist but unverified");
        else if (xhr.status == "404" && xhr.statusText == "Not Found")
          $(".error").show().text(xhr.statusText);
        else if (xhr.status == "406" && xhr.statusText == "NotAcceptable")
          $(".error").show().text("Invalid user type");
        else if (xhr.status == "417")
          $(".error").show().text("Wrong userName or Password");
        else $(".error").show().text(xhr.statusText);
      },
      complete: function (data) {
        // Hide Loading
        $.LoadingOverlay("hide");
        if (data.statusText == "error")
          $(".error").show().text("No response from server");
      },
    });
  }); //==end of Loginform submit

  //========SignUp=============
  $("#frmSignUp").submit(function (e) {
    e.preventDefault();

    // Validate requried fileds
    validtion();
    var enterdText = $("#txtPhoneNo").val();
    if (!validatephonenumber(enterdText)) {
      Swal.fire({
        type: "info",
        title: "SORRY!",
        html:
          "Plase enter correct phone no<br> <b >" +
          $("#txtPhoneNo").val() +
          "</b><br> ",
      });
      return false;
    }

    var ddluserType = $("#dboUserType").val();

    var model = {
      FirstName: $("#txtFirstName").val(),
      LastName: $("#txtLastName").val(),
      FullName: $("#txtFirstName").val() + " " + $("#txtLastName").val(),
      Email: $("#txtEmail").val(),
      Password: $("#txtPassword").val(),
      PhoneNo: $("#txtPhoneNo").val().replace(/^0+/, ""), //======remove leadng zero from phone number
      PhoneExt: $("input:disabled").val(),
      UserType: hdnUserType == "patient" ? "Patient" : ddluserType,
      pageName: "Signup",
      pageUrl: window.location.href,
    };

    var url =
      hdnUserType.toLowerCase() == "patient"
        ? baseURL + "User/SignUp"
        : baseURL + "User/SignUpFromAdmin";
    //var url = baseURL + "User/SignUp";

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
        //Show Loading if validate pass
        $.LoadingOverlay("show");
      },
      success: function (d, textStatus, xhr) {
        $(".error").hide();
        console.log(JSON.stringify(d));
        //=====intiliaze details to add patient when OTP verified
        // debugger;
        var gender = $("#dbogender").val();
        if (hdnUserType == "patient") {
          modelDetails = {
            PatientId: d.UserRefId,
            FirstName: d.FirstName,
            LastName: d.LastName,
            PhoneNo: d.PhoneNo,
            FullName: d.FullName,
            Gender: gender,
            PatientType: "Me",
          };
        } else if (
          hdnUserType == "admin" &&
          ddluserType.toLowerCase() == "patient"
        ) {
          modelDetails = {
            PatientId: d.UserRefId,
            FirstName: d.FirstName,
            LastName: d.LastName,
            PhoneNo: d.PhoneNo,
            FullName: d.FullName,
            Gender: gender,
            PatientType: "Me",
          };
        } else {
          modelDetails = {
            DoctorId: d.UserRefId,
            FirstName: d.FirstName,
            LastName: d.LastName,
            FullName: d.FullName,
            PhoneNumber: d.PhoneNo,
            Gender: gender,
            //OTPKey: d.OTPKey,
          };
        }
        // debugger;
        if (hdnUserType == "patient") {
          $("#primary").modal({
            backdrop: "static",
            keyboard: false,
          });
        } else {
          OTPVerify(); // remove OTP verifiction from doctor
        }
      },
      error: function (xhr, textStatus, err) {
        //if (xhr.status == "406" && xhr.statusText == "Not Acceptable") {
        if (xhr.status == "406" && textStatus != "InValidOTP") {
          Swal.fire({
            type: "info",
            title: "SORRY!",
            text:
              "Email " +
              $("#txtEmail").val() +
              " already exist. Please choose different email",
            type: "error",
            confirmButtonClass: "btn btn-primary",
            buttonsStyling: false,
            confirmButtonText: "<a style='color:#fff'>OK</a>",
          });
          if (xhr.status == "406" && textStatus == "InValidOTP") {
            Swal.fire({
              type: "info",
              title: "SORRY!",
              text:
                "OTP" +
                $("#squareText").val() +
                " invalid OTP. Please enter valid OTP code",
              type: "error",
              confirmButtonClass: "btn btn-primary",
              buttonsStyling: false,
              confirmButtonText: "<a style='color:#fff'>OK</a>",
            });
          }
          return false;
        }
      },
      complete: function (data) {
        // Hide Loading
        $.LoadingOverlay("hide");
        if (data.statusText == "error")
          $(".error").show().text("No response from server");
      },
    });
  });
  //========end of SignUp=============

  //====start of one time password varification=====
  $("#btnOTPVerify").on("click", function () {
    OTPVerify();
  }); //====end of one time password verification=======

  function OTPVerify() {
    //debugger;
    var concatOTP =
      $("#squareText1").val() +
      "" +
      $("#squareText2").val() +
      "" +
      $("#squareText3").val() +
      "" +
      $("#squareText4").val();
    var ddluserType = hdnUserType;
    if (hdnUserType.toLowerCase() != "patient") {
      ddluserType = $("#dboUserType").val();
    } else {
      var OTPCode = concatOTP.trim();
      modelDetails.OTPKey = OTPCode;
      modelDetails.Age = "30";
    }
    var url =
      ddluserType.toLowerCase() == "patient"
        ? baseURL + "Patient/AddPatient"
        : baseURL + "Doctor/AddDoctor";

    //console.log('url '+url);
    $.ajax({
      url: url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      type: "POST",
      datatype: "application/json",
      contentType: "application/json; charset=utf-8",
      data: modelDetails,
      beforeSend: function () {
        //Show Loading if validate pass
        $.LoadingOverlay("show");
      },
      success: function (d, textStatus, xhr) {
        if (xhr.status == 200) {
          Swal.fire({
            title: "Congratulations",
            text: "Click on button Login to Access your Account",
            type: "success",
            confirmButtonClass: "btn btn-primary",
            buttonsStyling: false,
            confirmButtonText: "<a style='color:#fff'>OK</a>",
          }).then(function () {
            if (hdnUserType == "patient") window.location.href = "/Login";
            else window.location.reload();
          });
        }
        //=====intiliaze patientModel to add patient
      },
      error: function (xhr, textStatus, err) {
        if (xhr.status == "404" && xhr.statusText == "NotFound") {
          Swal.fire({
            title: "Error!",
            text: "Check your Email and Enter the Code Again ",
            type: "error",
            confirmButtonClass: "btn btn-primary",
            buttonsStyling: false,
            confirmButtonText: "<a style='color:#fff'>OK</a>",
          });
        } else if (
          xhr.status == "406" &&
          xhr.responseJSON.Message == "InValidOTP"
        ) {
          Swal.fire({
            title: "Error!",
            text: "Check your Email and Enter the valid Code Again ",
            type: "error",
            confirmButtonClass: "btn btn-primary",
            buttonsStyling: false,
            confirmButtonText: "<a style='color:#fff'>OK</a>",
          });
        }
      },
      complete: function (data) {
        // Hide Loading
        $.LoadingOverlay("hide");
      },
    });
  } //====end of one time password verification=======

  function ResendOTP(useType) {
    var url = baseURL + "User/ResendOTP";

    var model = {
      userRefId: modelDetails.PatientId,
      UserType: useType,
      FullName: modelDetails.FullName,
      Email: modelDetails.Email,
      pageName: "Signup",
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
      data: model,
      beforeSend: function () {
        //Show Loading if validate pass
        $.LoadingOverlay("show");
      },
      success: function (d, textStatus, xhr) {
        if (xhr.status == 200) {
          Swal.fire({
            title: "Congratulations",
            text: "OTP resend successfully.",
            type: "success",
            confirmButtonClass: "btn btn-primary",
            buttonsStyling: false,
            confirmButtonText: "<a style='color:#fff'>OK</a>",
          });
        }
        //=====intiliaze patientModel to add patient
      },
      error: function (xhr, textStatus, err) {
        if (xhr.status == "404" && xhr.statusText == "NotFound") {
          Swal.fire({
            title: "Error!",
            text: "User Not Found ",
            type: "error",
            confirmButtonClass: "btn btn-primary",
            buttonsStyling: false,
            confirmButtonText: "<a style='color:#fff'>OK</a>",
          });
        }
      },
      complete: function (data) {
        // Hide Loading
        $.LoadingOverlay("hide");
      },
    });
  } //====end of one time password verification=======

  function validatephonenumber(inputtxt) {
    var isValid = true;
    var regex = new RegExp(/^(?:\+?0*?966)?0?5[0-9]{8}$/);
    var phoneNo = inputtxt;
    if (!regex.test(phoneNo)) {
      isValid = false;
    } else {
      isValid = true;
    }
    return isValid;
  }
}); //==end of jquery $function

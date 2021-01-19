//var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";
var urlParams = new URLSearchParams(window.location.search);
var UserId = 0;
//var roleID = urlParams.get("id");
if (urlParams.has("id")) UserId = urlParams.get("id");

$(function () {
  GetAllRoles();
  if (UserId > 0) {
    GetUser(UserId);
    $("#lblUserHeading").text("Edit User");
    $("#btnSubmit").text("Update User");
$("#txtFirstName, #txtLastName").prop("disabled",true);

  } else $("#lblUserHeading").text("Create User");
  $("#frmSignUpAdmin").submit(function (e) {
    e.preventDefault();
    if (UserId > 0) EditUser();
    else AddUser();
  });


  $(".reveal").on('click',function() {
    var $pwd = $(".pwd");
    if ($pwd.attr('type') === 'password') {
      $(this).find('i').addClass( "fa-eye-slash" );
      $(this).find('i').removeClass( "fa-eye" );
        $pwd.attr('type', 'text');
    } else {
        $pwd.attr('type', 'password');
        $(this).find('i').removeClass( "fa-eye-slash" );
        $(this).find('i').addClass( "fa-eye" );
    }
});
}); //====end of $function

//== creat doctor with login
function AddUser() {
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

  var model = {
    FirstName: $("#txtFirstName").val(),
    LastName: $("#txtLastName").val(),
    FullName: $("#txtFirstName").val() + " " + $("#txtLastName").val(),
    Email: $("#txtEmail").val(),
    Password: $("#txtPassword").val(),
    PhoneNo: $("#txtPhoneNo").val().replace(/^0+/, ""), //======remove leadng zero from phone number
    PhoneExt: $("input:disabled").val(),
    UserType:$("#dboUserType option:selected").text(),
    RoleId: $("#dboRole").val(),
    pageName: "Admin Signup",
    pageUrl: window.location.href,
  };

  var url = baseURL + "User/SignUpFromAdmin";
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
      Swal.fire({
        title: "Congratulations",
        text: "Click on button Login to Access your Account",
        type: "success",
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: false,
        confirmButtonText: "<a style='color:#fff'>OK</a>",
      }).then(function () {
        window.location.reload();
      });
    },
    error: function (xhr, textStatus, err) {
      if (xhr.status == "406" && xhr.statusText == "Not Acceptable") {
     // if (xhr.status == "406" && textStatus == "NotAcceptable") {
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
        return false;
      }
    },
    complete: function (data) {
      // Hide Loading
      $.LoadingOverlay("hide");
    },
  });
}
//== Edit menu
function EditUser() {
  var url = baseURL + "User/UpdateUserByAdmin";

  var model = {
    Email: $("#txtEmail").val(),
    Password: $("#txtPassword").val(),
    UserType: $("#dboUserType option:selected").text(),
    PhoneNo: $("#txtPhoneNo").val(),
    PhoneExt: $("input:disabled").val(),
    role: $("#dboRole").val(),
    UserId:UserId
  };
  ///==============start post request to add doctor
  $.ajax({
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    type: "PUT",
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
        text: "User Edit ",
        type: "success",
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: false,
        confirmButtonText: "<a style='color:#fff'>OK</a>",
        // }).then((resuut) => {
        //   window.location.reload();
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

function GetUser(id) {
  var url = baseURL + "User/GetUserById?UserId=" + id;
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

      $("#txtEmail").val(data.Email),
        $("#txtPassword").val(data.Password),
        $("#txtPhoneNo").val(parseInt(data.PhoneNo));
      $("input:disabled").val(data.PhoneExt),
        $("#dboUserType option:contains(" + data.UserType + ")").attr(
          "selected",
          "selected"
        );

      $("#dboRole").val(data.RoleId);
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

function GetAllRoles() {
  var url = baseURL + "Role/GetAllRoles";
  ///==============start post request to add doctor
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
      var data = data.result;
      $("#dboRole").empty();
      $("#dboRole").append(
        $("<option>").text("Select Role").attr("value", "0")
      );

      for (var key in data) {
        $("#dboRole").append(
          $("<option>").text(data[key].RoleName).attr("value", data[key].RoleId)
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
      $.LoadingOverlay("hide");
    },
  });
}
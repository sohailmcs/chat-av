//var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";
var urlParams = new URLSearchParams(window.location.search);
var suggestionId = 0;
//var roleID = urlParams.get("id");
if (urlParams.has("id")) suggestionId = urlParams.get("id");

$(function () {
  if (suggestionId > 0) GetSuggestionDetails(suggestionId);

  //===========start animated placeholder============
  $(".form-input").focus(function () {
    $(this).parents(".form-group").addClass("focused");
  });

  $(".form-input").blur(function () {
    var inputValue = $(this).val();
    if (inputValue == "") {
      $(this).removeClass("filled");
      $(this).parents(".form-group").removeClass("focused");
    } else {
      $(this).addClass("filled");
    }
  });
  $("#frmSuggestion").submit(function (e) {
    e.preventDefault();
    submitsuggestions();
  });
}); //====end of $function

function GetSuggestionDetails(id) {
  var url =
    baseURL + "PatientSuggestion/GetSuggestionComplain?suggestionId=" + id;
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

      var div = document.createElement("div");
      $("#txtUserName").val(data.UserId);
      $("#txtFullName").val(data.FullName);
      $("#txtPhoneNumber").val(data.PhoneNumber);
      $("#txtComplain").val(data.Complain);
      if (data.attachment != null) {

        div.innerHTML =
          "<img class='thumbnail' src='" +
          data.attachment +
          "'" +
          "title='ProfilePicture'/>";
      } else {
        div.innerHTML =
          "<img class='thumbnail' src='/assets/images/maledoc.png'/>";
      }
      $("#result").html(div);
    },
    error: function (xhr, textStatus, err) {
      if (xhr.status == "500" && xhr.statusText == "InternalServerError")
        console.log(xhr.statusText);
      else console.log(xhr.statusText);
    },
    complete: function (data) {
      var inputValue = $(".form-input").val();
      if (inputValue == "") {
        $(".form-input").removeClass("filled");
        $(".form-input").parents(".form-group").removeClass("focused");
      } else {
        $(".form-input").addClass("filled");
        $(".form-input").parents(".form-group").addClass("focused");
      }
      // Hide Loading
      $.LoadingOverlay("hide");
    },
  });
}

function submitsuggestions() {
  var enterdText = $("#txtPhoneNumber").val();
  if (!validatephonenumber(enterdText)) {
    Swal.fire({
      type: "info",
      title: "SORRY!",
      html:
        "Plase enter correct phone no<br> <b >" +
        $("#txtPhoneNumber").val() +
        "</b><br> ",
    });
    return false;
  }

  var url = baseURL + "PatientSuggestion/AddSuggestion";

  var model = {
    UserId: $("#txtEmail").val(),
    FullName: $("#txtFullName").val(),
    PhoneNumber: $("#txtPhoneNumber").val(),
    Complain: $("#txtComplain").val(),
    attachment: $(".lblAttachment").val(),
  };

  ///==============start post request to add doctor
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
        text: "Thanks for your suggestion ",
        type: "success",
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: false,
        confirmButtonText: "<a style='color:#fff'>OK</a>",
      }).then((resuut) => {
        $("input[type=text],input[type=number],textarea").val("");
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

$(document).on("change", ".suggestionAttachment", function (event) {
  var files = event.target.files; //FileList object
  var imgHidden = $(this).siblings(".lblAttachment");
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

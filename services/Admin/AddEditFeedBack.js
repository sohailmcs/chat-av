//var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";
var urlParams = new URLSearchParams(window.location.search);
var feedbackId = 0;
//var roleID = urlParams.get("id");
if (urlParams.has("id")) feedbackId = urlParams.get("id");

$(function () {
  GetFeedBackDetails(feedbackId);

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
}); //====end of $function

function GetFeedBackDetails(id) {
  var url = baseURL + "FeedBack/GetFeedBackById?FeedBackId=" + id;
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
      $("#txtPatientName").val(data.PatientName);
      $("#txtphone").val(data.PatientPhone);
      $("#txtEmail").val(data.PatientEmail);
      $("#txtRating").val(data.Rating);
      $("#txtComments").val(data.PatientComments);
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

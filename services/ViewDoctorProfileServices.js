var baseURL = "https://kindahclinic.com/KindahService/";

var urlParams = new URLSearchParams(window.location.search);
var doctorId = 0;
if (urlParams.has("id")) doctorId = urlParams.get("id");

$(function () {
  ViewOnlyeDoctorProfile(doctorId);
});

function ViewOnlyeDoctorProfile(doctorId) {
  var url = baseURL + "Doctor/GetDoctorProfile?doctorId=" + doctorId;
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
      var profileTemplate = $("#template-docProfile").html();
      $("#docProfile").html(Mustache.to_html(profileTemplate, data));
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

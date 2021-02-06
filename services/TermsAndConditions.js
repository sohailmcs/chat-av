
var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";

$(function () {
 // GetTermAndCondition();
});

function GetTermAndCondition() {
  var url = baseURL + "ValueAndStatus/GetByName?valueKey=TermsAndConditions";
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
        console.log(JSON.stringify(data));
     $("#content").html(data.ValueNameEn);
    },
    error: function (xhr, textStatus, err) {
      if (xhr.status == "500" && xhr.statusText == "InternalServerError")
        console.log(xhr.statusText + ""  + err);
      else console.log(xhr.statusText);
    },
    complete: function (data) {
      // Hide Loading
      $.LoadingOverlay("hide");
    },
  });
}

var baseURL = "https://kindahclinic.com/KindahService/";
var useLoginId = $(".user-name").attr("UserInfo");

$(function () {
  GetAllDoctorCallLog(useLoginId);

  $(document).on("click", ".btnViewHistory", function () {
    var CallLogID = $(this).attr("callLogId");
    ViewPatientHistory(CallLogID);
  });
});

function GetAllDoctorCallLog(userId) {
  var url =
    baseURL +
    `CallLogs/GetDoctorRecentCallLog?doctorId=${userId}&status=Completed`;

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
      var CallLogTemplate = $("#callLog-template").html();
      $("#callLogId").html(Mustache.to_html(CallLogTemplate, data));
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

function ViewPatientHistory(CallLogID) {
  var url = baseURL + `CallLogs/GetPatientHistory?callLogId=${CallLogID}`;
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
      var ViewHistoryTemplate = $("#viewPatHistory").html();
      $("#primary").html(Mustache.to_html(ViewHistoryTemplate, data));
      $("#primary").modal("show");

      // viewHistory();
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

//====date formater by using mustache=====
Mustache.Formatters = {
  date: function (str) {
    var options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(str).toLocaleDateString("en-US", options);
  },
  Shortdate: function (str) {
    var options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(str).toLocaleDateString("en-US", options);
  },
};

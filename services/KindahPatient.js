var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";

$(function (e) {
  GetAllPatient();
}); //===========end of $function=====================

function format(d) {
  // `d` is the original data object for the row

  var callLogtable = $("<table/>").css("width", "100%");
  callLogtable.append(
    "<thead class='tablehead'>" +
      "<tr class='chilHeader' >" +
      "<th class='call-log-table-head'>Visit No</th>" +
      "<th class='call-log-table-head'>Doctor</th>" +
      "<th class='call-log-table-head'>Phone</th>" +
      "<th class='call-log-table-head'>Date</th>" +
      "<th class='call-log-table-head'>Time</th>" +
      "<th class='call-log-table-head'>Duration</th>" +
      "<th class='call-log-table-head'>View </th>" +
      "</tr>" +
      "</thead>"
  );
  var url =
    baseURL + "Patient/GetCompleteCallLogsByPatient?patientId=" + d.PatientId;
  ///==============start post request to add doctor============
  $.ajax({
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    // async: false,

    type: "GET",
    datatype: "application/json",
    contentType: "application/json; charset=utf-8",
    data: "",
    beforeSend: function () {
      $.LoadingOverlay("show");
    },
    success: function (data, textStatus, xhr) {
      var callLogData = data.result;
      if (callLogData.length > 0) {
        $.each(callLogData, function (ind, val) {
          callLogtable.append(
            "<tr><td class='callLogId'>" +
              val.CallLogID +
              "</td><td>" +
              val.DoctorName +
              "</td>" +
              "<td>" +
              val.DoctorPhone +
              "</td><td>" +
              new Date(val.CallLogEndDateTime).toLocaleDateString() +
              "</td><td>" +
              new Date(val.CallLogEndDateTime).getHours() +
              ":" +
              new Date(val.CallLogEndDateTime).getMinutes() +
              "</td><td>" +
              (val.OnCallDuration == null ? "" : val.OnCallDuration) +
              "</td><td><a href='#' onclick='ViewPatientHistory(" +
              val.CallLogID +
              " );'>" +
              "<i class='bx bxs-show call-log-eye-btn'></i></a> </td></tr>"
          );
        });
      } else {
        callLogtable.append(
          "<tr><td align='center' colspan='7'><span class='spanNoRecord'>No callLog found</td></tr>"
        );
      }
      return false;
      // $.LoadingOverlay("hide");
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
  return callLogtable;
}

function GetAllPatient() {
  var url = baseURL + "Patient/GetAllPatient";
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
      var patientData = data.result;

      Filldatatable(patientData);
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

function Filldatatable(data) {
  var table = $("#kindahdatatable").DataTable({
    data: data,
    scrollX: true,
    columns: [
      {
        className: "details-control",
        orderable: false,
        data: "",
        defaultContent: "",
      },
      { data: "PatientId" },
      { data: "FullName" },
      { data: "Age" },
      { data: "Gender" },
      { data: "Email" },
      { data: "PhoneNo" },
      { data: "callLogDummyId" },
    ],
    columnDefs: [
      {
        // targets: "_all",
        // defaultContent: "",
        targets: [7],
        visible: false,
        searchable: false,
      },
    ],
    order: [[7, "desc"]],
    language: {
      searchPlaceholder: "  Search records....",
    },
  });

  $("#kindahdatatable tbody").on("click", "td.details-control", function (e) {
    e.preventDefault();
    var tr = $(this).closest("tr");
    var row = table.row(tr);

    if (row.child.isShown()) {
      // This row is already open - close it
      row.child.hide();
      tr.removeClass("shown");
    } else {
      // Open this row
      row.child(format(row.data())).show();
      tr.addClass("shown");
    }
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
      $("#popupHistory").html(Mustache.to_html(ViewHistoryTemplate, data));
      $("#popupHistory").modal("show");

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

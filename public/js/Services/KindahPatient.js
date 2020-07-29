var baseURL = "http://Localhost:1024/-";

$(function () {
  GetAllPatient();

  $("#kindahdatatable tbody").on(
    "click",
    "td.details-control",

    function () {
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
    }
  );
}); //===========end of $function=====================

function format(d) {
  // `d` is the original data object for the row

  return (
    '<table style="width:100% ">' +
    "<tr>" +
    "<th class='thhead'>Visit No</th>" +
    "<th class='thhead'>Doctor</th>" +
    "<th class='thhead'>Phone</th>" +
    "<th class='thhead'>Date</th>" +
    "<th class='thhead'>Time</th>" +
    "<th class='thhead'>Duration</th>" +
    "<th class='thhead'>View </th>" +
    "</tr>" +
    "<tr>" +
    "<td>1</td>" +
    "<td>DotorABC</td>" +
    "<td>23456788</td>" +
    "<td>Sept 08,2010</td>" +
    "<td>12:00</td>" +
    "<td>20min</td>" +
    "<td onclick='viewHistory()'><a href='#' onclick='viewHistory();'>" +
    " <i class='bx bxs-show call-log-eye-btn'></i></a> </td>" +
    "</tr>" +
    "<tr class='rows'>" +
    "<td>2</td>" +
    "<td>DotorABC</td>" +
    "<td>23456788</td>" +
    "<td>Sept 08,2010</td>" +
    "<td>12:00</td>" +
    "<td>20min</td>" +
    "<td onclick='viewHistory()'><a href='#' onclick='viewHistory();'>" +
    " <i class='bx bxs-show call-log-eye-btn'></i></a> </td>" +
    "</tr>" +
    "<tr class='rows'>" +
    "<td>3</td>" +
    "<td>DotorABC</td>" +
    "<td>23456788</td>" +
    "<td>Sept 08,2010</td>" +
    "<td>12:00</td>" +
    "<td>20min</td>" +
    "<td onclick='viewHistory()'><a href='#' onclick='viewHistory();'>" +
    " <i class='bx bxs-show call-log-eye-btn'></i></a> </td>" +
    "</tr>" +
    "</table>"
  );
}

function GetAllPatient() {
  var url = baseURL + "Doctor/GetAllPatient";
  ///==============start post request to add doctor
  $.ajax({
    url: url,
    // headers: {
    //   "Content-Type": "application/x-www-form-urlencoded",
    // },
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
  $("#kindahdatatable").DataTable({
    bAutoWidth: false,
    data: data,
    columns: [
      { data: "PatientId" },
      { data: "FullName" },
      { data: "Age" },
      { data: "Gender" },
      { data: "Email:" },
      { data: "PhoneNo" },

      //   {
      //     mRender: function (data, type, row) {
      //       return (
      //         '<a href="#" doctorId="' +
      //         row.DoctorId +
      //         '" onclick="viewDocProfile(this);" data-toggle="tooltip" data-placement="bottom" title="view Doctor">' +
      //         '<i class="bx bxs-show call-log-eye-btn"></i>' +
      //         "</a>" +
      //         '<a href="#" onclick="EditDoctorFile(this)" doctorId="' +
      //         row.DoctorId +
      //         '" data-toggle="tooltip" data-placement="bottom" title="Edit Doctor">' +
      //         ' <i class="bx bxs-pencil call-log-eye-btn"></i></a>'
      //       );
      //     },
      //   },
    ],
    columnDefs: [
      {
        targets: "_all",
        defaultContent: "",
      },
    ],
    order: [[1, "asc"]],
  });
}

var baseURL = "http://Localhost:1024/-";

$(function () {
  GetAllRegisterDoctor();
});

function GetAllRegisterDoctor() {
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

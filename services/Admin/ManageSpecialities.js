//var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";

$(function () {
  GetAllSpecialities();
}); //====end of $function

function GetAllSpecialities() {
  var url = baseURL + "Speciality/GetAllSpeciality";
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
      var spcialityData = data.result;
      Filldatatable(spcialityData);
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

function EditDoctorFile(id) {
  var spId = $(id).attr("spId");
  window.location.href = "/Admin/edit-speciality?id=" + spId;
}

function Filldatatable(data) {
  $("#tblSpeciality").DataTable({
    bAutoWidth: false,
    data: data,
    columns: [
      {
        visible: false,
        data: "SpId",
      },

      // { data: "image" },
      {
        mRender: function (data, type, row) {
          return '<img width="30" height="30" src="' + row.image + '">';
        },
      },
      { data: "Name" },

      {
        mRender: function (data, type, row) {
          return (
            '<a href="#" onclick="EditDoctorFile(this)" spId="' +
            row.SpId +
            '" data-toggle="tooltip" data-placement="bottom" title="Edit Specialiy">' +
            ' <i class="bx bxs-pencil call-log-eye-btn"></i></a>'
          );
        },
      },
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

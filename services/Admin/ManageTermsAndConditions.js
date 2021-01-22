//var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";

$(function () {
  GetAllValueAndStatus();
}); //====end of $function

function GetAllValueAndStatus() {
  var url = baseURL + "ValueAndStatus/GetAllKeyAndValueStatus";
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
      var menuData = data;
      Filldatatable(menuData);
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

function Edit(id) {
  var KeyId = $(id).attr("keyId");
  window.location.href = "/Admin/edit-values?id=" + KeyId;
}

function Filldatatable(data) {
  $("#tblValueAndStatus").DataTable({
    bAutoWidth: false,
    data: data,
    columns: [
      {
        visible: false,
        data: "ValueID",
      },
      // { data: "ValueNameEn" },
      // { data: "ValueNameAr" },
      { data: "KeyValue" },

      {
        mRender: function (data, type, row) {
          return (
            '<a href="#" onclick="Edit(this)" keyId="' +
            row.ValueID +
            '" data-toggle="tooltip" data-placement="bottom" title="Edit">' +
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

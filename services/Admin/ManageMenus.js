//var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";

$(function () {
  GetAllMenus();
}); //====end of $function

function GetAllMenus() {
  var url = baseURL + "Menu/GetAllMenu";
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

function EditMenu(id) {
  var menuId = $(id).attr("menuId");
  window.location.href = "/Admin/edit-menu?id=" + menuId;
}

function Filldatatable(data) {
  $("#tblMenu").DataTable({
    bAutoWidth: false,
    data: data,
    columns: [
      {
        visible: false,
        data: "MenuId",
      },
      { data: "MenuName" },
      { data: "MenuUrl" },
      { data: "MenuOrder" },

      {
        mRender: function (data, type, row) {
          return (
            '<a href="#" onclick="EditMenu(this)" menuId="' +
            row.MenuId +
            '" data-toggle="tooltip" data-placement="bottom" title="Edit Role">' +
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

//var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";
var urlParams = new URLSearchParams(window.location.search);
var menuID = 0;
//var roleID = urlParams.get("id");
if (urlParams.has("id")) menuID = urlParams.get("id");

$(function () {
  if (menuID > 0) {
    GetMenu(menuID);
    $("#lblMenuHeading").text("Edit Menu");
    $("#btnSubmit").text("Update Menu");
  } else $("#lblMenuHeading").text("Create Menu");
  $("#frmMenu").submit(function (e) {
    e.preventDefault();
    if (menuID > 0) EditMenu();
    else AddMenu();
  });
}); //====end of $function

//== creat doctor with login
function AddMenu() {
  var url =
    baseURL +
    "Menu/AddMenu?MenuName=" +
    $("#txtMenuName").val() +
    "&MenuURL=" +
    $("#txtMenuURL").val() +
    "&MenuIcon=" +
    $("#txtMenuIcon").val();

  txtMenuIcon;
  ///==============start post request to add doctor
  $.ajax({
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    type: "POST",
    datatype: "application/json",
    contentType: "application/json; charset=utf-8",
    data: "",
    beforeSend: function () {
      $.LoadingOverlay("show");
    },
    success: function (data, textStatus, xhr) {
      $.LoadingOverlay("hide");
      Swal.fire({
        title: "Confirmation!",
        text: "Menu Created ",
        type: "success",
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: false,
        confirmButtonText: "<a style='color:#fff'>OK</a>",
      }).then((resuut) => {
        window.location.href = "/admin/all-menus";
      });
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
//== Edit menu
function EditMenu() {
  var url =
    baseURL +
    "Menu/UpdateMenu?MenuId=" +
    menuID +
    "&MenuName=" +
    $("#txtMenuName").val() +
    "&MenuURL=" +
    $("#txtMenuURL").val() +
    "&MenuIcon=" +
    $("#txtMenuIcon").val();

  ///==============start post request to add doctor
  $.ajax({
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    type: "POST",
    datatype: "application/json",
    contentType: "application/json; charset=utf-8",
    data: "",

    beforeSend: function () {
      $.LoadingOverlay("show");
    },
    success: function (data, textStatus, xhr) {
      $.LoadingOverlay("hide");
      Swal.fire({
        title: "Confirmation!",
        text: "Menu Edit ",
        type: "success",
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: false,
        confirmButtonText: "<a style='color:#fff'>OK</a>",
         }).then((resuut) => {
          window.location.href = "/admin/all-menus"
      });
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

function GetMenu(id) {
  var url = baseURL + "Menu/GetMenu?MenuId=" + id;
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
      $("#txtMenuName").val(data.MenuName);
      $("#txtMenuURL").val(data.MenuUrl);
      $("#txtMenuIcon").val(data.MenuIcon);
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

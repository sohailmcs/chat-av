var userLoginId = $(".user-name").attr("UserInfo");

var urlParams = new URLSearchParams(window.location.search);
var menuID = 0;
//var roleID = urlParams.get("id");
if (urlParams.has("id")) menuID = urlParams.get("id");

$(function () {
  // $("#dboRole").select2(); //searchable dropdown
  GetAllRoles();
  GetAllMenus();
  $("#btnAssignMenu").on("click", function () {
    AssignMenuToRole();
  });

  $("#dboRole").on("change", function () {
    var roleId = this.value;
    if (roleId != "0") GetAssignMenu(roleId);
  });
}); //====end of $function

function GetAllRoles() {
  var url = baseURL + "Role/GetAllRoles";
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
      var data = data.result;
      $("#dboRole").empty();
      $("#dboRole").append(
        $("<option>").text("Select Role").attr("value", "0")
      );

      for (var key in data) {
        $("#dboRole").append(
          $("<option>").text(data[key].RoleName).attr("value", data[key].RoleId)
        );
      }
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

      $.each(data, function (i, v) {
        console.log(v.MenuId);
        $("#listMenus")
          .append(
            `<input type="checkbox" style="margin-right:0.20rem" class="chkMenu form-check form-check-inline" id="chk${v.MenuId}" name="menu" value="${v.MenuId}">`
          )
          .append(
            `&nbsp;<label style="font-size:14px" for="chk${v.MenuId}">${v.MenuName}</label></div>`
          )
          .append(`<br>`);
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

function AssignMenuToRole() {
  var ListPermission = new Array();

  $(".chkMenu").each(function () {
    if (this.checked) {
      ListPermission.push({
        RoleId: $("#dboRole").val(),
        MenuId: $(this).val(),
        AddedBy: userLoginId,
        AddedDate: new Date().toLocaleDateString("en-us"),
      });
    }
  });

  var Permission = {
    ListPermission: ListPermission,
  };
  var url = baseURL + "Permissions/AddPermission?RoleId=" + $("#dboRole").val();

  $.ajax({
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    type: "POST",
    datatype: "application/json",
    contentType: "application/json; charset=utf-8",
    data: Permission,
    beforeSend: function () {
      $.LoadingOverlay("show");
    },
    success: function (data, textStatus, xhr) {
      $.LoadingOverlay("hide");
      Swal.fire({
        title: "Confirmation!",
        text: "Menu Assigned Successfully ",
        type: "success",
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: false,
        confirmButtonText: "Ok",
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

function GetAssignMenu(roleId) {
  var url = baseURL + "Menu/GetAssignedMenu?roleId=" + roleId;
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

      $.each(data.result, function (i, v) {
        $("#listMenus")
          .find("#chk" + v.MenuId)
          .attr("checked", true);
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

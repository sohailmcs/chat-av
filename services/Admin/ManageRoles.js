//var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";

$(function () {
  GetAllRoles();

  getTimezoneName();
  console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
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
      var roleIdData = data.result;
      Filldatatable(roleIdData);
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

function EditRole(id) {
  var rollId = $(id).attr("rollId");
  window.location.href = "/Admin/edit-role?id=" + rollId;
}

function Filldatatable(data) {
  $("#tblRole").DataTable({
    bAutoWidth: false,
    data: data,
    columns: [
      {
        visible: false,
        data: "RoleId",
      },

      // // { data: "image" },
      // {
      //   mRender: function (data, type, row) {
      //     return '<img width="30" height="30" src="' + row.image + '">';
      //   },
      // },
      { data: "RoleName" },

      {
        mRender: function (data, type, row) {
          return (
            '<a href="#" onclick="EditRole(this)" rollId="' +
            row.RoleId +
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

function getTimezoneName() {
  const today = new Date();
  const short = today.toLocaleDateString(undefined);
  const full = today.toLocaleDateString(undefined, { timeZoneName: 'long' });

  // Trying to remove date from the string in a locale-agnostic way
  const shortIndex = full.indexOf(short);
  if (shortIndex >= 0) {
    const trimmed = full.substring(0, shortIndex) + full.substring(shortIndex + short.length);

    // by this time `trimmed` should be the timezone's name with some punctuation -
    // trim it from both sides
    return trimmed.replace(/^[\s,.\-:;]+|[\s,.\-:;]+$/g, '');

  } else {
    // in some magic case when short representation of date is not present in the long one, just return the long one as a fallback, since it should contain the timezone's name
    return full;
  }
}

console.log(getTimezoneName());

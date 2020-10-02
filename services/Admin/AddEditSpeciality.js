var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";
var urlParams = new URLSearchParams(window.location.search);
var spId = 0;
var spId = urlParams.get("id");
if (urlParams.has("id")) spId = urlParams.get("id");

$(function () {
  if (spId > 0) GetSpeciality(spId);
  $("#frmSpeciality").submit(function (e) {
    e.preventDefault();
    if (spId > 0)
      Editpeciality(
        $("#txtspecialityName").val(),
        $("#description").val(),
        $(".thumbnail").attr("src")
      );
    else AddSpeciality();
  });
}); //====end of $function

//== creat doctor with login
function AddSpeciality() {
  var url = baseURL + "Speciality/AddSpeciality";
  var model = {
    Name: $("#txtspecialityName").val(),
    Description: $("#description").val(),
    image: $(".thumbnail").attr("src"),
    AddedBy: "Admin",
  };

  ///==============start post request to add doctor
  $.ajax({
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    type: "POST",
    datatype: "application/json",
    contentType: "application/json; charset=utf-8",
    data: model,
    beforeSend: function () {
      $.LoadingOverlay("show");
    },
    success: function (data, textStatus, xhr) {
      $.LoadingOverlay("hide");
      Swal.fire({
        title: "Confirmation!",
        text: "Speciality Created ",
        type: "success",
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: false,
        confirmButtonText: "<a style='color:#fff'>OK</a>",
      }).then((resuut) => {
        window.location.reload();
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
//== creat doctor with login
function Editpeciality(name, desc, image) {
  var url = baseURL + "Speciality/UpdateSpeciality";

  var model = {
    spId: spId,
    Name: name,
    Description: desc,
    image: image,
    ModifiedDate: new Date().toLocaleDateString(),
    ModifiedBy: "Admin",
  };

  ///==============start post request to add doctor
  $.ajax({
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    type: "POST",
    datatype: "application/json",
    contentType: "application/json; charset=utf-8",
    data: model,

    beforeSend: function () {
      $.LoadingOverlay("show");
    },
    success: function (data, textStatus, xhr) {
      $.LoadingOverlay("hide");
      Swal.fire({
        title: "Confirmation!",
        text: "Speciality Edit ",
        type: "success",
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: false,
        confirmButtonText: "<a style='color:#fff'>OK</a>",
        // }).then((resuut) => {
        //   window.location.reload();
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

function GetSpeciality(spId) {
  var url = baseURL + "Speciality/GetSpeciality?spId=" + spId;
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
      $("#txtspecialityName").val(data.Name);
      $("#description").val(data.Description);
      var div = document.createElement("div");
      if (data.image != null) {
        div.innerHTML =
          "<img class='thumbnail' src='" +
          data.image +
          "'" +
          "title='ProfilePicture'/>";
      } else {
        div.innerHTML =
          "<img class='thumbnail' src='/assets/images/maledoc.png'/>";
      }
      //=========set image control============
      $("#result").html(div);
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

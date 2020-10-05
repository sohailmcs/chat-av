var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";

$(function () {
  GetAllSpecialities();

  $(document).on("click", ".lnkSpeciality", function (e) {
    e.stopPropagation();
    var specialityName = $(this).attr("spNam");
    getSpecialityDoctor(specialityName);
  });
}); //end of $function

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
      //=====set values for slots templates======
      var slotTemplate = $("#template-speciality").html();
      $("#specialities").html(Mustache.to_html(slotTemplate, data));
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

function getSpecialityDoctor(spName) {
  window.location.href =
    "/patient/dashboard?spName=" + encodeURIComponent(spName);
}

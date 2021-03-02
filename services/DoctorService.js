//var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";
var useLoginId = $(".user-name").attr("UserInfo");
var urlParams = new URLSearchParams(window.location.search);
var Speciality = "";
if (urlParams.has("Speciality")) Speciality = urlParams.get("Speciality");
if (Speciality == "") Speciality = 0

var options = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};
var currentDt = new Date().toLocaleDateString("en-US", options);

//==login==========
$(function () {
  
  $("#dbofee").on("change", function () {
    var orderBy = $(this).val();
    GetDoctors(false, orderBy)
      .then((data) => {
        SetDoctorsList(data);
        $(".ratingArea").each(function () {
          var sumOfRating = parseInt($(this).find(".SumOfRating").val());
          var totalRating = parseInt($(this).find(".totalRating").val());
          var totalStars =
            totalRating > 0 ? parseInt(sumOfRating) / parseInt(totalRating) : 0;
          totalStars = Math.round(totalStars);
          var remainingStars = 5 - totalStars;
          if (totalStars > 0) {
            for (var i = 0; i < totalStars; i++) {
              $(this).append('<i class="bx bxs-star"></i>');
            }
          }
          for (var i = 0; i < remainingStars; i++) {
            $(this).append('<i class="bx bx-star"></i>');
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  });

  GetDoctors(false, "min")
    .then((data) => {
      SetDoctorsList(data);
      $(".ratingArea").each(function () {
        var sumOfRating = parseInt($(this).find(".SumOfRating").val());
        var totalRating = parseInt($(this).find(".totalRating").val());
        var totalStars =
          totalRating > 0 ? parseInt(sumOfRating) / parseInt(totalRating) : 0;
        totalStars = Math.round(totalStars);
        var remainingStars = 5 - totalStars;
        if (totalStars > 0) {
          for (var i = 0; i < totalStars; i++) {
            $(this).append('<i class="bx bxs-star"></i>');
          }
        }
        for (var i = 0; i < remainingStars; i++) {
          $(this).append('<i class="bx bx-star"></i>');
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });

  $(document).on("click", ".btnSencCallReq", function () {
    var doctorId = $(this).attr("docID");
    var fullName = $(this).attr("fullName");
    CheckIfCallLimitsEnd(doctorId)
      .then((data) => {
        if (data.toUpperCase() == "LimitsEnd".toUpperCase()) {
          Swal.fire({
            type: "info",
            title: "SORRY!",
            text: "Doctor's today call limits end. You can book appointment ",
            confirmButtonClass: "btn btn-primary",
            buttonsStyling: false,
            confirmButtonText: "Ok",
          });
          return false;
        } else
          window.location.href =
            "/patient/Addpatient?doctorId=" +
            doctorId +
            "&name=" +
            fullName +
            "&type=call" +
            "&Speciality=" +
            Speciality;
        //SendCallRequestToDoctor(doctorId, fullName);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  $(document).on("click", ".btnAppointments", function () {
    var doctorId = $(this).attr("docID");
    var fullName = $(this).attr("fullName");

    window.location.href =
      "/patient/appointment?doctorId=" +
      doctorId +
      "&name=" +
      fullName +
      "&type=sch" +
      "&Speciality=" +
      Speciality;
  });

  $(document).on("click", ".btndoctorProfile", function () {
    var doctorId = $(this).attr("docID");
    GetDoctorsProfile(doctorId);
  });
}); //==end of jquery $function

function CheckIfCallLimitsEnd(doctorId) {
  return new Promise((resolve, reject) => {
    var url =
      baseURL +
      "PatientCallRequest/GetCallLimit?doctorId=" +
      doctorId +
      "&status=Pending" +
      "&date=" +
      new Date().toLocaleDateString("en-US");

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
        resolve(data);
      },
      error: function (xhr, textStatus, err) {
        reject(err);
      },
      complete: function (data) {
        // Hide Loading
        $.LoadingOverlay("hide");
      },
    });
  });
}

function CheckIFcalledBefore(doctorId, patientId) {
  return new Promise((resolve, reject) => {
    var currentDt = new Date().toLocaleDateString("en-US");
    var url =
      baseURL +
      "CallQue/CheckIfCallQuesExist?doctorID=" +
      doctorId +
      "&patiendId=" +
      patientId +
      "&date=" +
      currentDt;

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
        resolve(data);
        $.LoadingOverlay("hide");
      },
      error: function (xhr, textStatus, err) {
        reject(err);
      },
      complete: function (data) {
        // Hide Loading
        $.LoadingOverlay("hide");
      },
    });
  });
}

function SetDoctorsList(data) {  
  if(data!=null)
  $("#lblDoctorListHeading").text(data.result[0].Specialization);
  else
  $("#lblDoctorListHeading").text("");

  var Usertemplate = $("#user-template").html();
  $("#doctorList").html(Mustache.to_html(Usertemplate, data));
}
function GetDoctors(isSync, orderByFee) {
  return new Promise((resolve, reject) => {
    var url =
      baseURL +
      "Doctor/GetDoctors?Speciality=" +
      Speciality +
      "&orderBy=" +
      orderByFee;

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
        if (!isSync) $.LoadingOverlay("show");
      },
      success: function (data, textStatus, xhr) {
        $.LoadingOverlay("hide");
        resolve(data);
        // var Usertemplate = $("#user-template").html();
        // $("#doctorList").html(Mustache.to_html(Usertemplate, data));
      },
      error: function (xhr, textStatus, err) {
        reject(err);
        // if (xhr.status == "500" && xhr.statusText == "InternalServerError")
        //   console.log(xhr.statusText);
        // else console.log(xhr.statusText);
      },
      complete: function (data) {
        // Hide Loading
        $.LoadingOverlay("hide");
      },
    });
  });
}

function SendCallRequestToDoctor(doctorId, fullName) {
  var currentDt = new Date().toLocaleDateString("en-US", options);
  var url =
    baseURL +
    "PatientCallRequest/SendRequestCallToDoctor?PatientID=" +
    useLoginId +
    "&DoctorID=" +
    doctorId +
    "&RequestStatus=Pending" +
    "&date=" +
    currentDt;

  //=======  set post model=========
  var model = {
    PatientID: useLoginId, //==get from session
    DoctorID: doctorId,
    RequestStatus: "Pending",
  };

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
      $("#reqcall").modal("show");
      setTimeout(function () {
        $("#reqcall").modal("hide");
      }, 3000);

      //======== send notification to doctor for callRequest
      soc.emit("NotifyDoctor", {
        username: fullName, // get doctorUsername from session
        docId: doctorId,
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

function GetDoctorsProfile(doctorId) {
  var url = baseURL + "Doctor/GetDoctorProfile?doctorId=" + doctorId;
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
      var profileTemplate = $("#docProfile-template").html();
      $("#primary").html(Mustache.to_html(profileTemplate, data));
      $("#primary").modal("show");
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

function updateDoctorOnlineStatus(UserID, status) {
  return new Promise((resolve, reject) => {
    var useStatus = status == "Online" ? true : false;
    var url =
      baseURL +
      "User/UpdateUserOnlineStatus?userId=" +
      UserID +
      "&Onlinestatus=" +
      useStatus +
      "&userType=Doctor";

    $.ajax({
      url: url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      type: "GET",
      datatype: "application/json",
      contentType: "application/json; charset=utf-8",
      data: "",
      beforeSend: function () {},
      success: function (data, textStatus, xhr) {
        resolve(data);
      },
      error: function (xhr, textStatus, err) {
        reject(err);
      },
      complete: function (data) {
        // Hide Loading
      },
    });
  })
    .then((date) => {
      GetDoctors(true, $("#dbofee").val());
    })
    .catch((error) => {
      console.log(error);
    });
}

Mustache.Formatters = {
  date: function (str) {
    var options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(str).toLocaleDateString("en-US", options);
  },
  Upper: function (str) {
    return str.toUpperCase();
  },
  Shortdate: function (str) {
    var options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(str).toLocaleDateString("en-US", options);
  },
};

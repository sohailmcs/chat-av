var baseURL = "https://kindahclinic.com/KindahService/";
var useLoginId = $(".user-name").attr("UserInfo");

var socket = io();
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
  GetDoctors(false);

  $(document).on("click", ".btnSencCallReq", function () {
    var doctorId = $(this).attr("docID");
    var fullName = $(this).attr("fullName");
    SendCallRequestToDoctor(doctorId, fullName, currentDt);
  });

  $(document).on("click", ".btndoctorProfile", function () {
    var doctorId = $(this).attr("docID");
    GetDoctorsProfile(doctorId);
  });
}); //==end of jquery $function

function GetDoctors(isSync) {
  var url = baseURL + "Doctor/GetDoctors";

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
      var Usertemplate = $("#user-template").html();
      $("#doctorList").html(Mustache.to_html(Usertemplate, data));
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

function SendCallRequestToDoctor(doctorId, fullName, currentDt) {
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

      //======== send notification to doctor for callRequest
      socket.emit("NotifyDoctor", {
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
      useStatus;

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
      GetDoctors(true);
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
};

//var baseURL = "http://localhost:1042/KindahService/";
var urlParams = new URLSearchParams(window.location.search);
var feeId = 0;
//var roleID = urlParams.get("id");
if (urlParams.has("id")) feeId = urlParams.get("id");

$(function () {
  if (feeId > 0) {
    GetFee(feeId);
    $("#lblHeading").text("Edit Fee Structure");
    $("#btnSubmit").text("Update Fee Structure");
  } else {
    $("#lblHeading").text("Create Fee Structure");
    GetAllSpecialities()
      .then((d) => {
        $("#dbospe").append(
          $("<option>").text("Select Specialization").attr("value", "0")
        );
        $.each(d.result, function (i, v) {
          $("#dbospe").append($("<option>").text(v.Name).attr("value", v.SpId));
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  $("#frmfee").submit(function (e) {
    e.preventDefault();
    if (feeId > 0) EditFee();
    else AddFee();
  });

  var inputValue = $(".form-input").val();
  if (inputValue == "") {
    $(".form-input").removeClass("filled");
    $(".form-input").parents(".form-group").removeClass("focused");
  } else {
    $(".form-input").addClass("filled");
    $(".form-input").parents(".form-group").addClass("focused");
  }

  //===========start animated placeholder============
  $(".form-input").focus(function () {
    $(this).parents(".form-group").addClass("focused");
  });

  $(".form-input").blur(function () {
    var inputValue = $(this).val();
    if (inputValue == "") {
      $(this).removeClass("filled");
      $(this).parents(".form-group").removeClass("focused");
    } else {
      $(this).addClass("filled");
    }
  });

  $("#dbospe").on("change", function () {
    var specialityId = $(this).find("option:selected").text();
    GetDoctors(specialityId, "0");
  });

  $("#txtAmount").on("input", function () {
    CalculateTotalFee();
  });

  $("#dboDuration").on("change", function () {
    CalculateTotalFee();
  });
}); //====end of $function

///calcuale total fee as per duration and enterd amount
function CalculateTotalFee() {
  var enterAmount = parseInt($("#txtAmount").val());
  var TotalFee =
    (parseInt($("#dboDuration").val()) / 15) * parseInt($("#txtAmount").val());
  if (enterAmount > 0)
    $("#txtTotalFee").text(
      "Total Fee for " + $("#dboDuration").val() + " minutes is " + TotalFee
    );
  else $("#txtTotalFee").text("Please enter amount to get TotalFee");
}

//== creat doctor with login
function AddFee() {
  var url = baseURL + "FeeStructure/AddFee";
  var model = {
    SpecializationId: $("#dbospe").val(),
    DoctorId: $("#dboDoctor").val(),
    CallType: $("#dbofeeType").val(),
    CallDuration: $("#dboDuration").val(),
    FeeAmount: $("#txtAmount").val(),
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
        text: "Fee Structure Created ",
        type: "success",
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: false,
        confirmButtonText: "<a style='color:#fff'>OK</a>",
      }).then((resuut) => {
        window.location.href = "/admin/all-fee";
      });
    },
    error: function (xhr, textStatus, err) {
      if (xhr.status == "500" && xhr.statusText == "InternalServerError")
        console.log(xhr.statusText);
      else if (xhr.status == "409" && xhr.statusText == "Conflict") {
        Swal.fire({
          title: "Info!",
          text: "Fee Structure already Exist for selected Doctor ",
          type: "Info",
          confirmButtonClass: "btn btn-primary",
          buttonsStyling: false,
          confirmButtonText: "<a style='color:#fff'>OK</a>",
        });
      } else console.log(xhr.statusText);
    },
    complete: function (data) {
      // Hide Loading
      $.LoadingOverlay("hide");
    },
  });
}
//== Edit menu
function EditFee() {
  var url = baseURL + "FeeStructure/UpdateFee";
  var model = {
    FeeId: feeId,
    SpecializationId: $("#dbospe").val(),
    DoctorId: $("#dboDoctor").val(),
    CallType: $("#dbofeeType").val(),
    CallDuration: $("#dboDuration").val(),
    FeeAmount: $("#txtAmount").val(),
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
        text: "Fee Edit ",
        type: "success",
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: false,
        confirmButtonText: "<a style='color:#fff'>OK</a>",
      }).then((resuut) => {
        window.location.href = "/admin/all-fee";
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

function GetFee(id) {
  var url = baseURL + "FeeStructure/GetFee?FeeId=" + id;
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

      $("#dbofeeType").val(data.CallType);
      $("#dboDuration").val(data.CallDuration);
      $("#txtAmount").val(data.FeeAmount);

      GetAllSpecialities()
        .then((d) => {
          $("#dbospe").append(
            $("<option>").text("Select Specialization").attr("value", "0")
          );
          $.each(d.result, function (i, v) {
            $("#dbospe").append(
              $("<option>").text(v.Name).attr("value", v.SpId)
            );
          });
          var selectedVal = data.SpecializationId + "";
          $("#dbospe option")
            .filter(function () {
              return $(this).val() == selectedVal; //To select Blue
            })
            .prop("selected", true);
          GetDoctors(
            $("#dbospe").find("option:selected").text(),
            data.DoctorId
          );
        })
        .catch((error) => {
          console.log(error);
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

      CalculateTotalFee();
    },
  });
}
function GetAllSpecialities() {
  return new Promise((resolve, reject) => {
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
        //=====set values for slots templates======
        resolve(data);
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

function GetDoctors(Id, selectedId) {
  var url = baseURL + "Doctor/GetDoctorsList?Speciality=" + Id;

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
      // $.LoadingOverlay("show");
    },
    success: function (data, textStatus, xhr) {
      // $.LoadingOverlay("hide");
      $("#dboDoctor").empty();

      $("#dboDoctor").append(
        $("<option>").text("Select Doctor").attr("value", "0")
      );
      $.each(data.result, function (i, v) {
        $("#dboDoctor").append(
          $("<option>").text(v.FullName).attr("value", v.DoctorId)
        );
      });

      if (selectedId != "0") $("#dboDoctor").val(selectedId);
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

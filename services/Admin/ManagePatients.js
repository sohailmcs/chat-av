//var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";

function validtion() {
    $("form").validate({
      rules: {
        email: {
          required: true,
          email: true,
        },
        Password: {
          required: true,
          maxlength: 10,
        },
        FirstName: {
          required: true,
        },
        LastName: {
          required: true,
        },
        Phone: {
          required: true,
          number: true,
        },
      },
      messages: {
        email: {
          required: "this field is required",
          email: "The email should be in the format: abc@domain.tld",
        },
        Password: {
          required: "this field is required",
          maxlength: 10,
        },
        FirstName: {
          required: "this field is required",
        },
        FirstName: {
          required: "this field is required",
        },
        Phone: {
          required: "this field is required",
          number: "Allow only number",
        },
      },
    });
  }
  $(function () {
    GetAllPatients();
  
    $("#frmDoctor").submit(function (e) {
      e.preventDefault();
      validtion();
      $(".error").css("display", "none");
      CreateDoctor();
    });
  }); //====end of $function
  
  //== creat doctor with login
  function CreateDoctor() {
    var url = baseURL + "ManageAdmin/SignUp";
    var model = {
      FirstName: $("#txtFirstName").val(),
      LastName: $("#txtFirstName").val(),
      Email: $("#txtEmail").val(),
      Password: $("#txtPassword").val(),
      PhoneNo: $("#txtPhone").val(),
      UserType: "Doctor",
      Gender: $("#dbogender").val(),
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
        if (xhr.status == "406") {
          Swal.fire({
            title: "Opps...!",
            text: "User already Exist ",
            type: "error",
            confirmButtonClass: "btn btn-primary",
            buttonsStyling: false,
            confirmButtonText: "<a style='color:#fff'>OK</a>",
          });
        } else {
          Swal.fire({
            title: "Confirmation!",
            text: "User Created ",
            type: "success",
            confirmButtonClass: "btn btn-primary",
            buttonsStyling: false,
            confirmButtonText: "<a style='color:#fff'>OK</a>",
          }).then((resuut) => {
            window.location.reload();
          });
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
  function GetAllPatients() {
    var url = baseURL + "Patient/GetKindahPatients"
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
        var doctorData = data.result;
        Filldatatable(doctorData);
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
  
  function EditPatient(id) {
    var patientId = $(id).attr("patientId");
    window.location.href = "/Admin/edit-patient?id=" + patientId;
  }
  
  function Filldatatable(data) {
    $("#tblDoctors").DataTable({
      bAutoWidth: false,
      data: data,
      columns: [
        {
          visible: false,
          data: "PatientId",
        },
  
        { data: "FullName" },
        { data: "PatientType" },
        // { data: "Gender" },
        { data: "PhoneNo" },       
        { data: "CountryName" },
        { data: "CityName" },
        { data: "Age" },
        // { data: "Cansee:" },
  
        {
          mRender: function (data, type, row) {
            return (
              '<a href="#" onclick="EditPatient(this)" patientId="' +
              row.PatientId +
              '" data-toggle="tooltip" data-placement="bottom" title="Edit Doctor">' +
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

  
  
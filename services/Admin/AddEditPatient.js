//var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";
var urlParams = new URLSearchParams(window.location.search);
var patientId = 0;
//var roleID = urlParams.get("id");
if (urlParams.has("id")) patientId = urlParams.get("id");

$(function () {
  $("#frmPatientEdit").submit(function (e) {
    e.preventDefault();
    EditPatient();
  });

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
  //===========end animated placeholder==============

  $("#dboCountry").select2({
    placeholder: "Select Country",
  });
  $("#dboCity").select2({
    placeholder: "Select City",
  });

  FillCountry();
  $("#dboCountry").on("change", function () {
    var countryId = this.value;
    FillCity(countryId, "0", true);
  });
  GetPatient(patientId);
}); //====end of $function

//=====get patient to edit

function GetPatient(id) {
  var url = baseURL + "Patient/GetPatientById?PatientId=" + id;
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
    success: function (d, textStatus, xhr) {
      $.LoadingOverlay("hide");

      $("#txtFirstName").val(d.FirstName);
      $("#txtLastName").val(d.LastName);
      $("#dboGender option:contains(" + d.Gender + ")").attr(
        "selected",
        "selected"
      );
      $("#txtAge").val(parseInt(d.Age));
      if (d.CountryId) {
        $("#dboCountry").val(d.CountryId);
        $("#dboCountry").trigger("change");
        FillCity(d.CountryId, "0", true);
      }

      //====check if profile picture is exist then display dummy image
      var div = document.createElement("div");
      if (d.PatientPhoto != null) {
        div.innerHTML =
          "<img class='thumbnail' src='" +
          d.PatientPhoto +
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

      var inputValue = $(".form-input").val();
      if (inputValue == "") {
        $(".form-input").removeClass("filled");
        $(".form-input").parents(".form-group").removeClass("focused");
      } else {
        $(".form-input").addClass("filled");
        $(".form-input").parents(".form-group").addClass("focused");
      }
    },
  });
}
//== Edit Patient
function EditPatient() {
  var url = baseURL + "Patient/AddUpdatePatient";

  var model = {
    PatientId : patientId,
    FirstName: $("#txtFirstName").val(),
    LastName: $("#txtLastName").val(),
    FullName : $("#txtFirstName").val() + " " + $("#txtLastName").val(),
    PatientPhoto: $(".thumbnail").attr("src"),
    Gender: $("#dboGender").val(),
    Age: $("#txtAge").val(),
    CountryId: $("#dboCountry").val(),
    CityId: $("#dboCity").val(),
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
        text: "Patiend Updated",
        type: "success",
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: false,
        confirmButtonText: "<a style='color:#fff'>OK</a>",
      }).then((resuut) => {
        window.location.href = "/admin/all-patient";
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
      firstName: {
        required: true,
      },
      lastName: {
        required: true,
      },
      contactNo: {
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
      firstName: {
        required: "this field is required",
      },
      lastName: {
        required: "this field is required",
      },
      contactNo: {
        required: "this field is required",
        number: "Allow only number",
      },
    },
  });
}

function FillCity(countryID, selectedval) {
  var url = baseURL + "City/GetCity?countryId=" + countryID;
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
      // if (isSync) $.LoadingOverlay("show");
    },
    success: function (data, textStatus, xhr) {
      $("#dboCity").empty();

      for (var key in data.info) {
        $("#dboCity").append(
          $("<option>")
            .text(data.info[key].NameEn)
            .attr("value", data.info[key].CityID)
        );
      }

      if (selectedval != "0") $("#dboCity").val(selectedval);
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

function FillCountry() {
  var url = baseURL + "Country/GetCountry";
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
      //  $.LoadingOverlay("show");
    },
    success: function (data, textStatus, xhr) {
      // $.LoadingOverlay("hide");

      $("#dboCountry").empty();

      for (var key in data.info) {
        $("#dboCountry").append(
          $("<option>")
            .text(data.info[key].NameEn)
            .attr("value", data.info[key].CountryID)
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
      // $.LoadingOverlay("hide");
    },
  });
}

function CalculateAge(userinput) {
  //collect input from HTML form and convert into date format
  // var userinput = document.getElementById("txtInfoAge").value;
  var dob = new Date(userinput);
  
  //check user provide input or not
  if(userinput==null || userinput==''){
    document.getElementById("spnAge").innerHTML = "**Choose a date please!";  
    return false; 
  } 
  
  //execute if the user entered a date 
  else {
  //extract the year, month, and date from user date input
  var dobYear = dob.getYear();
  var dobMonth = dob.getMonth();
  var dobDate = dob.getDate();
  
  //get the current date from the system
  var now = new Date();
  //extract the year, month, and date from current date
  var currentYear = now.getYear();
  var currentMonth = now.getMonth();
  var currentDate = now.getDate();

  //declare a variable to collect the age in year, month, and days
  var age = {};
  var ageString = "";

  //get years
  yearAge = currentYear - dobYear;

  //get months
  if (currentMonth >= dobMonth)
    //get months when current month is greater
    var monthAge = currentMonth - dobMonth;
  else {
    yearAge--;
    var monthAge = 12 + currentMonth - dobMonth;
  }

  //get days
  if (currentDate >= dobDate)
    //get days when the current date is greater
    var dateAge = currentDate - dobDate;
  else {
    monthAge--;
    var dateAge = 31 + currentDate - dobDate;

    if (monthAge < 0) {
      monthAge = 11;
      yearAge--;
    }
  }
  //group the age in a single variable
  age = {
  years: yearAge,
  months: monthAge,
  days: dateAge
  };
    
    
  if ( (age.years > 0) && (age.months > 0) && (age.days > 0) )
     ageString = age.years + " years, " + age.months + " months, and " + age.days + " days old.";
  else if ( (age.years == 0) && (age.months == 0) && (age.days > 0) )
     ageString = "Only " + age.days + " days old!";
  //when current month and date is same as birth date and month
  else if ( (age.years > 0) && (age.months == 0) && (age.days == 0) )
     ageString = age.years +  " years old. Happy Birthday!!";
  else if ( (age.years > 0) && (age.months > 0) && (age.days == 0) )
     ageString = age.years + " years and " + age.months + " months old.";
  else if ( (age.years == 0) && (age.months > 0) && (age.days > 0) )
     ageString = age.months + " months and " + age.days + " days old.";
  else if ( (age.years > 0) && (age.months == 0) && (age.days > 0) )
     ageString = age.years + " years, and" + age.days + " days old.";
  else if ( (age.years == 0) && (age.months > 0) && (age.days == 0) )
     ageString = age.months + " months old.";
  //when current date is same as dob(date of birth)
  else ageString = "It's first day on Earth!"; 

  //display the calculated age
  return document.getElementById("spnAge").innerHTML = "("+ ageString + ")"; 
           
}
}

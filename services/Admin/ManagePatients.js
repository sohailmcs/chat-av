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
$(function() {
    GetAllPatients();

    $("#frmDoctor").submit(function(e) {
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
        beforeSend: function() {
            $.LoadingOverlay("show");
        },
        success: function(data, textStatus, xhr) {
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
        error: function(xhr, textStatus, err) {
            if (xhr.status == "500" && xhr.statusText == "InternalServerError")
                console.log(xhr.statusText);
            else console.log(xhr.statusText);
        },
        complete: function(data) {
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
        beforeSend: function() {
            $.LoadingOverlay("show");
        },
        success: function(data, textStatus, xhr) {
            $.LoadingOverlay("hide");
            var doctorData = data.result;
            Filldatatable(doctorData);
        },
        error: function(xhr, textStatus, err) {
            if (xhr.status == "500" && xhr.statusText == "InternalServerError")
                console.log(xhr.statusText);
            else console.log(xhr.statusText);
        },
        complete: function(data) {
            // Hide Loading
            $.LoadingOverlay("hide");
        },
    });
}

function EditPatient(id) {
    var patientId = $(id).attr("patientId");
    window.location.href = "/Admin/edit-patient?id=" + patientId;
}

function ActiveInactivePatient(id) {
    var patientId = $(id).attr("patientId");
    var status = $(id).attr("isactive");
    var statusResult = "Active successfully";
    var url = baseURL + "Patient/ActiveUnActivePatient?patientId=" + patientId + "&status=" + status;
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
        beforeSend: function() {
            $.LoadingOverlay("show");
        },
        success: function(data, textStatus, xhr) {

            if (status == "false")
                statusResult = "Inactive successfully"

            Swal.fire({
                title: "Confirmation!",
                text: "Patient " + statusResult,
                type: "success",
                confirmButtonClass: "btn btn-primary",
                buttonsStyling: false,
                confirmButtonText: "Ok",
            }).then((data) => {
                GetAllPatients();
            })

        },
        error: function(xhr, textStatus, err) {
            if (xhr.status == "500" && xhr.statusText == "InternalServerError")
                console.log(xhr.statusText);
            else console.log(xhr.statusText);
        },
        complete: function(data) {

            // Hide Loading
            $.LoadingOverlay("hide");


        },
    });
}


function Filldatatable(data) {
    $("#tblDoctors").DataTable({
        bDestroy: true,
        bAutoWidth: false,
        data: data,
        columns: [{
                visible: false,
                data: "PatientId",
            },

            { data: "FullName" },
            { data: "PatientType" },
            // { data: "Gender" },
            { data: "PhoneNo" },
            { data: "CountryName" },
            { data: "CityName" },

            {
                data: "Age",
                render: function(data) {
                    return CalculateAgeByDOB(data);
                    //return new Date(data).toLocaleDateString("en-us");
                }
            },

            { visible: false, data: "isActive" },
            {
                mRender: function(data, type, row) {
                    if (row.isActive) {
                        return (
                            '<a href="#" onclick="ActiveInactivePatient(this)" patientId="' + row.PatientId + '" data-toggle="tooltip" isactive="false" data-placement="bottom" title="Edit User">' +
                            "Active</a>"
                        );
                    } else {
                        return (
                            '<a href="#" onclick="ActiveInactivePatient(this)" patientId="' +
                            row.PatientId +
                            '" data-toggle="tooltip" isactive="true" data-placement="bottom" title="Edit User">' +
                            "InActive</a>"
                        );
                    }
                },
            },
            {
                mRender: function(data, type, row) {
                    return (
                        '<a href="#" onclick="EditPatient(this)" patientId="' +
                        row.PatientId +
                        '" data-toggle="tooltip" data-placement="bottom" title="Edit Doctor">' +
                        ' <i class="bx bxs-pencil call-log-eye-btn"></i></a>'
                    );
                },
            },
        ],
        columnDefs: [{
            targets: "_all",
            defaultContent: "",
        }, ],
        order: [
            [1, "asc"]
        ],
    });
}


function CalculateAgeByDOB(userinput) {
    //collect input from HTML form and convert into date format
    // var userinput = document.getElementById("txtInfoAge").value;
    var dob = new Date(userinput);

    //check user provide input or not
    if (userinput == null || userinput == "") {
        return "N/A";

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
            days: dateAge,
        };

        if (age.years > 0 && age.months > 0 && age.days > 0)
            ageString = age.years + " years ";
        //  +
        // age.months +
        // " months, and " +
        // age.days +
        // " days old.";
        else if (age.years == 0 && age.months == 0 && age.days > 0)
            ageString = age.days + " days ";
        //ageString = "Only " + age.days + " days old!";
        //when current month and date is same as birth date and month
        else if (age.years > 0 && age.months == 0 && age.days == 0)
            ageString = age.years + " years";
        // ageString = age.years + " years old. Happy Birthday!!";
        else if (age.years > 0 && age.months > 0 && age.days == 0)
        // ageString = age.years + " years and " + age.months + " months old.";
            ageString = age.years + " years";
        else if (age.years == 0 && age.months > 0 && age.days > 0)
            ageString = age.months + " months";
        //ageString = age.months + " months and " + age.days + " days old.";
        else if (age.years > 0 && age.months == 0 && age.days > 0)
            ageString = age.years + " years ";
        //ageString = age.years + " years, and" + age.days + " days old.";
        else if (age.years == 0 && age.months > 0 && age.days == 0)
            ageString = age.months + " months";
        //ageString = age.months + " months old.";
        //when current date is same as dob(date of birth)
        else ageString = "It's first day on Earth!";

        //display the calculated age
        return ageString;
        //(document.getElementById("spnAge").innerHTML =   "(" + ageString + ")");
    }
}
//var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";
var urlParams = new URLSearchParams(window.location.search);
var doctorId = 0;
var doctorId = urlParams.get("id");
if (urlParams.has("id")) doctorId = urlParams.get("id");

$(function() {
    //===========start animated placeholder============
    $(".form-input").focus(function() {
        $(this).parents(".form-group").addClass("focused");
    });

    $(".form-input").blur(function() {
        var inputValue = $(this).val();
        if (inputValue == "") {
            $(this).removeClass("filled");
            $(this).parents(".form-group").removeClass("focused");
        } else {
            $(this).addClass("filled");
        }
    });

    //==================show hide password when click eye icon====
    $(".reveal").on("click", function() {
        var $pwd = $(".pwd");
        if ($pwd.attr("type") === "password") {
            $(this).find("i").addClass("fa-eye-slash");
            $(this).find("i").removeClass("fa-eye");
            $pwd.attr("type", "text");
        } else {
            $pwd.attr("type", "password");
            $(this).find("i").removeClass("fa-eye-slash");
            $(this).find("i").addClass("fa-eye");
        }
    });

    $("#dboCountry").select2({
        placeholder: "Select Country",
    });
    $("#dboCity").select2({
        placeholder: "Select City",
    });
    FillCountry();
    $("#dboCountry").on("change", function() {
        var countryId = this.value;
        FillCity(countryId, "0", true);
    });
    $("#dboProficiency").select2({
        placeholder: "Select Proficiency",
    });

    // $("#txtPwd").focusout(function () {
    //   var txt = $(this).val();
    //   $("#hdnpwd").val(txt);
    // });

    $("#txtbioGraphy").kendoEditor({
        resizable: {
            content: false,
            toolbar: true,
        },
    });

    GetDoctorsProfile(doctorId);
    $("#frmDoctorProfile").on("submit", function(e) {
        e.preventDefault();
        AddEditDoctorProfile(doctorId);
        // CheckPhoneAlergyExit(doctorId, $("#txtPno").val()).then(data => {
        //     AddEditDoctorProfile(doctorId);

        // }).catch((error) => {
        //     if (error == "Found") {
        //         Swal.fire({
        //             title: "Confirmation!",
        //             text: "Doctor with same phone number already exit ",
        //             type: "error",
        //             confirmButtonClass: "btn btn-primary",
        //             buttonsStyling: false,
        //             confirmButtonText: "Ok",
        //         })
        //     } else
        //         console.log(error);
        // });

    });
});


function CheckPhoneAlergyExit(doctorId, PhoneNo) {
    return new Promise((resolve, reject) => {

        var url = baseURL + "Doctor/CheckPhoneExit?doctorId=" + doctorId + "&PhoneNo=" + PhoneNo;
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
                resolve(data);
            },

            error: function(xhr, textStatus, err) {
                reject(err);
            },
            complete: function(data) {
                // Hide Loading
                $.LoadingOverlay("hide");
            },
        });
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
        beforeSend: function() {
            // if (isSync) $.LoadingOverlay("show");
        },
        success: function(data, textStatus, xhr) {
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
        beforeSend: function() {
            //  $.LoadingOverlay("show");
        },
        success: function(data, textStatus, xhr) {
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
        error: function(xhr, textStatus, err) {
            if (xhr.status == "500" && xhr.statusText == "InternalServerError")
                console.log(xhr.statusText);
            else console.log(xhr.statusText);
        },
        complete: function(data) {
            // Hide Loading
            // $.LoadingOverlay("hide");
        },
    });
}

function SetDoctorProfile(d) {
    //====check if profile picture is exist then display dummy image
    var div = document.createElement("div");
    if (d.ProfilePicture != null) {
        div.innerHTML =
            "<img class='thumbnail' src='" +
            d.ProfilePicture +
            "'" +
            "title='ProfilePicture'/>";
    } else {
        div.innerHTML = "<img class='thumbnail' src='/assets/images/maledoc.png'/>";
    }
    //=========set image control============
    $("#result").html(div);

    console.log(d.PhoneNumber);
    $("#txtUname").val(d.Email);
    //$("#hdnpwd").val(d.password);
    $("#txtPwd").val(d.password);
    $("#txtFname").val(d.FirstName);
    $("#txtLname").val(d.LastName);
    $("#txtbioGraphy").data("kendoEditor").value(d.Biography);
    $("#txtPno").val(parseInt(d.PhoneNumber));
    $("#dbogender option:contains(" + d.Gender + ")").attr(
        "selected",
        "selected"
    );
    $("#txtClinicName").val(d.ClinicName);
    $("#clinicAddress").val(d.ClinicAddress);
    $("#txtAddress1").val(d.Address);
    $("#txtAddress2").val(d.AddressLine1);
    $("#dboCountry").val(d.CountryId);
    $("#dboCountry").trigger("change");

    FillCity(d.CountryId, d.CityId);

    // $("#dboCountry option:contains(" + d.Country + ")").attr(
    //   "selected",
    //   "selected"
    // );
    $("#txtState option:contains(" + d.State + ")").attr("selected", "selected");
    // $("#dboCity").val(d.City).change();
    $("#txtServices").val(d.Services);
    GetAllSpecialities(d.SpecializationId);

    // $("#txtspe option:contains(" + d.Specialization + ")").attr(
    //   "selected",
    //   "selected"
    // );

    $("#txtAward").val(d.Award);
    $("#CallLimt").val(d.DoctorCall_Limit);

    $("#txtAwarYear option:contains(" + d.AwardYear + ")").attr(
        "selected",
        "selected"
    );
    if (d.Proficiency) {
        var prof = d.Proficiency.split(",");
        $("#dboProficiency").val(prof).trigger("change");
    }

    //====set hospital information=====
    setDoctorExperiance(d.DoctorExperianceModel);

    //===========set doctor education
    setDoctorEducation(d.DoctorEducationsModel);
}

function setDoctorExperiance(data) {
    $.each(data, function(ind, val) {
        var dtTo = new Date(val.To).toISOString().split('T')[0];
        var dtFrom = new Date(val.From).toISOString().split('T')[0];
        $("#txtHospital").val(val.HospitalName);
        $("#txtTo").val(dtTo);
        $("#txtFrom").val(dtFrom);
        $("#txtDesignation").val(val.Designation);
    });
}

function setDoctorEducation(data) {
    $.each(data, function(ind, val) {
        $("#txtDegree").val(val.Degree);
        $("#dboYear option:contains(" + val.YearsOfCompletion + ")").attr(
            "selected",
            "selected"
        );
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
        beforeSend: function() {
            $.LoadingOverlay("show");
        },
        success: function(data, textStatus, xhr) {
            $.LoadingOverlay("hide");
            SetDoctorProfile(data);
        },
        error: function(xhr, textStatus, err) {
            if (xhr.status == "500" && xhr.statusText == "InternalServerError")
                console.log(xhr.statusText);
            else console.log(xhr.statusText);
        },
        complete: function(data) {
            var inputValue = $(".form-input").val();

            $(".form-input").each(function() {
                if ($(this).val() == "") {
                    $(this).removeClass("filled");
                    $(this).parents(".form-group").removeClass("focused");
                } else {
                    $(this).addClass("filled");
                    $(this).parents(".form-group").addClass("focused");
                }
            });

            // Hide Loading
            $.LoadingOverlay("hide");
        },
    });
}



function AddEditDoctorProfile(doctorId) {
    var url = baseURL + "Doctor/AddUpdateDoctorProfile";

    var modelDetails = new Object();
    var DoctorEducationsModel = new Array();
    DoctorEducationsModel.push({
        Degree: $("#txtDegree").val(),
        YearsOfCompletion: jQuery("#dboYear option:selected").text(),
    });

    var DoctorExperianceModel = new Array();
    DoctorExperianceModel.push({
        HospitalName: $("#txtHospital").val(),
        From: $("#txtFrom").val(),
        To: $("#txtTo").val(),
        Designation: $("#txtDesignation").val(),
    });

    var proficiency = $("#dboProficiency").val();
    var selectedSource = "";
    if (proficiency !== null && proficiency.length > 0) {
        selectedSource = proficiency.join(",");
    }

    //modelDetails.push({
    modelDetails.DoctorId = doctorId;
    modelDetails.FirstName = $("#txtFname").val();
    modelDetails.LastName = $("#txtLname").val();
    modelDetails.password = $("#txtPwd").val();

    modelDetails.FullName = $("#txtFname").val() + " " + $("#txtLname").val();
    modelDetails.SpecializationId = jQuery("#txtspe").val(); // option:selected").text();
    modelDetails.Services = $("#txtServices").val();
    modelDetails.Gender = jQuery("#dbogender option:selected").text();
    modelDetails.MemberShipID = 1;
    modelDetails.Biography = $("#txtbioGraphy").data("kendoEditor").value();
    modelDetails.ClinicName = $("#txtClinicName").val();
    modelDetails.ClinicAddress = $("#clinicAddress").val();
    modelDetails.ClinicPhotoPath = "";
    modelDetails.Address = $("#txtAddress1").val();
    modelDetails.AddressLine1 = $("#txtAddress2").val();
    modelDetails.City = jQuery("#dboCity").val();
    modelDetails.Country = jQuery("#dboCountry").val();
    modelDetails.Title = "";
    modelDetails.ProfilePicture = $(".thumbnail").attr("src");
    modelDetails.Cansee = "Adult";
    modelDetails.DoctorSignature = "";
    modelDetails.DoctorCall_Limit = jQuery("#CallLimt").val(); // $("#CallLimt").val();
    modelDetails.Award = $("#txtAward").val();
    modelDetails.Proficiency = selectedSource;
    modelDetails.AwardYear = jQuery("#txtAwarYear option:selected").text();
    modelDetails.DoctorEducations = DoctorEducationsModel;
    modelDetails.DoctorExperiance = DoctorExperianceModel;
    //});

    $.ajax({
        url: url,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        type: "POST",
        datatype: "application/json",
        contentType: "application/json; charset=utf-8",
        data: modelDetails,
        beforeSend: function() {
            $.LoadingOverlay("show");
        },
        success: function(data, textStatus, xhr) {
            $.LoadingOverlay("hide");
            Swal.fire({
                title: "Confirmation!",
                text: "Doctor Profile Created ",
                type: "success",
                confirmButtonClass: "btn btn-primary",
                buttonsStyling: false,
                confirmButtonText: "Ok",
            }).then((result) => {
                window.location.href = "/admin/all-doctors";
            });
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

function GetAllSpecialities(selectedValue) {
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
        beforeSend: function() {
            $.LoadingOverlay("show");
        },
        success: function(data, textStatus, xhr) {
            //=====set values for slots templates======

            $("#txtspe").append(
                $("<option>").text("Select Specialization").attr("value", "0")
            );
            $.each(data.result, function(i, v) {
                $("#txtspe").append($("<option>").text(v.Name).attr("value", v.SpId));
            });

            $("#txtspe").val(selectedValue);
            // $("#txtspe option:contains(" + selectedValue + ")").attr(
            //   "selected",
            //   "selected"
            // );

            // var slotTemplate = $("#template-speciality").html();
            // $("#specialities").html(Mustache.to_html(slotTemplate, data));
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
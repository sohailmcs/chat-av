//var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";
var urlParams = new URLSearchParams(window.location.search);
var UserId = 0;
//var roleID = urlParams.get("id");
if (urlParams.has("id")) UserId = urlParams.get("id");
var specialityId = 0;
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


    GetAllRoles();
    $("#divSpeciality").hide();
    if (UserId > 0) {
        $("#dboUserType").prop("disabled", true);
        GetUser(UserId);
        $("#lblUserHeading").text("Edit User");
        $("#btnSubmit").text("Update User");
        $("#txtFirstName, #txtLastName").attr("readonly", "readonly");
    } else {
        $("#lblUserHeading").text("Create User");

    }

    $("#frmSignUpAdmin").submit(function(e) {
        e.preventDefault();
        if (UserId > 0) EditUser();
        else AddUser();
    });
    $("#dboUserType").on("change", function() {
        var val = this.value;
        if (val.toLowerCase() == "doctor") {
            GetAllSpecialities();
            $("#divSpeciality").show().addClass("focused");
            $("#txtspe").attr("required", true);
        } else {
            $("#divSpeciality").hide();
            $("#txtspe").removeAttr("required");
        }
    });
    $(document).on("change", "#txtspe", function(event) {
        specialityId = this.value;
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



}); //====end of $function

//== creat doctor with login
function AddUser() {
    //validtion();
    var enterdText = $("#txtPhoneNo").val();
    if (!validatephonenumber(enterdText)) {
        Swal.fire({
            type: "info",
            title: "SORRY!",
            html: "Plase enter correct phone no<br> <b >" +
                $("#txtPhoneNo").val() +
                "</b><br> ",
        });
        return false;
    }






    var model = {
        FirstName: $("#txtFirstName").val(),
        LastName: $("#txtLastName").val(),
        FullName: $("#txtFirstName").val() + " " + $("#txtLastName").val(),
        Email: $("#txtEmail").val(),
        Password: $("#txtPassword").val(),
        PhoneNo: $("#txtPhoneNo").val().replace(/^0+/, ""), //======remove leadng zero from phone number
        PhoneExt: $("input:disabled").val(),
        UserType: $("#dboUserType option:selected").text(),
        RoleId: $("#dboRole").val(),
        SpecializationId: specialityId,
        pageName: "Admin Signup",
        pageUrl: window.location.href,
    };

    var url = baseURL + "User/SignUpFromAdmin";
    //var url = baseURL + "User/SignUp";

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
            //Show Loading if validate pass
            $.LoadingOverlay("show");
        },
        success: function(d, textStatus, xhr) {
            $(".error").hide();
            Swal.fire({
                title: "Congratulations",
                text: "Click on button Login to Access your Account",
                type: "success",
                confirmButtonClass: "btn btn-primary",
                buttonsStyling: false,
                confirmButtonText: "<a style='color:#fff'>OK</a>",
            }).then(function() {
                window.location.reload();
            });
        },
        error: function(xhr, textStatus, err) {
            if (xhr.status == "406" && xhr.statusText == "Not Acceptable") {
                // if (xhr.status == "406" && textStatus == "NotAcceptable") {
                Swal.fire({
                    type: "info",
                    title: "SORRY!",
                    text: "Email " +
                        $("#txtEmail").val() +
                        " already exist. Please choose different email",
                    type: "error",
                    confirmButtonClass: "btn btn-primary",
                    buttonsStyling: false,
                    confirmButtonText: "<a style='color:#fff'>OK</a>",
                });
                return false;
            }
        },
        complete: function(data) {
            // Hide Loading
            $.LoadingOverlay("hide");
        },
    });
}
//== Edit menu
function EditUser() {
    var url = baseURL + "User/UpdateUserByAdmin";

    var model = {
        Email: $("#txtEmail").val(),
        Password: $("#txtPassword").val(),
        UserType: $("#dboUserType option:selected").text(),
        PhoneNo: $("#txtPhoneNo").val(),
        PhoneExt: $("input:disabled").val(),
        RoleId: $("#dboRole").val(),
        UserId: UserId,
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
            Swal.fire({
                title: "Confirmation!",
                text: "User Edit ",
                type: "success",
                confirmButtonClass: "btn btn-primary",
                buttonsStyling: false,
                confirmButtonText: "<a style='color:#fff'>OK</a>",
                // }).then((resuut) => {
                //   window.location.reload();
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

function GetUser(id) {
    var url = baseURL + "User/GetUserById?UserId=" + id;
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

            $("#txtEmail").val(data.Email),
                $("#txtPassword").val(data.Password),
                $("#txtPhoneNo").val(parseInt(data.PhoneNo));
            $("input:disabled").val(data.PhoneExt),
                $("#dboUserType option:contains(" + data.UserType + ")").attr(
                    "selected",
                    "selected"
                );


            $("#dboRole").val(data.RoleId);
            $("#txtFirstName").val(data.FirstName);
            $("#txtLastName").val(data.LastName);
        },
        error: function(xhr, textStatus, err) {
            if (xhr.status == "500" && xhr.statusText == "InternalServerError")
                console.log(xhr.statusText);
            else console.log(xhr.statusText);
        },
        complete: function(data) {
            var inputValue = $(".form-input").val();
            if (inputValue == "") {
                $(".form-input").removeClass("filled");
                $(".form-input").parents(".form-group").removeClass("focused");
            } else {
                $(".form-input").addClass("filled");
                $(".form-input").parents(".form-group").addClass("focused");
            }

            // Hide Loading
            $.LoadingOverlay("hide");
        },
    });
}

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
        beforeSend: function() {
            $.LoadingOverlay("show");
        },
        success: function(data, textStatus, xhr) {
            //=====set values for slots templates======

            $("#txtspe").empty().append(
                $("<option>").text("Select Specialization").attr("value", "")
            );
            $.each(data.result, function(i, v) {
                $("#txtspe").append($("<option>").text(v.Name).attr("value", v.SpId));
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

function validatephonenumber(inputtxt) {
    var isValid = true;
    var regex = new RegExp(/^(?:\+?0*?966)?0?5[0-9]{8}$/);
    var phoneNo = inputtxt;
    if (!regex.test(phoneNo)) {
        isValid = false;
    } else {
        isValid = true;
    }
    return isValid;
}

function validtion() {
    $("#frmSignUpAdmin").validate({
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
            contactNo: {
                required: true,
                number: true,
            },
            Specialization: "required",
            // Specialization: {
            //     required: true
            // }
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
            LastName: {
                required: "this field is required",
            },
            contactNo: {
                required: "this field is required",
                number: "Allow only number",
            },
        },
    });
}

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
        beforeSend: function() {
            $.LoadingOverlay("show");
        },
        success: function(data, textStatus, xhr) {
            $.LoadingOverlay("hide");
            var data = data.result;
            $("#dboRole").empty();
            $("#dboRole").append(
                $("<option>").text("Select Role").attr("value", "")
            );

            for (var key in data) {
                $("#dboRole").append(
                    $("<option>").text(data[key].RoleName).attr("value", data[key].RoleId)
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
            $.LoadingOverlay("hide");
        },
    });
}
//var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";


$(function() {
    // if ($.fn.dataTable.isDataTable('#tblUsers')) {
    //     table = $('#tblUsers').DataTable();
    // } else {
    //     table = $('#tblUsers').DataTable({
    //         paging: false
    //     });
    // }

    GetAllUsers();
}); //====end of $function

function GetAllUsers() {
    var url = baseURL + "User/GetAllUsers";
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
            // var usersData = data.result;
            // console.log(data);
            Filldatatable(data);
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

function EditUser(id) {
    var userId = $(id).attr("userId");
    window.location.href = "/Admin/edit-user?id=" + userId;
}

function Filldatatable(data) {
    $("#tblUsers").DataTable({
        bAutoWidth: false,
        bDestroy: true,
        data: data,
        columns: [{
                visible: false,
                data: "UserId",
            },
            { data: "Email" },
            { data: "RoleName" },
            { data: "PhoneNo" },
            { data: "UserType" },
            { visible: false, data: "isActive" },

            {
                mRender: function(data, type, row) {
                    if (row.isActive) {
                        return (
                            '<a href="#" onclick="ActiveInactiveUser(this)" userId="' + row.UserId + '" userType="' + row.UserType + '" data-toggle="tooltip" isactive="false" data-placement="bottom" title="Edit User">' +
                            "Active</a>"
                        );
                    } else {
                        return (
                            '<a href="#" onclick="ActiveInactiveUser(this)" userId="' +
                            row.UserId + '" userType="' + row.UserType +
                            '" data-toggle="tooltip" isactive="true" data-placement="bottom" title="Edit User">' +
                            "InActive</a>"
                        );
                    }
                },
            },
            {
                mRender: function(data, type, row) {
                    return (
                        '<a href="#" onclick="EditUser(this)" userId="' +
                        row.UserId +
                        '" data-toggle="tooltip" data-placement="bottom" title="Edit User">' +
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

function ActiveInactiveUser(id) {
    var userId = $(id).attr("userId");
    var status = $(id).attr("isactive");
    var userType = $(id).attr("userType");
    var statusResult = "Active successfully";
    var url = baseURL + "User/ActiveUnActiveUser?UserId=" + userId + "&status=" + status + "&userType=" + userType;
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
            if (status == "false")
                statusResult = "Inactive successfully"
            Swal.fire({
                title: "Confirmation!",
                text: "User " + statusResult,
                type: "success",
                confirmButtonClass: "btn btn-primary",
                buttonsStyling: false,
                confirmButtonText: "Ok",
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
            GetAllUsers();

        },
    });
}
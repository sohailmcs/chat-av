//var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";
var useLoginId = $(".user-name").attr("UserInfo");

$(function() {
    GetAllDoctorCallLog(useLoginId);

    $(document).on("click", ".btnViewHistory", function() {
        var CallLogID = $(this).attr("callLogId");
        ViewPatientHistory(CallLogID);
    });


});

function ViewDetails(id) {
    var callLogId = $(id).attr("callLogId");
    ViewPatientHistory(callLogId);
}




function getAge() {

    var getAge = $("#hdnPatientAge").val();
    $("#popupAge").html(CalculateAge(getAge));
}

function GetAllDoctorCallLog(userId) {
    var url = baseURL + `CallLogs/GetDoctorRecentCallLog?doctorId=${userId}`;

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
            // var CallLogTemplate = $("#callLog-template").html();
            // $("#callLogId").html(Mustache.to_html(CallLogTemplate, data));
            Filldatatable(data.result);
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

function ViewPatientHistory(CallLogID) {
    var url = baseURL + `CallLogs/GetPatientHistory?callLogId=${CallLogID}`;
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
            var ViewHistoryTemplate = $("#viewPatHistory").html();
            $("#primary").html(Mustache.to_html(ViewHistoryTemplate, data));
            $("#primary").modal("show");

            // viewHistory();
        },
        error: function(xhr, textStatus, err) {
            if (xhr.status == "500" && xhr.statusText == "InternalServerError")
                console.log(xhr.statusText);
            else console.log(xhr.statusText);
        },
        complete: function(data) {
            getAge();
            // Hide Loading
            $.LoadingOverlay("hide");
        },
    });
}

function Filldatatable(data) {
    $("#tblCallLogs").DataTable({
        bAutoWidth: false,
        data: data,
        columns: [{
                visible: false,
                data: "CallLogID",
            },

            { data: "PatientID" },
            { data: "PatientName" },
            { data: "PatientPhone" },
            {
                data: "CallLogAddDateTime",

                render: function(data) {
                    var date = new Date(data);
                    var options = {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    };
                    return new Date(date).toLocaleDateString("en-US", options);
                },
            },
            { data: "OnCallDuration" },

            {
                mRender: function(data, type, row) {
                    return (
                        '<a href="#" onclick="ViewDetails(this)" callLogId="' +
                        row.CallLogID +
                        '" data-toggle="tooltip" data-placement="bottom" title="View FeedBack">' +
                        ' <i class="bx bx-show call-log-eye-btn"></i></i></a'
                    );
                },
            },
        ],
        columnDefs: [{
            targets: "_all",
            defaultContent: "",
        }, ],
        order: [
            [0, "desc"]
        ],
    });
}
//====date formater by using mustache=====
Mustache.Formatters = {
    date: function(str) {
        var options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return new Date(str).toLocaleDateString("en-US", options);
    },
    Shortdate: function(str) {
        var options = {
            year: "numeric",
            month: "short",
            day: "numeric",
        };
        return new Date(str).toLocaleDateString("en-US", options);
    },
};
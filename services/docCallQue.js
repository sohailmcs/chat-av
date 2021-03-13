//var baseURL = "https://kindahclinic.com/KindahService/";



//var baseURL = "http://localhost:1042/KindahService/";
var userLoginId = $(".user-name").attr("UserInfo");
var clientCurrentDate = new Date();
page = "CallQue";
$(function() {
    $("#txtMedication").kendoEditor({
        tools: [
            "bold",
            "italic",
            "underline",
            "strikethrough",

            "justifyLeft",
            "justifyCenter",
            "justifyRight",
            "justifyFull",
            "insertUnorderedList",
            "insertOrderedList",
            "formatBlock",
            "viewHtml",

            "print",
        ],
        // resizable: {
        //   content: false,
        //   toolbar: false,
        // },
    });

    GetCurrentTimeZone().then(function(result) {
        clientCurrentDate = result
        GetDoctorTodayCallQue(userLoginId, false);
    });




    $(document).on("click", ".btnViewDetail", function() {
        var patientId = $(this).attr("PatientId");
        callAppointmentId = $(this).attr("callreqID");
        ViewBookingDetails(patientId, callAppointmentId);
    });

    $(document).on("click", ".btnDone", function() {
        var quId = $(this).attr("CallQueId");
        var patientId = $(this).attr("patientID");
        UpdateQueAddSaveCallLog(quId, "Called", userLoginId, patientId, "CallQue");
        // GetDoctorTodayCallQue(useLoginId,true);


    });

    $(document).on("click", ".btnpopupSmsReminder", function() {
        $("#hdnPatientName").val($(this).attr("patientName"));
        $("#hdnPhone").val($(this).attr("phoneNo"));
        $("#primary").modal("show");
    });

    $(document).on("click", ".btnSendSMSReminder", function() {
        var patientName = $("#hdnPatientName").val();
        var phoneNo = $("#hdnPhone").val();
        SendSMStoPatient(phoneNo, uName, patientName);
    });
}); //end of $(function)


function getAge() {
    var getAge = $("#hdnPatientAge").val();
    $("#popupAge").html(CalculateAge(getAge));
}

function ViewBookingDetails(PatientId, callAppointmentId) {
    var url =
        baseURL + "Patient/GetPatientInitialAssisments?PatientId=" + PatientId + "&CallAppointmentId=" + callAppointmentId;
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
            //=====set values for slots templates======
            var bookDetails = $("#BookingDetail-Template").html();
            $("#bookDetails").html(Mustache.to_html(bookDetails, data));
            $("#ModelDetails").modal("show");
        },
        error: function(xhr, textStatus, err) {
            if (xhr.status == "500" && xhr.statusText == "InternalServerError")
                console.log(xhr.statusText);
            else console.log(xhr.statusText);
        },
        complete: function(data) {
            // Hide Loading
            $.LoadingOverlay("hide");
            getAge();
        },
    });
}


function GetDoctorTodayCallQue(doctorId, IsSync) {
    var url =
        baseURL +
        `CallQue/GetCallQue?doctorId=${doctorId}&date=${clientCurrentDate}`;

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
            if (!IsSync)
                $.LoadingOverlay("show");
        },
        success: function(data, textStatus, xhr) {
            var CallQueueTemplate = $("#que-template").html();
            $("#QueTemplate").html(Mustache.to_html(CallQueueTemplate, data));
        },
        error: function(xhr, textStatus, err) {
            if (xhr.status == "500" && xhr.statusText == "InternalServerError")
                console.log(xhr.statusText);
            else console.log(xhr.statusText);
        },
        complete: function(data) {
            updateClock();
            // Hide Loading
            $.LoadingOverlay("hide");
        },
    });
}

function SendSMStoPatient(mobileNo, doctorName, patientName) {
    var url =
        baseURL +
        "CallLogs/SendSMStoPatient?mobileNo=" +
        mobileNo +
        "&doctorName=" +
        doctorName +
        "&patientName=" +
        patientName +
        "&pageName=DoctorDashboard" +
        "&pageUrl=" +
        window.location.href;
    if ($("#smsReminder").val() != "")
        url = url + "&smsText=" + $("#smsReminder").val();

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
            Swal.fire({
                title: "Confirmation!",
                text: "SMS sent to patient " + patientName,
                type: "success",
                confirmButtonClass: "btn btn-primary",
                buttonsStyling: false,
                confirmButtonText: "Ok",
            }).then((result) => {
                $("#primary").modal("hide");
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

var timer;

function updateClock() {
    $(".spnWaitingTime").each(function() {
        var dtCalllQue = $(this).siblings(".hdnCallQueDate").val();

        var startDateTime = new Date(dtCalllQue); // YYYY (M-1) D H m s ms (start time and date from DB)
        var startStamp = startDateTime.getTime();

        var newDate = new Date();
        var newStamp = newDate.getTime();

        newDate = new Date();
        newStamp = newDate.getTime();
        var diff = Math.round((newStamp - startStamp) / 1000);

        var d = Math.floor(
            diff / (24 * 60 * 60)
        ); /* though I hope she won't be working for consecutive days :) */
        diff = diff - d * 24 * 60 * 60;
        var h = Math.floor(diff / (60 * 60));
        diff = diff - h * 60 * 60;
        var m = Math.floor(diff / 60);
        diff = diff - m * 60;
        var s = diff;

        $(this).text(m + " min " + s + " sec");
    });
}
timer = setInterval(updateClock, 1000);
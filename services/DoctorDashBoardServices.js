//var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";

//=========short date===============
var clientCurrentDt = new Date().toLocaleDateString("en-US");

var userLoginId = $(".user-name").attr("UserInfo");
var uName = $(".user-name").text();
page = "DashBoard";
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
        clientCurrentDt = result;
        getDashBoardAllScheduled(false);
    });


    $(document).on("click", ".btnDone", function() {
        var quId = $(this).attr("CallQueId");
        var patientId = $(this).attr("patientID");
        UpdateQueAddSaveCallLog(quId, "Called", userLoginId, patientId, "DashBoard");

        $(this).parents(".row").remove();
        getDashBoardAllScheduled(false);
    });

    //=================Update patient EMR ==============
    $(document).on("click", ".btnUpdatePrescription", function() {
        var callLogId = $(this).attr("callLogId");
        getCallLogDetils(callLogId, false);
    });
    $(document).on("click", ".btnpopupSmsReminder", function() {
        $("#hdnPatientName").val($(this).attr("patientName"));
        $("#hdnPhone").val($(this).attr("phoneNo"));
        $("#primary").modal("show");
    });
    //=================Update patient EMR ==============
    $(document).on("click", ".btnSendSMSReminder", function() {
        var patientName = $("#hdnPatientName").val();
        var phoneNo = $("#hdnPhone").val();
        SendSMStoPatient(phoneNo, uName, patientName);
    });
    //=================Complete call log  ==============
    $(document).on("click", ".btn_complateCall", function() {
        var callLogId = $(this).attr("cLogId");
        ComplatecallLog(callLogId, "Completed");
    });
    //=================open dialog to update patient EMR ==============
    $(document).on("click", "#btnSaveUpdateEMR", function() {
        var callLogId = $(this).attr("cLogId");
        updatePatientEMR(callLogId, "");
    });
    //==============show Patient initial assisment details==========
    $(document).on("click", ".btnViewDetail", function() {
        var patientId = $(this).attr("PatientId");
        callAppointmentId = $(this).attr("callreqID");
        ViewBookingDetails(patientId, callAppointmentId);
    });

    //===============Accept call ==============
    $(document).on("click", ".btnAcceptCall", function() {
        var callreqId = $(this).attr("callreqID");
        var docId = $(this).attr("docID");
        // var patientId =
        //   $(this).attr("ptype") == "Me"
        //     ? $(this).attr("PatientID")
        //     : $(this).attr("parentId");
        var PatientType = $(this).attr("pType");
        var patientId = $(this).attr("PatientID");
        var PatientName = $(this).attr("parentName");

        AcceptOrRejectCallSaveToQue(
                callreqId,
                "Accepted",
                docId,
                "Direct",
                patientId,
                PatientType
            )
            .then((data) => {
                GetAllQuedScheduled(docId, clientCurrentDt);
                GetDoctorBookedScheduled(docId, clientCurrentDt);
                toast("Patient Has Been Added in Call Queue");
                soc.emit("AcceptRejectCall", {
                    AcceptCall: true,
                    TokenNo: data.patientTokenNo,
                    waitingTime: data.waitingTime,
                    username: PatientName,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    });
    //=================get patient History ==============
    $(document).on("click", ".btnViewHistory", function() {
        var callLogId = $(this).attr("clogid");
        getCallLogDetils(callLogId, true);
    });
    //==================Reject call================
    $(document).on("click", ".btnRejectCall", function() {
        var callreqId = $(this).attr("callreqID");
        var docId = $(this).attr("docID");
        // var patientId =
        //   $(this).attr("ptype") == "Me"
        //     ? $(this).attr("PatientID")
        //     : $(this).attr("parentId");
        var PatientType = $(this).attr("pType");
        var patientId = $(this).attr("PatientID");
        var PatientName = $(this).attr("parentName");

        AcceptOrRejectCallSaveToQue(
                callreqId,
                "Reject",
                docId,
                "Direct",
                patientId,
                PatientType
            )
            .then((data) => {
                GetAllQuedScheduled(docId, clientCurrentDt);
                GetDoctorBookedScheduled(docId, clientCurrentDt, false);
                toast("Patient request has been cancelled");

                soc.emit("AcceptRejectCall", {
                    AcceptCall: false,
                    TokenNo: "",
                    username: PatientName,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    });
    //=============Accept/Add scheduled request to Que======
    $(document).on("click", ".btnAcceptSch", function() {
        var callreqId = $(this).attr("scheId");
        var docId = $(this).attr("docID");
        // var patientId =
        //   $(this).attr("ptype") == "Me"
        //     ? $(this).attr("patientId")
        //     : $(this).attr("parentId");
        var PatientType = $(this).attr("pType");
        var patientId = $(this).attr("patientId");

        AcceptOrRejectCallSaveToQue(
                callreqId,
                "Accepted",
                docId,
                "Scheduled",
                patientId,
                PatientType
            )
            .then((data) => {
                GetAllQuedScheduled(docId, clientCurrentDt);
                GetDoctorBookedScheduled(docId, clientCurrentDt, false);
                toast("Patient Has Been Added in Call Queue");
            })
            .catch((error) => {
                console.log(error);
            });
    });
    //==============set user onlne status===================
    //soc.emit("UpdateOnlineStatus", { uID: userLoginId, status: "Online" });
}); //==end of jquery $function

function getDashBoardAllScheduled(isSync) {
    GetDoctorBookedScheduled(userLoginId, clientCurrentDt, isSync);
    GetAllQuedScheduled(userLoginId, clientCurrentDt, isSync);
    GetCallLog(userLoginId, clientCurrentDt, isSync);
}

function GetDoctorBookedScheduled(DoctorId, date, isSync) {
    var url =
        baseURL +
        "Appointments/GetDoctorBookedSchedule?DoctorId=" +
        DoctorId +
        "&date=" +
        date;

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
            if (!isSync) $.LoadingOverlay("show");
        },
        success: function(data, textStatus, xhr) {
            $.LoadingOverlay("hide");
            var scheduledTemplate = $("#Scheduled-template").html();
            $("#schTemplate").html(Mustache.to_html(scheduledTemplate, data));

            var reqTemplate = $("#req-template").html();
            $("#reqTemplate").html(Mustache.to_html(reqTemplate, data));
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

function AcceptOrRejectCallSaveToQue(
    callreqId,
    status,
    docId,
    reqType,
    patientId,
    PatientType
) {
    return new Promise((resolve, reject) => {


        var url = baseURL + "PatientCallRequest/AcceptRejectPatientCallRequest";
        //======= set post model======//
        var callRequest = {
            callReQuestID: callreqId,
            status: status,
            doctorId: docId,
            requestType: reqType,
            patientId: patientId,
            PatientType: PatientType,
            currDt: clientCurrentDt,
            pageName: window.location.pathname,
            pageUrl: window.location.href,
        };
        $.ajax({
            url: url,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            type: "POST",
            datatype: "application/json",
            contentType: "application/json; charset=utf-8",
            data: callRequest,
            beforeSend: function() {
                $.LoadingOverlay("show");
            },
            success: function(data, textStatus, xhr) {
                $.LoadingOverlay("hide");
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

function GetAllQuedScheduled(doctorId, date, issync) {
    var url =
        baseURL + "CallQue/GetCallQue?doctorID=" + doctorId + "&date=" + date;
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
            if (!issync) $.LoadingOverlay("show");
        },
        success: function(data, textStatus, xhr) {
            if (!issync) $.LoadingOverlay("hide");

            var queTemplate = $("#que-template").html();
            $("#QueTemplate").html(Mustache.to_html(queTemplate, data));
        },
        error: function(xhr, textStatus, err) {
            if (xhr.status == "500" && xhr.statusText == "InternalServerError")
                console.log(xhr.statusText);
            else console.log(xhr.statusText);
        },
        complete: function(data) {
            // Hide Loading
            //======show patient waiting time in quee=========
            updateClock();
            $.LoadingOverlay("hide");
        },
    });
}

///====================== show timer for patient added in que======================
var timer;

function updateClock() {
    $(".spnWaitingTime").each(function() {
        var dtCalllQue = $(this).siblings(".hdnCallQueDate").val();

        var startDateTime = new Date(dtCalllQue); // YYYY (M-1) D H m s ms (start time and date from DB)
        var startStamp = startDateTime.getTime();

        var newDate = new Date();
        var newStamp = newDate.getTime();

        // newDate = new Date(clientCurrentDt);
        // newStamp = newDate.getTime();
        var diff = Math.round((newStamp - startStamp) / 1000);

        var d = Math.floor(diff / (24 * 60 * 60));
        diff = diff - d * 24 * 60 * 60;
        var h = Math.floor(diff / (60 * 60));
        diff = diff - h * 60 * 60;
        var m = Math.floor(diff / 60);
        diff = diff - m * 60;
        var s = diff;

        $(this).text(h + " hours " + m + " min " + s + " sec");
    });
}

//============check if there is any record in que then run clock================
timer = setInterval(updateClock, 1000);
///====================== show timer for patient added in que======================

function GetCallLog(doctorId, date, isSync) {
    var url =
        baseURL +
        "CallLogs/GetDoctorRecentCallLog?doctorID=" +
        doctorId +
        "&status=OnGoing";
    //"&date=" +    date;
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
            if (!isSync) $.LoadingOverlay("show");
        },
        success: function(data, textStatus, xhr) {
            var count = Object.keys(data).length;
            if (count > 0)
                $("#tableCallLogs").css({ height: "250px", "overflow-y": "scroll" });
            var callLogTemplate = $("#callLog-template").html();
            $("#tblCallLogs").html(Mustache.to_html(callLogTemplate, data));


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

function getCallLogDetils(callLogId, details) {
    var url = baseURL + "CallLogs/GetPatientHistory?callLogId=" + callLogId;

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

            if (details) {
                //========show only details========

                var ViewHistoryTemplate = $("#viewHistory-template").html();
                $("#popupHistory").html(Mustache.to_html(ViewHistoryTemplate, data));
                $("#popupHistory").modal("show");
            } else {
                $("#hdncallLogId").val(callLogId);
                var ViewHistoryTemplate = $("#PrescriptionEdit-template").html();
                $("#popupPrescriptionEdit").html(
                    Mustache.to_html(ViewHistoryTemplate, data)
                );
                $("#popupPrescriptionEdit").modal("show");

                //=========open dialog for update==========


            }
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

function updatePatientEMR(callLogId, status) {
    var url = baseURL + "CallLogs/UpdateCallLog";

    var model = {
        CallLogID: callLogId,
        HistoryAndExam: $("#txtExamEdit").val(),
        Allergies: $("#txtAllergiesEdit").val(),
        Diagnosis: $("#txtDiagnosisEdit").val(),
        PatientRX: $("#txtRxEdit").val(),
        callStatus: status,
    };

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
                text: "Patient EMR Updated ",
                type: "success",
                confirmButtonClass: "btn btn-primary",
                buttonsStyling: false,
                confirmButtonText: "Ok",
            }).then((result) => {
                window.location.reload();
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

function ComplatecallLog(callLogId, status) {
    var url =
        baseURL +
        "CallLogs/CompleteCallLog?callLogId=" +
        callLogId +
        "&status=" +
        status;

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
                text: "Call Complated ",
                type: "success",
                confirmButtonClass: "btn btn-primary",
                buttonsStyling: false,
                confirmButtonText: "Ok",
            }).then((result) => {
                GetCallLog(userLoginId, clientCurrentDt, false);
                // window.location.reload();
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
    Longdate: function(str) {
        var options = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hourCycle: 'h23',
            hour: "2-digit",
            minute: "2-digit"
        }
        return new Date(str).toLocaleDateString("en-US", options);
    },

    time: function(str) {
        var options = {
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(str).toLocaleTimeString("en-GB", options);
    },
};

function toast(msg) {
    $("#toastText").text(msg);
    $("#myToast").toast("show");
}

//======for automatic play sound we just need to add this code for modern===
// window.onload = function () {
//   context = new AudioContext();
// };

//==========push notification from patient
soc.on("SendNotificationToDoctor", function(data) {
    GetDoctorBookedScheduled(data.docId, clientCurrentDt, true);
    //======Play Notification sould for incomming CallRequest
    $(
        ' <audio id="NotifyAudio"><source src="/js/Services/notify.ogg" type="audio/ogg"> <source src="/js/Services/notify.mp3" type="audio/mpeg"><source src="/js/Services/notify.wav" type="audio/wav"></audio>'
    ).appendTo("body");

    $("#NotifyAudio").get(0).play();
});
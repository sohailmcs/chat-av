//var baseURL = "https://kindahclinic.com/KindahService/";



//var baseURL = "http://localhost:1042/KindahService/";
var useLoginId = $(".user-name").attr("UserInfo");
var UserName = $(".user-name").text();
var socket = io();
var options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
};
var currentDt;


//====get doctorId from querystring=======
var urlParams = new URLSearchParams(window.location.search);
var doctorId = urlParams.get("DoctorId");
//var currentDt = kendo.toString(new Date(), "d");
var appOldId = 0;
var doctName = "";
var Speciality;
var doctorId;
var walkingCustomer = false;

if (urlParams.has("name")) doctName = urlParams.get("name");
//if (urlParams.has("date")) currentDt = urlParams.get("date");
if (urlParams.has("appId")) appOldId = urlParams.get("appId");
if (urlParams.has("Speciality")) Speciality = urlParams.get("Speciality");
if (urlParams.has("doctorId")) doctorId = urlParams.get("doctorId");
if (urlParams.has("walkingCustomer"))
    walkingCustomer = urlParams.get("walkingCustomer");


function testing()

{
    $.getJSON('https://timezoneapi.io/api/timezone/?Asia/Baghdad&token=aiSVRPhzlzuAoIdUFmsO', function(data) {

        // Request OK?
        console.log(JSON.stringify(data));

    });
}



function InitCalender(currentDt) {
    $("#scheduler").kendoCalendar({
        value: new Date(currentDt),
        footer: false,
        change: function() {
            var selectedDate = kendo.toString(this.value(), "d");
            GetDoctorScheduled(doctorId, selectedDate);
        },
        disableDates: function(date) {
            var dates = new Date(currentDt);
            if (urlParams.has("date")) {
                if (date && compareDates(date, dates)) {
                    return false;
                } else {
                    return true;
                }
            } else {
                var dt = new Date();

                if (dt.getDate() > date.getDate() && dt.getMonth() >= date.getMonth())
                    return true;
                else return false;
            }
        },
    });
}

$(function() {
    GetCurrentTimeZone().then(function(result) {
        currentDt = result;
        //=======initiliaze calender======
        InitCalender(currentDt);
        //=======get selected doctor scheduled on load====
        GetDoctorScheduled(doctorId, currentDt);
    }, function(err) {
        console.log(err); // Error: "It broke"
    });


    //====================book patient appointments==========
    $(document).on("click", ".btnBookAppointment", function() {
        var appDetailID = $(this).closest("div").find(".hdnSlotId").val();
        var calendar = $("#scheduler").data("kendoCalendar");
        if (appOldId > 0) {
            var patientId = useLoginId;
            //==========Update Appointment=======
            UpdatePatientAppointment(appDetailID, appOldId, patientId)
                .then((data) => {
                    calendar.trigger("change");
                    $("#primary").modal("show");
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            //===========Book new Appointment===============

            if (walkingCustomer) {
                window.location.href =
                    "/patient/payment?doctorId=" +
                    doctorId +
                    "&name=" +
                    doctName +
                    "&Speciality=" +
                    Speciality +
                    "&type=sch" +
                    "&pId=" +
                    useLoginId +
                    "&appointmentId=" +
                    appDetailID;
            } else {
                window.location.href =
                    "/patient/Addpatient?doctorId=" +
                    doctorId +
                    "&name=" +
                    doctName +
                    "&type=sch" +
                    "&appId=" +
                    appDetailID +
                    "&Speciality=" +
                    Speciality +
                    "&walkingCustomer=false";
            }
            // BookPatientAppointment(useLoginId, appDetailID)
            //   .then((data) => {
            //     calendar.trigger("change");
            //     $("#primary").modal("show");
            //   })
            //   .catch((error) => {
            //     console.log(error);
            //   });
        }
        // //======== send notification to doctor for callRequest
        // socket.emit("NotifyDoctor", {
        //   username: doctName, // get doctorUsername from session
        //   docId: doctorId,
        // });
    });
}); //==end of jquery $function

function compareDates(date, dates) {
    if (
        dates.getDate() == date.getDate() &&
        dates.getMonth() == date.getMonth() &&
        dates.getYear() == date.getYear()
    ) {
        return true;
    }
}

//==get doctor availability/Scheduled
function GetDoctorScheduled(DoctorId, date) {
    var url =
        baseURL +
        "Appointments/GetDoctorSchedule?DoctorId=" +
        DoctorId +
        "&date=" +
        date +
        "&AppointmentStatus=Vacant";

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
            var slotTemplate = $("#slots-template").html();
            $("#AvailableSlot").html(Mustache.to_html(slotTemplate, data));

            $(".page-heading").html(
                "<h3><i class='iconapp bx bx-time-five'></i><span>" +
                doctName +
                "</span></h3>"
            );
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

//==Book patient Appointment
function BookPatientAppointment(patientId, AppointmentDetailId) {
    return new Promise((resolve, reject) => {
        var url = baseURL + "Appointments/BookPatientAppointment";

        //======= set post model
        var model = {
            AppointmentDetailId: AppointmentDetailId,
            PatientId: patientId,
            doctorId: doctorId,
            doctorName: doctName,
            PatientName: UserName,
            BookedDateTime: currentDt,
            Status: "Booked",
            PageName: "PatientAppointmentBook",
            PageURL: window.location.href,
        };

        ///==============start post request to book appointment
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

//==Book patient Appointment
function UpdatePatientAppointment(appId, OldAppId, patientId) {
    return new Promise((resolve, reject) => {
        var currentDt = new Date().toLocaleDateString("en-US", options);

        var url =
            baseURL +
            "Appointments/UpdatePatientAppointment?appId=" +
            appId +
            "&OldAppId=" +
            OldAppId +
            "&patientId=" +
            patientId +
            "&Status=Vacant" +
            "&BookedDateTime=" +
            currentDt;
        ///==============start post request to book appointment
        $.ajax({
            url: url,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            type: "POST",
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
    time: function(str) {
        var options = {
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(str).toLocaleTimeString("en-GB", options);
    },

};
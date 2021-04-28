//var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";

$(function() {
    GetAllFAQS();

}); //====end of $function

function GetAllFAQS() {
    var url = baseURL + "FAQS/GetFAQS";
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
            var FaqsList = data.FaqsList;
            Filldatatable(FaqsList);
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

function EditFAQ(id) {
    var faqId = $(id).attr("faqId");
    window.location.href = "/Admin/edit-faq?id=" + faqId;
}

function Filldatatable(data) {
    $("#tblFAQ").DataTable({
        bAutoWidth: false,
        data: data,
        columns: [{
                visible: false,
                data: "FaqID",
            },

            {
                data: "Question",
                mRender: function(data, type, row, meta) {
                    return $($.parseHTML(data)).text() // data.replace('asdfasdf', 'qqqqq');
                }
            },
            {
                data: "Answer",
                mRender: function(data, type, row, meta) {
                    return $($.parseHTML(data)).text() // data.replace('asdfasdf', 'qqqqq');
                }
            },

            {
                mRender: function(data, type, row) {
                    return (
                        '<a href="#" onclick="EditFAQ(this)" faqId="' +
                        row.FaqID +
                        '" data-toggle="tooltip" data-placement="bottom" title="Edit FAQ">' +
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
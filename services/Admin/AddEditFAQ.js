//var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";
var urlParams = new URLSearchParams(window.location.search);
var faqId = 0;
//var roleID = urlParams.get("id");
if (urlParams.has("id")) faqId = urlParams.get("id");

$(function() {
    if (faqId > 0) {
        GetFAQS(faqId);
        $("#lblFAQHeading").text("Edit FAQ");
        $("#btnSubmit").text("Update FAQ");
    } else $("#lblFAQHeading").text("Create FAQ");
    $("#frmFAQ").submit(function(e) {
        e.preventDefault();
        if (faqId > 0) EditFAQS();
        else AddFAQS();
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

    $("#txtQuestions, #txtAnswer").kendoEditor({
        encoded: false,
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
            "indent",
            "outdent",
            "createLink",
            "unlink",
            "insertImage",
            "insertFile",
            "subscript",
            "superscript",
            "tableWizard",
            "createTable",
            "addRowAbove",
            "addRowBelow",
            "addColumnLeft",
            "addColumnRight",
            "deleteRow",
            "deleteColumn",
            "viewHtml",
            "formatting",
            "cleanFormatting",
            "fontName",
            "fontSize",
            "foreColor",
            "backColor",
            "print",
            "pdf",
        ],
        pdf: {
            fileName: "TermsAndCondtions.pdf",
            proxyURL: "https://demos.telerik.com/kendo-ui/service/export",
            paperSize: "a4",
            margin: {
                bottom: 20,
                left: 20,
                right: 20,
                top: 20,
            },
        },
    });
}); //====end of $function

//== creat doctor with login
function AddFAQS() {

    var model = {
        Question: $("#txtQuestions").val(),
        Answer: $("#txtAnswer").val()
    }
    var url = baseURL + "FAQS/AddFAQ";

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
                text: "FAQ added successfully",
                type: "success",
                confirmButtonClass: "btn btn-primary",
                buttonsStyling: false,
                confirmButtonText: "<a style='color:#fff'>OK</a>",
            }).then((result) => {
                window.location.href = "/admin/all-faq";
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
//== creat doctor with login
function EditFAQS() {
    var url = baseURL + "FAQS/UpdateFaqs";
    var model = {
        FaqID: faqId,
        Question: $("#txtQuestions").val(),
        Answer: $("#txtAnswer").val()
    }

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
                text: "FAQ Edit ",
                type: "success",
                confirmButtonClass: "btn btn-primary",
                buttonsStyling: false,
                confirmButtonText: "<a style='color:#fff'>OK</a>",
            }).then((result) => {
                window.location.href = "/admin/all-faq";
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

function GetFAQS(id) {
    var url = baseURL + "FAQS/GetFAQById?FaqId=" + id;
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
            console.log(data.Faq.Question);
            $("#txtQuestions").data("kendoEditor").value(data.Faq.Question);
            $("#txtAnswer").data("kendoEditor").value(data.Faq.Answer);
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
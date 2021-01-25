//var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";
var urlParams = new URLSearchParams(window.location.search);
var KeyId = 0;
//var roleID = urlParams.get("id");
if (urlParams.has("id")) KeyId = urlParams.get("id");

$(function () {
  if (KeyId > 0) {
    GetValueAndStatus(KeyId);
    $("#txtKeyValue").prop("readonly", true);
    $("#lblHeading").text("Edit Value And Status");
    $("#btnSubmit").text("Update");
  } else $("#lblHeading").text("Update Value And Status");
  $("#frmTerms").submit(function (e) {
    e.preventDefault();
    if (KeyId > 0) EditValueAndStatus();
    else AddGetValueAndStatus();
  });
  $("#txtValueNamEn").kendoEditor({
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

  var inputValue = $(".form-input").val();
  if (inputValue == "") {
    $(".form-input").removeClass("filled");
    $(".form-input").parents(".form-group").removeClass("focused");
  } else {
    $(".form-input").addClass("filled");
    $(".form-input").parents(".form-group").addClass("focused");
  }

  //===========start animated placeholder============
  $(".form-input").focus(function () {
    $(this).parents(".form-group").addClass("focused");
  });

  $(".form-input").blur(function () {
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
function AddGetValueAndStatus() {
  var url = baseURL + "ValueAndStatus/AddValueAndStatus";
  var model = {
    ValueNameEn: $("#txtValueNamEn").value(),
    ValueNameAr: $("#txtValueNamEn").value(),
    KeyValue: $("#txtKeyValue").val(),
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
    beforeSend: function () {
      $.LoadingOverlay("show");
    },
    success: function (data, textStatus, xhr) {
      $.LoadingOverlay("hide");
      Swal.fire({
        title: "Confirmation!",
        text: "Saved Successfully ",
        type: "success",
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: false,
        confirmButtonText: "<a style='color:#fff'>OK</a>",
      }).then((resuut) => {
        window.location.href = "/admin/all-values";
      });
    },
    error: function (xhr, textStatus, err) {
      if (xhr.status == "500" && xhr.statusText == "InternalServerError")
        console.log(xhr.statusText);
      else console.log(xhr.statusText);
    },
    complete: function (data) {
      // Hide Loading
      $.LoadingOverlay("hide");
    },
  });
}
//== Edit menu
function EditValueAndStatus() {
  var url =
    baseURL +
    "ValueAndStatus/UpdateKeyAndValueStatus?KeyId=" +
    KeyId +
    "&ValueEn=" +
    $("#txtValueNamEn").data("kendoEditor").value();

  ///==============start post request to add doctor
  $.ajax({
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    type: "POST",
    datatype: "application/json",
    contentType: "application/json; charset=utf-8",
    data: "",

    beforeSend: function () {
      $.LoadingOverlay("show");
    },
    success: function (data, textStatus, xhr) {
      $.LoadingOverlay("hide");
      Swal.fire({
        title: "Confirmation!",
        text: "Updated Successfully",
        type: "success",
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: false,
        confirmButtonText: "<a style='color:#fff'>OK</a>",
      }).then((resuut) => {
        window.location.href = "/admin/all-values";
      });
    },
    error: function (xhr, textStatus, err) {
      if (xhr.status == "500" && xhr.statusText == "InternalServerError")
        console.log(xhr.statusText);
      else console.log(xhr.statusText);
    },
    complete: function (data) {
      // Hide Loading
      $.LoadingOverlay("hide");
    },
  });
}

function GetValueAndStatus(id) {
  var url = baseURL + "ValueAndStatus/GetValueAndStatusByKey?valueKey=" + id;
  $.ajax({
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    type: "GET",
    datatype: "application/json",
    contentType: "application/json; charset=utf-8",
    data: "",
    beforeSend: function () {
      $.LoadingOverlay("show");
    },
    success: function (data, textStatus, xhr) {
      $.LoadingOverlay("hide");
      $("#txtValueNamEn").data("kendoEditor").value(data.ValueNameEn);
      $("#txtKeyValue").val(data.KeyValue);
    },
    error: function (xhr, textStatus, err) {
      if (xhr.status == "500" && xhr.statusText == "InternalServerError")
        console.log(xhr.statusText);
      else console.log(xhr.statusText);
    },
    complete: function (data) {
      // Hide Loading
      $.LoadingOverlay("hide");
    },
  });
}

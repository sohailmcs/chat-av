//var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";

$(function () {
  GetAllSuggestions();
  $(".btnSendReply").on("click", function () {
    SendReply($("#hdnSuggestionId").val());
  });
}); //====end of $function

function GetAllSuggestions() {
  var url = baseURL + "PatientSuggestion/GetAllSuggestion";
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
    beforeSend: function () {
      $.LoadingOverlay("show");
    },
    success: function (data, textStatus, xhr) {
      $.LoadingOverlay("hide");
      Filldatatable(data);
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

function ShowDetails(id) {
  var suggestionId = $(id).attr("suggestionId");
  $("#hdnSuggestionId").val(suggestionId);
  GetSuggestionDetails(suggestionId);

  $("#primary").modal("show");
}

function View(id) {
  var suggestionId = $(id).attr("suggestionId");
  window.location.href = "/Admin/view-detialSuggestions?id=" + suggestionId;
}

function Filldatatable(data) {
  $("#tblSuggestion").DataTable({
    bAutoWidth: false,
    data: data,
    columns: [
      {
        visible: false,
        data: "ComplainSuggestionId",
      },

      { data: "UserId" },
      { data: "FullName" },
      { data: "PhoneNumber" },
      { data: "Status" },
      { data: "AddedDate",
      render: function(data) {
        return new Date(data).toLocaleDateString("en-us");
      } },
      { data: "ModifiedBy",
    
    },

      {
        mRender: function (data, type, row) {
          return (
            // '<a href="#" onclick="View(this)" suggestionId="' +
            // row.ComplainSuggestionId +
            // '" data-toggle="tooltip" data-placement="bottom" title="View FeedBack">' +
            // ' <i class="bx bx-detail"></i></i></a>&nbsp; &nbsp;' 
            // +
            '<a href="#" onclick="ShowDetails(this)" suggestionId="' +
            row.ComplainSuggestionId +
            '" data-toggle="tooltip" data-placement="bottom" title="Show Details">' +
            ' <i class="bx bxl-messenger"></i></i></a>'
          );
        },
      },
    ],
    columnDefs: [
      {
        targets: "_all",
        defaultContent: "",
      },
    ],
    order: [[5, "desc"]],
  });
}

function SendReply(suggestionId) {
  var url =
    baseURL +
    "PatientSuggestion/UpdateSuggestion?ComplainSuggestionId=" +
    $("#hdnSuggestionId").val() +
    "&Reply=" +
    $("#txtSuggestion").val() +
    "&modifyBy=" +
    $(".user-name").find("strong").text();

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
        text: "Reply send successfully",
        type: "success",
        confirmButtonClass: "btn btn-primary",
        buttonsStyling: false,
        confirmButtonText: "Ok",
      }).then((result) => {
        window.location.reload();
      });
    },
    error: function (xhr, textStatus, err) {
      if (xhr.status == "500" && xhr.statusText == "InternalServerError")
        console.log(xhr.statusText);
      else console.log(xhr.statusText);
    },
    complete: function (data) {
      // GetAllSuggestions();

      // Hide Loading
      $.LoadingOverlay("hide");
    },
  });
}

function GetSuggestionDetails(id) {
  var url =
    baseURL + "PatientSuggestion/GetSuggestionComplain?suggestionId=" + id;
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
      $("#txtComplain").val(data.Complain);
    },
    error: function (xhr, textStatus, err) {
      if (xhr.status == "500" && xhr.statusText == "InternalServerError")
        console.log(xhr.statusText);
      else console.log(xhr.statusText);
    },
    complete: function (data) {
      // Hide Loading
      $.LoadingOverlay("hide");

      var inputValue = $(".form-input").val();
      if (inputValue == "") {
        $(".form-input").removeClass("filled");
        $(".form-input").parents(".form-group").removeClass("focused");
      } else {
        $(".form-input").addClass("filled");
        $(".form-input").parents(".form-group").addClass("focused");
      }
    },
  });
}

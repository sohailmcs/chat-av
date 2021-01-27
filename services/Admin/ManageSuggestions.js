//var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";

$(function () {
  GetAllSuggestions();
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

      {
        mRender: function (data, type, row) {
          return (
            '<a href="#" onclick="View(this)" suggestionId="' +
            row.ComplainSuggestionId +
            '" data-toggle="tooltip" data-placement="bottom" title="View FeedBack">' +
            ' <i class="bx bx-detail"></i></i></a>'
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
    order: [[1, "asc"]],
  });
}

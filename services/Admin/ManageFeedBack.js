//var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";

$(function () {
    GetAllFeedBack();
  }); //====end of $function
  
  function GetAllFeedBack() {
    var url = baseURL + "FeedBack/GetAllFeedBack";
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
        var feedBackData = data;
        Filldatatable(feedBackData);
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
    var FeedBackId = $(id).attr("feedBackId");
    window.location.href = "/Admin/view-details?id=" + FeedBackId;
  }
  
  function Filldatatable(data) {
    $("#tblFeedBack").DataTable({
      bAutoWidth: false,
      data: data,
      columns: [
        {
          visible: false,
          data: "FeebackId",
        },
  
      
        { data: "PatientName" },
        { data: "PatientPhone" },
        { data: "PatientEmail" },
        { data: "Rating" } ,     
  
        {
          mRender: function (data, type, row) {
            return (
              '<a href="#" onclick="View(this)" feedBackId="' +
              row.FeebackId +
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
  
//var baseURL = "https://kindahclinic.com/KindahService/";
//var baseURL = "http://localhost:1042/KindahService/";

$(function () {
    GetAllFee();
  }); //====end of $function
  
  function GetAllFee() {
    var url = baseURL + "FeeStructure/GetAllFee";
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
        var feeData = data;
        Filldatatable(feeData);
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
  
  function EditFee(id) {
    var feeId = $(id).attr("feeId");
    window.location.href = "/Admin/addEdit-Fee?id=" + feeId;
  }
  
  function Filldatatable(data) {
    $("#tblFee").DataTable({
      bAutoWidth: false,
      data: data,
      columns: [
        {
          visible: false,
          data: "FeeId",
        },
  
       
        { data: "CallType" },       
        { data: "DoctorName" },
        { data: "CallDuration" },
        { data: "FeeAmount"}, 
        {
          mRender: function (data, type, row) {
            return (
              '<a href="#" onclick="EditFee(this)" feeId="' +
              row.FeeId +
              '" data-toggle="tooltip" data-placement="bottom" title="Edit Role">' +
              ' <i class="bx bxs-pencil call-log-eye-btn"></i></a>'
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
  
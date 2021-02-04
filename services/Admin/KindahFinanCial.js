$(function () {
  CreateCharts();
});

function CreateCharts() {
  var url = baseURL + "CallLogs/GetMonthtlyPatientInfo";
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
      //=======start  patient montly chart========
      var patientchart = data.MontlyPatient;
      var depChart = data.GroupDepartment;
      var doctorChart = data.GroupDoctor
      var TotalPatints = 0;
      var processed_json = new Array();
      for (i = 0; i < patientchart.length; i++) {
        TotalPatints = TotalPatints + parseInt(patientchart[i].MonthyCount);
        processed_json.push([
          patientchart[i].MonthName,
          parseInt(patientchart[i].MonthyCount),
        ]);
      }
      GetPatientWiseChart(processed_json, TotalPatints);
      //=======end patient montly chart========

      //=======start  department montly chart========
      var seriesArray = new Array();
      $.each(depChart, function (i, val) {
        var dataArray = new Array();
        $.each(val.DepartmentWiseRevenueList, function (ind, v) {
          dataArray.push(v.TotalAmount);
        });
        seriesArray.push({
          name: val.DepartmentName,
          data: dataArray,
        });
      });

      CreateDepartmentWiseCharts(seriesArray);
      //=======end  department montly chart========

       //=======start  doctor wise chart========
      var seriesArrayDoctor = new Array();
      var docName = '';
      $.each(doctorChart, function (i, val) {
        var dataArray = new Array();
         docName = val.DoctorName
        $.each(val.doctorWiseRevenueList, function (ind, v) {
          dataArray.push(v.TotalAmount);
        });

        seriesArrayDoctor.push({
          name: val.DoctorName,
          data: dataArray,
        });
      });

      CreateDoctorWiseCharts(seriesArrayDoctor);
      //=======end  doctor wise chart========


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

function GetPatientWiseChart(data, TotalPatints) {
  Highcharts.chart("PatientChart", {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false,
    },
    title: {
      text:
        '<span style="color:#647796;font-size:70px">' +
        TotalPatints +
        '</span><br><span style="color:#647796;font-size:15px">Total no of patients</span>',
      align: "center",
      verticalAlign: "middle",
      y: 70,
      useHtml: true,
    },

    credits: false,
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y}</b>",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          distance: -50,
          style: {
            fontWeight: "bold",
            color: "#647796",
          },
        },
        startAngle: -180,
        endAngle: 180,
        center: ["50%", "50%"],
        size: "100%",
      },
    },
    series: [
      {
        type: "pie",
        name: "Total patient seen",
        innerSize: "80%",
        data: data,
      },
    ],
  });
}

function CreateDepartmentWiseCharts(SeriesData) {
  Highcharts.chart("DepartmentWiseChart", {
    chart: {
      type: "column",
    },
    title: {
      text: " ",
    },
    credits: false,
    // subtitle: {
    //   text: "Source: WorldClimate.com",
    // },
    xAxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: "Revenue ( SAR )",
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y} SAR</b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: SeriesData,
  });
}

function CreateDoctorWiseCharts(SeriesData) {
  Highcharts.chart("DoctorWiseChart", {
    chart: {
      type: "column",
    },
    title: {
      text: " ",
    },
    credits: false,
    // subtitle: {
    //   text: "Source: WorldClimate.com",
    // },
    xAxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: "Revenue ( SAR )",
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y} SAR</b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: SeriesData,
  });
}
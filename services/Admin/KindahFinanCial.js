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
      // Populate series
      var TotalPatints = 0;
      var processed_json = new Array();
      for (i = 0; i < data.length; i++) {
        TotalPatints = TotalPatints + parseInt(data[i].MonthyCount);
        processed_json.push([data[i].MonthName, parseInt(data[i].MonthyCount)]);
      }
      GetPatientWiseChart(processed_json, TotalPatints);
      CreateDepartmentWiseCharts();
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
  console.log(JSON.stringify(data));
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
        size: "110%",
      },
    },
    series: [
      {
        type: "pie",
        name: "Total patient seen",
        innerSize: "80%",
        data: data,
        // [
        //   ["Chrome", 58.9],
        //   ["Firefox", 13.29],
        //   ["Internet Explorer", 13],
        //   ["Edge", 3.78],
        //   ["Safari", 3.42],
        //   {
        //     name: "Other",
        //     y: 7.61,
        //     dataLabels: {
        //       enabled: false,
        //     },
        //   },
        // ],
      },
    ],
  });
}

function CreateDepartmentWiseCharts()
{
    const chart = Highcharts.chart('DepartmentWiseChart', {
        title: {
            text: ''
        },
        subtitle: {
            text: 'Plain'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        series: [{
            type: 'column',
            colorByPoint: true,
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            showInLegend: false
        }]
    });
}

var backendDataElement = document.getElementById('backendData');
var weeklySalesDataString = backendDataElement.getAttribute('data-weekly-sales');
var weeklySalesData = JSON.parse(weeklySalesDataString);

// Calculate the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
var today = new Date().getDay();

// Create an array to represent the day numbers of the week
var dayNumbersOfWeek = [];
for (var i = 0; i < 7; i++) {
  dayNumbersOfWeek.push(i + 1);
}

// Use the dayNumbersOfWeek array for x-axis categories
var options = {
  series: [{
    name: 'series1',
    data: weeklySalesData,
  }, {
    name: 'series2',
    data: [11, 32, 45, 32, 34, 52, 41] // Replace with your data
  }],
  chart: {
    height: 350,
    type: 'area'
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  xaxis: {
    type: 'category',
    categories: dayNumbersOfWeek // Use the modified dayNumbersOfWeek array
  },
  tooltip: {
    x: {
      format: 'dd/MM/yy HH:mm'
    },
  },
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

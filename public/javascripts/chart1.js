const backendDataElement = document.getElementById("backendData");
const weeklySalesData = backendDataElement.getAttribute("data-weekly-sales");
const dailyOrdersData = backendDataElement.getAttribute("data-daily-orderss");
const dailyOrdersDatas = dailyOrdersData.split(",");
const weeklySalesArray = weeklySalesData.split(",");
const dailyData = dailyOrdersDatas.map(value => parseInt(value, 10));
const weeklySalesIntegers = weeklySalesArray.map(value => parseInt(value, 10));
console.log(weeklySalesIntegers);

// Calculate the dates for the last seven days
const dayLabels = [];
const currentDate = new Date();
for (let i = 6; i >= 0; i--) {
  const date = new Date(currentDate);
  date.setDate(currentDate.getDate() - i);
  dayLabels.push(date.toLocaleDateString()); // Format the date as you like
}

// Your chart options
var options = {
  series: [{
    name: 'daily Sales',
    type: 'column',
    data: weeklySalesIntegers,
  }, {
    name: 'Daily Orders',
    type: 'line',
    data: dailyData
  }],
  chart: {
    height: 350,
    type: 'line',
  },
  stroke: {
    width: [0, 4]
  },
  title: {
    text: 'Sales Graph'
  },
  dataLabels: {
    enabled: true,
    enabledOnSeries: [1]
  },
  labels: dayLabels,
  xaxis: {
    type: 'Daily Sales',
  },
  yaxis: [{
    title: {
      text: 'Daily Sales',
    },
  }, {
    opposite: true,
    title: {
      text: 'Daily Orders'
    }
  }]
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

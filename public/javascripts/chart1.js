document.addEventListener("DOMContentLoaded", function() {
    var ctx = document.getElementById('lineChart').getContext('2d');
    var backendDataElement = document.getElementById('backendData');
    var totalProducts = parseInt(backendDataElement.getAttribute('data-total-products'));
    var totalOrders = parseInt(backendDataElement.getAttribute('data-total-orders'));
    var totalSalesValue = parseFloat(backendDataElement.getAttribute('data-total-sales'));
    var todaysOrdersValue = parseInt(backendDataElement.getAttribute('data-todays-orders'));

    var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var today = new Date().getDay();
    var adjustedDaysOfWeek = daysOfWeek.slice(today).concat(daysOfWeek.slice(0, today));


    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: adjustedDaysOfWeek,
            datasets: [
                {
                    label: 'Total Products',
                    data: [totalProducts, 0, 0, 0, 0, 0, 0],
                    borderColor: 'rgb(41, 155, 99)',
                    borderWidth: 1,
                    fill: false
                },
                {
                    label: 'Total Sales ($)',
                    data: [totalSalesValue, 0, 0, 0, 0, 0, 0], 
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 1,
                    fill: false
                },
                {
                    label: "Today's Orders",
                    data: [todaysOrdersValue, 0, 0, 0, 0, 0, 0], 
                    borderColor: 'rgb(255, 205, 86)',
                    borderWidth: 1,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true
        }
    });

    myChart.data.datasets[0].label += ` (${totalProducts} Total Orders)`;
    myChart.data.datasets[1].label += ` ($${totalSalesValue} Total Sales)`;
    myChart.data.datasets[2].label += ` (${todaysOrdersValue} Today's Orders)`;

    myChart.update();
});

document.addEventListener("DOMContentLoaded", function() {
    var ctx = document.getElementById('lineChart').getContext('2d');
    
    // Sample data for daily and weekly earnings
    var dailyEarnings = [100, 150, 200, 120, 180, 210, 90];
    var weeklyEarnings = [800, 1000, 1200, 900, 1100, 1300, 950];
    
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Daily Earnings in $',
                    data: dailyEarnings,
                    backgroundColor: 'rgba(85, 85, 85, 0.2)',
                    borderColor: 'rgb(41, 155, 99)',
                    borderWidth: 1
                },
                {
                    label: 'Weekly Earnings in $',
                    data: weeklyEarnings,
                    backgroundColor: 'rgba(85, 85, 85, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true
        }
    });
});
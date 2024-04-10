document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('bedtimeChart').getContext('2d');

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2024-03-01', '2024-03-02', '2024-03-03'],
            datasets: [{
                label: 'Mock Data',
                data: [8, 5, 3],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                }
            }
        }
    });
});
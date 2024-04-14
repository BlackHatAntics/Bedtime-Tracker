document.addEventListener('DOMContentLoaded', () => {
    const graphData = JSON.parse(document.getElementById('graphData').textContent);
    const ctx = document.getElementById('bedtimeChart').getContext('2d');
    chart = new Chart(ctx, {
      type: 'line',
      data: graphData,
      options: {
        maintainAspectRatio: false,
        // aspectRatio: 100 / 65,
        tooltips: {
          callbacks: {
            title: function(tooltipItem, data) {
              // Assuming your labels array contains date strings
              return moment(data.labels[tooltipItem[0].index]).format('MMM DD, YYYY');
            },
            label: function(tooltipItem, data) {
              const label = data.datasets[tooltipItem.datasetIndex].label || '';
              const value = tooltipItem.yLabel;
              const hours = Math.floor(value) % 24; // Convert back from 24-35 range if needed
              const minutes = Math.round((value - Math.floor(value)) * 60);
              return `${label}: ${hours}:${minutes.toString().padStart(2, '0')}`;
            }
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
                parser: 'YYYY-MM-DD',
                unit: 'day',
                displayFormats: {
                  day: 'MMM DD' // or 'MMM DD' for testing
                }
            }
          },
          y: {
            beginAtZero: false,
            min: 12, // 1 lower so you can see it?
            max: 36, // 1 higher so you can see it
            ticks: {
              stepSize: 1,
              callback: function(value, index, values) {
  
                // Convert 24-35 back to 0-11 and format as AM
                if (value >= 24) {
                  return `${value - 24}`;
                } else {
                  return /*value === 12 ? '12 PM' : */`${value}`;
                }
              },
              afterBuildTicks: scale => {
                // scale.min -= 3;
                // scale.max -= 3;
              }
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: function(tooltipItems) {
                return moment(tooltipItems[0].label).format('MMM DD, YYYY');
              },
              label: function(context) {
                const label = context.dataset.label || '';
                const rawValue = context.parsed.y;
                let hours = Math.floor(rawValue);
                const minutes = Math.round((rawValue - hours) * 60);
                
                // Adjust for AM/PM format
                let amPm = 'AM';
                if (hours > 24) { // Convert back from 24-35 range if needed
                  hours -= 24;
                } else if (hours >= 12) {
                  amPm = 'PM';
                  if (hours > 12) hours -= 12;
                }
                if (hours === 0) hours = 12; // Adjust for midnight
                
                const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')} ${amPm}`;
                return `${label}: ${formattedTime}`;
              }
            }
          },
          legend: {
            display: false
          }
        }
      }
    });
    window.addEventListener('resize', function() {
      chart.resize();
    });
  });
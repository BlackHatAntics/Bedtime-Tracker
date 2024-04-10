document.addEventListener('DOMContentLoaded', () => {  
  const graphData = JSON.parse(document.getElementById('graphData').textContent);
  const ctx = document.getElementById('bedtimeChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: graphData,
    options: {
      maintainAspectRatio: true,
      aspectRatio: 100 / 65,
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
                day: 'DD' // or 'MMM DD' for testing
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

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

let currentMonthIndex = 0;

const monthSpan = document.getElementById('month');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');

function updateMonth() {
  monthSpan.textContent = months[currentMonthIndex];
}

prevMonthButton.addEventListener('click', () => {
  currentMonthIndex = (currentMonthIndex - 1 + months.length) % months.length;
  updateMonth();
});

nextMonthButton.addEventListener('click', () => {
  currentMonthIndex = (currentMonthIndex + 1) % months.length;
  updateMonth();
});

document.addEventListener('DOMContentLoaded', (event) => {
  updateMonth();
});

function toggleNote(event) {
  event.stopPropagation(); // Stop the event from bubbling up
  const noteSpan = event.target.closest('.entry').querySelector('.note');
  const entryContent = event.target.closest('.entry').querySelector('.entry-content');
  const isExpanded = noteSpan.classList.contains('expanded');
  if (isExpanded) {
      // Collapse: Return to the original state
      noteSpan.style.whiteSpace = "nowrap";
      noteSpan.style.overflow = "hidden";
      noteSpan.style.textOverflow = "ellipsis";
      entryContent.style.flexDirection = "row";
      entryContent.style.alignItems = "center";
      noteSpan.classList.remove('expanded');
  } else {
      // Expand: Allow it to wrap
      noteSpan.style.whiteSpace = "normal";
      noteSpan.style.overflow = "visible";
      noteSpan.style.textOverflow = "clip";
      entryContent.style.flexDirection = "column";
      entryContent.style.alignItems = "stretch";
      noteSpan.classList.add('expanded');
  }
}
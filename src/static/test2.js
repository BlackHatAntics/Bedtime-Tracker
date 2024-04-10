//this is the original script.js when trying to implement chart.js
document.addEventListener('DOMContentLoaded', () => {  
    const graphData = JSON.parse(document.getElementById('graphData').textContent);
    const ctx = document.getElementById('bedtimeChart').getContext('2d');
    new Chart(ctx, {
      type: 'line', 
      data: graphData,
      options: {
          scales: {
              x: {
                  type: 'time',
                  time: {
                      parser: 'YYYY-MM-DD',
                      unit: 'day',
                      displayFormats: {
                          day: 'MMM DD'
                      }
                  },
                  title: {
                      display: true,
                      text: 'Date'
                  }
              },
              y: {
                  title: {
                      display: true,
                      text: 'Hour of the Day'
                  },
                  min: 0,
                  max: 24,
                  ticks: {
                      // Ensure we have ticks for every hour
                      stepSize: 1,
                      callback: function(val, index) {
                          // Format ticks to show in AM/PM format
                          return index % 24 + ":00";
                      }
                  }
              }
          },
          plugins: {
              legend: {
                  display: true
              }
          }
      }
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
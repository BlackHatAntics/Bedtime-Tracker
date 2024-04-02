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


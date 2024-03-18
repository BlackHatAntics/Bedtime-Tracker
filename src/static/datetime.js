// document.addEventListener('DOMContentLoaded', function() {
//     const params = new URLSearchParams(window.location.search);
//     const dateParam = params.get('day'); // 'today', 'yesterday', or 'other'

//     // Function to set the date based on the parameter
//     function setDateBasedOnParam(dateParam) {
//         const dateInput = document.getElementById('dateInput'); // Assuming you have an input for dates
//         const datePicker = document.getElementById('datePicker'); // Assuming this is your date picker element
//         const today = new Date();
//         let selectedDate;

//         switch (dateParam) {
//             case 'today':
//                 selectedDate = today;
//                 break;
//             case 'yesterday':
//                 selectedDate = new Date(today.setDate(today.getDate() - 1));
//                 break;
//             case 'other':
//                 if (datePicker) {
//                     datePicker.style.display = 'block'; // Or any logic to open/show the date picker
//                 }
//                 return; // Exit the function as we don't need to set a specific date
//             default:
//                 return; // In case no valid parameter was provided
//         }

//         if (dateInput) {
//             dateInput.value = selectedDate.toISOString().split('T')[0]; // Set the date input to the selected date
//         }
//     }

//     setDateBasedOnParam(dateParam);
// });
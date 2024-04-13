document.addEventListener('DOMContentLoaded', function () {
  var now = new Date();
  today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  var setDateTo = now.getHours() < 12 ? yesterday : today;

  const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  const existingTime = document.getElementById('timepickerInput').value;
  const tp = new tempusDominus.TempusDominus(document.getElementById('timepicker'), {
    display: {
      viewMode: 'clock',
      inline: true,
      theme: 'light',
      components: {
        decades: false,
        year: false,
        month: false,
        date: false,
        hours: true,
        minutes: true,
        seconds: false
      }
    }//,
    //localization: { //is this even doing anything?
    //  format: 'h:mm t'
    //}
  });
  // Set initial value based on existing data or current time
  if (existingTime) {
    const parsedDate = tp.dates.parseInput(moment(existingTime, 'H:mm').toDate());
    tp.dates.setValue(parsedDate);
    document.getElementById('timepickerInput').value = moment(parsedDate).format('HH:mm');
  } else {
    document.getElementById('timepickerInput').value = formatTime(now);
  }

  tp.subscribe(tempusDominus.Namespace.events.change, (e) => {
    document.getElementById('timepickerInput').value = e.date.format('H:mm');
  });
  
  new tempusDominus.TempusDominus(document.getElementById('datepicker'), {
    defaultDate: setDateTo,
    display: {
      viewMode: 'calendar',
      inline: false,
      //useTwentyfourHour: undefined,
      theme: 'light',
      keepOpen: false,
      components: {
        decades: false,
        year: true,
        month: true,
        date: true,
        hours: false,
        minutes: false,
        seconds: false
      }
    },
    restrictions: {
      maxDate: today
    },
    localization: {
      format: 'MMM/dd/yyyy'
    }
  });

  //checkbox logic
  const initialCheckbox = document.getElementById('timeCheckbox');
  const container = document.getElementById('row1');

  function addAdditionalInput() {
    const div = document.createElement('div');
    div.className = 'additional-input-div';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control';
    input.id = 'additionalTimepickerInput';

    // Copy value from the original input to the new one
    const originalInputValue = document.getElementById('timepickerInput').value;
    input.value = originalInputValue;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true; // New checkbox starts checked
    checkbox.addEventListener('change', () => {
      if (!checkbox.checked) {
        div.remove(); // Remove the div if its checkbox is unchecked
      } else {
        addAdditionalInput(); // Add a new input if re-checked
      }
    });

    div.appendChild(input);
    div.appendChild(checkbox);
    container.appendChild(div);
  }

  // Listen for changes on the initial checkbox to add additional input
  initialCheckbox.addEventListener('change', function() {
    if (this.checked) {
      addAdditionalInput();
    }
    // Uncheck the original checkbox after adding a new input field
    this.checked = false;
  });


  //Note logic
  const noteTextarea = document.getElementById('note');
  const charCountDiv = document.getElementById('charCount');
  const maxLength = noteTextarea.getAttribute('maxlength');

  function updateCharCount() {
      const currentLength = noteTextarea.value.length;
      const remainingChars = maxLength - currentLength;
      charCountDiv.textContent = `${currentLength}/${maxLength}`;

      if (remainingChars > 20) {
          charCountDiv.style.color = 'grey';
      } else if (remainingChars <= 20 && remainingChars > 0) {
          charCountDiv.style.color = '#CA8A04';
      } else {
          charCountDiv.style.color = 'red';
      }
  }

  updateCharCount();

  noteTextarea.addEventListener('input', updateCharCount);
});

//submit button
document.getElementById('bedtimeForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  let formProps = Object.fromEntries(formData);
  formProps.entry_date = moment(formProps.entry_date, 'MMM/DD/YYYY').format('YYYY-MM-DD');

  const additionalTimes = Array.from(document.querySelectorAll('.additionalTimepickerInput')).map(input => input.value);
  formProps.additionalTimes = additionalTimes;

  //Use these if you want to have both PUT and POST. But rn I'm only using POST
  // const endpoint = formProps.entryId ? `/update-bedtime/${formProps.entryId}` : '/submit-bedtime';
  // const method = formProps.entryId ? 'PUT' : 'POST';
  //And use these if you are only going to use POST:
  const endpoint = '/submit-bedtime';
  const method = 'POST';

  fetch(endpoint, {
    method: method,
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(formProps),
  })
   .then(response => response.json()) //re-enable after testing
  .then(data => {
      console.log('Success:', data);
      // Redirect or show a success message
  })
  .catch((error) => {
      console.error('Error:', error);
      // Handle errors here
  });
});
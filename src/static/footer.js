// const plusButton = document.getElementById('plus-button');

document.addEventListener('DOMContentLoaded', function () {
    const plusButton = document.getElementById('plus-button');
    const popupContainer = document.getElementById('popup-container');
    const buttons = document.querySelectorAll('#popup-container .but');
    const but1 = document.getElementById('but-1');
    const but2 = document.getElementById('but-2');
    const but3 = document.getElementById('but-3');

    const adjustButtonHeight = () => {
      buttons.forEach(button => {
          const width = button.offsetWidth; // Get the current computed width
          button.style.height = width + 'px'; // Set the height equal to the width
      });
  };

    plusButton.addEventListener('click', function() {
      if (popupContainer.style.display == 'none') {
        // If buttons are not visible, show them
        popupContainer.style.display = 'flex'; // Make the popup container visible
        adjustButtonHeight();
      } else {
        // If buttons are visible, hide them
        popupContainer.style.display = 'none';
      }
    });

  });



  // document.addEventListener('DOMContentLoaded', function () {
  //   const plusButton = document.getElementById('plus-button');
  //   const popupContainer = document.getElementById('popup-container');
  //   let buttonsVisible = false; // Track the visibility of the buttons

  //   plusButton.addEventListener('click', function() {
  //     if (!buttonsVisible) {
  //       // If buttons are not visible, show them
  //       for (let i = 1; i <= 3; i++) {
  //         const newButton = document.createElement('button');
  //         newButton.innerText = `Button ${i}`;
  //         newButton.className = 'col-2 btn';
  //         popupContainer.appendChild(newButton);
  //       }
  //       popupContainer.style.display = 'flex'; // Make the popup container visible
  //       buttonsVisible = true; // Update the visibility tracker
  //     } else {
  //       // If buttons are visible, hide them
  //       popupContainer.style.display = 'none';
  //       buttonsVisible = false; // Update the visibility tracker
  //       popupContainer.innerHTML = ''; // Clear previous buttons
  //     }
  //   });
  // });
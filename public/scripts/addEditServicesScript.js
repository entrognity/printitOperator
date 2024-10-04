// // Handle disabling services
// document.getElementById('serviceDropdown').addEventListener('change', function() {
//     const selectedService = this.value;
//     const div_individualBWPerPage = document.getElementById('div_individualBWPerPage');
//     const div_individualColorPerPage = document.getElementById('div_individualColorPerPage');
//     const div_spiralBinding = document.getElementById('div_spiralBinding');

//     // Hide all inputs by default
//     div_individualBWPerPage.style.display = 'none';
//     div_individualColorPerPage.style.display = 'none';
//     div_spiralBinding.style.display = 'none';

//     // Show the input based on the selected service
//     if (selectedService === "1") { // Compare against actual service ID
//         div_individualBWPerPage.style.display = 'block';
//         div_individualColorPerPage.style.display = 'block';
//     } else if (selectedService === "2") {
//         div_spiralBinding.style.display = 'block';
//     }
// });




// this works IIFE

(function () {
    const serviceFieldMap = {
        '1': ['div_individualBWPerPage', 'div_individualColorPerPage'],
        '2': ['div_spiralBinding'],
        // Add other mappings as needed
    };

    const serviceDropdown = document.getElementById('serviceDropdown');
    const priceInputs = document.getElementById('priceInputs');

    serviceDropdown.addEventListener('change', function () {
        // Hide all input fields initially
        const allInputDivs = priceInputs.querySelectorAll('div');
        allInputDivs.forEach(div => div.style.display = 'none');

        // Get the selected service ID
        const selectedServiceId = serviceDropdown.value;

        // Show only the relevant inputs for the selected service
        if (serviceFieldMap[selectedServiceId]) {
            serviceFieldMap[selectedServiceId].forEach(fieldId => {
                document.getElementById(fieldId).style.display = 'block';
            });
        }
    });

    document.getElementById('addEditServicesForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const form = event.target;
        const prices = {};

        // Loop through all input fields and append only visible ones to prices object
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            const parentDiv = input.parentElement;
            if (window.getComputedStyle(parentDiv).display !== 'none') {
                if (input.value <= 1 || !(input.value)) {
                    // alert("Enter the prices properly");
                    return;
                }                
                prices[input.name] = input.value; // Add the input's name and value to prices object
            }

        });

        // Also append the selected account ID
        prices['accountID'] = 'acc1';

        console.log(prices);

        try {
            const response = await fetch('/api/v1/services/addEditServices/updatePrices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Specify JSON content
                },
                body: JSON.stringify(prices) // Convert prices object to JSON string
            });

            if (response.ok) {
                alert('Prices saved successfully');
                loadPage('addEditServices');
            } else {
                alert('Failed to save prices.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while saving prices.');
        }
    });
})();






// this works

// serviceDropdown.addEventListener('change', function () {

//     let serviceFieldMap = {
//         '1': ['div_individualBWPerPage', 'div_individualColorPerPage'],
//         '2': ['div_spiralBinding'],
//         // Add other mappings as needed
//     };
    
//     const serviceDropdown = document.getElementById('serviceDropdown');
//     const priceInputs = document.getElementById('priceInputs');
//     // Hide all input fields initially
//     const allInputDivs = priceInputs.querySelectorAll('div');
//     allInputDivs.forEach(div => div.style.display = 'none');

//     // Get the selected service ID
//     const selectedServiceId = serviceDropdown.value;

//     // Show only the relevant inputs for the selected service
//     if (serviceFieldMap[selectedServiceId]) {
//         serviceFieldMap[selectedServiceId].forEach(fieldId => {
//             document.getElementById(fieldId).style.display = 'block';
//         });
//     }
// });

// document.getElementById('addEditServicesForm').addEventListener('submit', async function (event) {
//     event.preventDefault();

//     const form = event.target;
//     const prices = {};

//     // Loop through all input fields and append only visible ones to prices object
//     const inputs = form.querySelectorAll('input');
//     inputs.forEach(input => {
//         const parentDiv = input.parentElement;
//         if (window.getComputedStyle(parentDiv).display !== 'none') {
//             prices[input.name] = input.value; // Add the input's name and value to prices object
//         }
//     });

//     // Also append the selected account ID
//     prices['accountID'] = 'acc1';

//     console.log(prices);

//     try {
//         const response = await fetch('/api/v1/services/addEditServices/updatePrices', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json', // Specify JSON content
//             },
//             body: JSON.stringify(prices) // Convert prices object to JSON string
//         });

//         if (response.ok) {
//             alert('Prices saved successfully');
//             loadPage('addEditServices');
//         } else {
//             alert('Failed to save prices.');
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         alert('An error occurred while saving prices.');
//     }
// });

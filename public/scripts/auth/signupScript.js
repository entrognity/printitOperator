document.getElementById('signupForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission

    let isValid = true;
    let firstErrorElement = null; // Variable to keep track of the first element with an error

    // Full Name validation
    const fullName = document.getElementById('fullName').value;
    const fullNameError = document.getElementById('fullNameError');
    if (fullName.length < 5) {
        fullNameError.textContent = 'Full Name must be at least 5 characters long.';
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('fullName'); // Set first error element
    } else {
        fullNameError.textContent = ''; // Clear error
    }

    // Shop Name validation
    const shopName = document.getElementById('shopName').value;
    const shopNameError = document.getElementById('shopNameError');
    if (shopName.length < 5) {
        shopNameError.textContent = 'Shop Name must be at least 5 characters long.';
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('shopName'); // Set first error element
    } else {
        shopNameError.textContent = ''; // Clear error
    }

    // Password validation
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const passwordError = document.getElementById('passwordError');

    if (password !== confirmPassword) {
        passwordError.textContent = 'Passwords do not match.';
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('password'); // Set first error element
    } else {
        passwordError.textContent = ''; // Clear error
    }

    // If there are validation errors, scroll to the first error element
    if (!isValid) {
        if (firstErrorElement) {
            firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Scroll to the first error element
            firstErrorElement.focus(); // Optionally focus the element as well
        }
        return; // Stop form submission if there are validation errors
    }

    // Process form submission if no validation errors
    const form = event.target;
    const signupFormData = {};

    // Loop through all input fields and append their values to signupFormData object
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        signupFormData[input.id] = input.value; // Use 'name' instead of 'id'
    });

    // console.log(signupFormData); // Log the form data to the console

    try {
        const response = await fetch('/api/v1/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specify JSON content
            },
            body: JSON.stringify(signupFormData) // Correct variable name
        });

        if (response.ok) {
            form.reset(); // Optionally reset the form

            // Show the modal
            const modal = new bootstrap.Modal(document.getElementById('signupSuccessModal'));
            modal.show();

            // close modal after 5 sec
            setTimeout(function () {
                modal.hide() 
            }, 5000);


        } else {
            const errorResponse = await response.json();
            alert(errorResponse.message || 'Failed to signup.');
        }
    } catch (error) {
        console.error('Error:', error); // Log error
        alert('An error occurred during signup. Please try again later.');
    }
});


// Function to get location using Geolocation API
document.getElementById("getLocationBtn").addEventListener("click", function () {
    const loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.style.display = 'inline'; // Show loading message

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError, {
            timeout: 10000 // Set timeout for location retrieval
        });
    } else {
        alert("Geolocation is not supported by this browser.");
        loadingMessage.style.display = 'none'; // Hide loading message
    }
});

// Function to handle successful location retrieval
function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Generate Google Maps URL using latitude and longitude
    const googleMapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;

    // Populate the gmapUrl input field
    document.getElementById("gmapUrl").value = googleMapsUrl;

    alert("Location retrieved successfully.");
    
    // Hide loading message
    document.getElementById('loadingMessage').style.display = 'none';
}

// Function to handle any errors in Geolocation API
function showError(error) {
    // Hide loading message
    document.getElementById('loadingMessage').style.display = 'none';

    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

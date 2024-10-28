document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission
    const form = event.target;

    let isValid = true;
    const opEmail = document.getElementById('email').value;
    const opPassword = document.getElementById('password').value;
    const loginFormData = {
        email: opEmail,
        password: opPassword
    };

    // console.log(loginFormData); // Log the form data to the console

    try {
        const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specify JSON content
            },
            body: JSON.stringify(loginFormData) // Correct variable name
        });

        if (response.ok) {
            form.reset(); // Optionally reset the form
            window.location.href = '/api/v1/orders'; // Redirect immediately to login page
        } else {
            const errorResponse = await response.json();
            alert(errorResponse.message || 'Failed to Login.');
        }
    } catch (error) {
        console.error('Error:', error); // Log error
        alert('An error occurred during login. Please try again later.');
    }
});
document.getElementById('forgotPasswordForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission
    const email = document.getElementById('forgotEmail').value;

    try {
        const response = await fetch('/api/v1/auth/forgotPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            alert('Reset link sent to your email. Please check your inbox.');
            window.location.href = '/api/v1/auth/login'; // Redirect back to login
        } else {
            const errorResponse = await response.json();
            alert(errorResponse.message || 'Failed to send reset link.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
});

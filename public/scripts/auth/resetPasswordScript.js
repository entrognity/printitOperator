document.getElementById('resetPasswordForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Get the reset token from the URL
    const token = window.location.pathname.split('resetPassword/')[1];
    if (!token) {
        alert('Invalid or missing token.');
        return;
    }

    if (newPassword !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    try {
        const response = await fetch(`/api/v1/auth/resetPassword/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newPassword })
        });

        if (response.ok) {
            alert('Password reset successfully. You can now log in with your new password.');
            window.location.href = '/api/v1/auth/login'; // Redirect to login page
        } else {
            const errorResponse = await response.json();
            alert(errorResponse.message || 'Failed to reset password.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
});

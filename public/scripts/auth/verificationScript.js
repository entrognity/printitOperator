document.getElementById('loginNowBtn').addEventListener('click', async (event) => {
    redirectToLogin();
});

function redirectToLogin() {
    window.location.href = '/api/v1/auth/login';  // Replace '/login' with your actual login route
}
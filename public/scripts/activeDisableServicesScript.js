// Handle disabling services
document.getElementById('disable-services-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const servicesToDisable = Array.from(document.querySelectorAll('input[name="servicesToDisable"]:checked'))
        .map(input => input.value);

    if (servicesToDisable.length === 0) {
        alert('Please select at least one service to disable.');
        return;
    }

    try {
        const response = await fetch('/api/v1/services/activeDisableServices/updateStatus', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ servicesToDisable }),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Services disabled successfully!');
            // window.location.reload(); // Reload to reflect the changes
            loadPage('activeDisableServices');
        } else {
            alert(`Failed to disable services: ${result.error}`);
        }
    } catch (error) {
        console.error('Error disabling services:', error);
        alert('An error occurred while disabling services.');
    }
});

// Handle activating services
document.getElementById('activate-services-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const servicesToActivate = Array.from(document.querySelectorAll('input[name="servicesToActivate"]:checked'))
        .map(input => input.value);

    if (servicesToActivate.length === 0) {
        alert('Please select at least one service to activate.');
        return;
    }

    try {
        const response = await fetch('/api/v1/services/activeDisableServices/updateStatus', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ servicesToActivate }),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Services activated successfully!');
            // window.location.reload(); // Reload to reflect the changes
            loadPage('activeDisableServices');
        } else {
            alert(`Failed to activate services: ${result.error}`);
        }
    } catch (error) {
        console.error('Error activating services:', error);
        alert('An error occurred while activating services.');
    }
});

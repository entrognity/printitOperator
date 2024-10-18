document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('activeDisableServicesBtn').addEventListener('click', async function (event) {
        loadPage('activeDisableServices');
    });

    document.getElementById('addEditServicesBtn').addEventListener('click', async function (event) {
        loadPage('addEditServices');
    });

    document.getElementById('allServicesBtn').addEventListener('click', async function (event) {
        loadPage('allServices');
    });
});


// Function to load the selected page content dynamically
function loadPage(pageUrl) {
    fetch(`/api/v1/services/${pageUrl}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load page content');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('content').innerHTML = data;

            // After loading content, dynamically load the script for activeDisableServices if needed
            if (pageUrl === 'activeDisableServices') {
                // loadActiveDisableServicesScript();  
                loadScriptDynamically('activeDisableServicesScript.js'); // Call function to load the script
            }
            else if (pageUrl === 'addEditServices') {
                loadScriptDynamically('addEditServicesScript.js');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('content').innerHTML = '<h1>Page not found</h1>';
        });
}

// Function to dynamically load the activeDisableServicesScript.js
function loadScriptDynamically(scriptName) {
    const script = document.createElement('script');
    script.src = `/scripts/${scriptName}`;  // Path to your script
    script.onerror = () => console.error(`Failed to load ${scriptName}`);
    document.body.appendChild(script);  // Append the script to the body
}






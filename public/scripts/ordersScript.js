// document.addEventListener('DOMContentLoaded', function () {
//     console.log("DOM fully loaded and parsed");

//     // Attach event listeners to the buttons
//     document.querySelectorAll('.process-btn').forEach(button => {
//         button.addEventListener('click', function () {
//             const row = this.closest('tr');
//             row.style.backgroundColor = 'green';
//         });
//     });

//     document.querySelectorAll('.done-btn').forEach(button => {
//         button.addEventListener('click', function () {
//             const row = this.closest('tr');
//             row.style.backgroundColor = 'blue';
//         });
//     });

//     document.querySelectorAll('.cancel-btn').forEach(button => {
//         button.addEventListener('click', function () {
//             const row = this.closest('tr');
//             row.style.backgroundColor = 'red';
//         });
//     });
// });






// $(document).ready(function() {
//     loadPage('ordersTable');
    
//     $('#searchBtn').click(function() {
//         filterOrders();
//     });

//     $('#clrBtn').click(function() {
//         window.location.href = '/api/v1/orders';
//     });
// });


// // Function to load the selected page content dynamically
// function loadPage(pageUrl) {
//     fetch(`/api/v1/orders/${pageUrl}`)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Failed to load page content');
//             }
//             return response.text();
//         })
//         .then(data => {
//             document.getElementById('ordersTableContainer').innerHTML = data;
//             loadScriptDynamically('ordersTableScript.js');
//             colorRows();
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             document.getElementById('ordersTableContainer').innerHTML = '<h1>Data not found</h1>';
//         });
// }

// const colorRows = () => {
//     $('#ordersTable tbody tr').each(function() {
//         // Get the orderStatus from the current row
//         const orderStatus = $(this).data('orderStatus'); // Access the data attribute

//         // Change background color based on orderStatus
//         if (orderStatus === 'requested') {
//             $(this).find('td').addClass('blink'); // Add blink class for requested
//         } else if (orderStatus === 'processing') {
//             $(this).closest('tr').find('td').css('background-color', '#88beff'); // Light blue for processing
//         } else if (orderStatus === 'completed') {
//             $(this).find('td').css('background-color', '#9fff88'); // Light green for in completed
//         } else if (orderStatus === 'rejected') {
//             $(this).closest('tr').find('td').css('background-color', '#ff9d88'); // Light red for cancelled
//         } else {
//             $(this).closest('tr').find('td').css('background-color', ''); // Reset to default if status is unknown
//         }
//     });
// };


// // Function to handle search and filter
// function filterOrders() {
//     const orderIDInp = document.getElementById('orderID').value.trim();
//     const serviceIDInp = document.getElementById('serviceIDInp').value;
//     const fromDate = document.getElementById('fromDate').value;
//     const toDate = document.getElementById('toDate').value;
//     const sortBy = document.getElementById('sortBy').value;
//     const sortOrder = document.getElementById('sortOrder').value;

//     let errorMessage = '';
//     if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
//         errorMessage += 'From Date cannot be later than To Date.\n';
//     }
//     if (errorMessage) {
//         alert(errorMessage);
//         return;
//     }

//     // Construct the query string based on filter inputs
//     let queryString = '?';
//     if(orderIDInp){
//         queryString += `orderID=${orderIDInp}&`;
//     }
//     if(serviceIDInp){
//         queryString += `serviceID=${serviceIDInp}&`;
//     }
//     if (fromDate) {
//         queryString += `fromDate=${fromDate}&`;
//     }
//     if (toDate) {
//         queryString += `toDate=${toDate}&`;
//     }
//     if (sortBy) {
//         queryString += `sortBy=${sortBy}&`;
//     }
//     if (sortOrder) {
//         queryString += `sortOrder=${sortOrder}`;
//     }

//     console.log(queryString);
//     if(queryString=='?'){
//         return window.location.href = '/api/v1/orders';
//     }

//     // Redirect to the same page with the query string
//     loadPage(`ordersTable${queryString}`);
//     // window.location.href = '/api/v1/orders/ordersTable' + queryString;
// }


// // Function to dynamically load the activeDisableServicesScript.js
// function loadScriptDynamically(scriptName) {
//     const script = document.createElement('script');
//     script.src = `/scripts/${scriptName}`;  // Path to your script
//     script.onerror = () => console.error(`Failed to load ${scriptName}`);
//     document.body.appendChild(script);  // Append the script to the body
// }






$(document).ready(function() {
    // Call the initialization function separately
    init();

    // Event listener for search button
    $('#searchBtn').click(function() {
        filterOrders();
    });

    // Event listener for clear button
    $('#clrBtn').click(function() {
        window.location.href = '/api/v1/orders';
    });
});

// Separate async function for initialization
async function init() {
    try {
        await loadPage('ordersTable');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

// Function to load the selected page content dynamically
async function loadPage(pageUrl) {
    try {
        const response = await fetch(`/api/v1/orders/${pageUrl}`);
        if (!response.ok) {
            throw new Error('Failed to load page content');
        }
        const data = await response.text();
        document.getElementById('ordersTableContainer').innerHTML = data;

        // ------------------------------
        await loadDynamicScript('ordersTableScript.js');
        colorRows();
        // ------------------------------

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('ordersTableContainer').innerHTML = '<h1>Data not found</h1>';
    }
}

// Function to dynamically load the specified script
function loadDynamicScript(scriptName) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `/scripts/${scriptName}`;  // Path to your script
        script.onload = () => resolve();
        script.onerror = () => {
            console.error(`Failed to load ${scriptName}`);
            reject(new Error(`Failed to load ${scriptName}`));
        };
        document.body.appendChild(script);  // Append the script to the body
    });
}

// Function to color the rows based on order status
const colorRows = () => {
    $('#ordersTable tbody tr').each(function() {
        // Get the orderStatus from the current row
        const orderStatus = $(this).data('order-status'); // Access the data attribute

        // Change background color based on orderStatus
        if (orderStatus === 'requested') {
            $(this).find('td').addClass('blink'); // Add blink class for requested
            $(this).find('.processBtn, .rejectedBtn').show();
            // $(this).find('.rejectedBtn').show();
            $(this).find('.completedBtn').hide();
        } else if (orderStatus === 'processing') {
            $(this).closest('tr').find('td').css('background-color', '#88beff'); // Light blue for processing
            $(this).find('.completedBtn').show();
            $(this).find('.processBtn, .rejectedBtn').hide();
        } else if (orderStatus === 'completed') {
            $(this).find('td').css('background-color', '#9fff88'); // Light green for completed
            $(this).find('.processBtn, .completedBtn, .rejectedBtn').hide();
        } else if (orderStatus === 'rejected') {
            $(this).closest('tr').find('td').css('background-color', '#ff9d88'); // Light red for rejected
            $(this).find('.processBtn, .completedBtn, .rejectedBtn').hide();
        } else {
            $(this).closest('tr').find('td').css('background-color', ''); // Reset to default if status is unknown
        }
    });
};





// Function to open the order detail Popup 
function showOrderDetail(orderId) {
    // Send AJAX request to get order details
    fetch(`/api/v1/orders/orderDetail/${orderId}`)
        .then(response => response.text())
        .then(data => {
            // Populate modal with order details
            document.getElementById('orderDetails').innerHTML = data;

            // Show the modal
            document.getElementById('orderDetailModal').style.display = 'block';
        })
        .catch(err => {
            alert('Error fetching order details');
            console.error(err);
        });
}

// async function showOrderDetail(orderID) {
//     try {
//         const response = await fetch(`/api/v1/orders/orderDetail/${orderID}`);
//         if (!response.ok) {
//             throw new Error('Failed to load page content');
//         }
//         const data = await response.text();

//         // Populate modal with order details
//         document.getElementById('orderDetails').innerHTML = data;

//         // Show the modal
//         document.getElementById('orderModal').style.display = 'block';

//     } catch (error) {
//         alert('Error fetching order details');
//         console.error(err);
//     }
// }

// Close the modal
function closeModal() {
    document.getElementById('orderDetailModal').style.display = 'none';
}

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
    const modal = document.getElementById('orderDetailModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}






// Function to handle search and filter
async function filterOrders() {
    const orderIDInp = document.getElementById('orderID').value.trim();
    const serviceIDInp = document.getElementById('serviceIDInp').value;
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;
    const sortBy = document.getElementById('sortBy').value;
    const sortOrder = document.getElementById('sortOrder').value;

    let errorMessage = '';
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
        errorMessage += 'From Date cannot be later than To Date.\n';
    }
    if (errorMessage) {
        alert(errorMessage);
        return;
    }

    // Construct the query string based on filter inputs
    let queryString = '?';
    if (orderIDInp) {
        queryString += `orderID=${orderIDInp}&`;
    }
    if (serviceIDInp) {
        queryString += `serviceID=${serviceIDInp}&`;
    }
    if (fromDate) {
        queryString += `fromDate=${fromDate}&`;
    }
    if (toDate) {
        queryString += `toDate=${toDate}&`;
    }
    if (sortBy) {
        queryString += `sortBy=${sortBy}&`;
    }
    if (sortOrder) {
        queryString += `sortOrder=${sortOrder}`;
    }

    console.log(queryString);
    if (queryString === '?') {
        return window.location.href = '/api/v1/orders';
    }

    // Load the page and dynamically load the script, then color the rows
    try {
        await loadPage(`ordersTable${queryString}`);
        await loadDynamicScript('ordersTableScript.js');
        colorRows();
    } catch (error) {
        console.error('Error during filtering:', error);
    }
}


const updateStatus = async (orderId, status) => {
    const data = {};
    data.orderID = orderId;
    data.status = status;
    try {
        const response = await fetch('/api/v1/orders/ordersTable/updateStatus', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Specify JSON content
            },
            body: JSON.stringify(data) // Convert prices object to JSON string
        });

        if (response.ok) {
            loadPage('ordersTable');
        } else {
            alert('Failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating.');
    }
}
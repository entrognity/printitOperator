// // Event delegation for dynamic rows
// // Handle the 'Process' button click
// $('#ordersTable').on('click', '.processBtn', function () {
//     let orderID = $(this).data('id');
//     let callBeforePrint = $(this).data('cbp');

//     if (callBeforePrint == 'Yes' && !confirm(`Did you call the customer before printing for order ${orderID}?`)) {
//         return; // Exit if confirmation not provided
//     }
    
//     if (confirm(`Processing order with ID ${orderID}`)) {
        

//         // Update the background color and stop blinking
//         $(this).closest('tr').find('td').removeClass('blink');
//         $(this).closest('tr').find('td').css('background-color', '#88beff'); // Light blue for processing

//         // Show/Hide the appropriate buttons
//         $(this).hide(); // Hide 'Process' button
//         $(this).siblings('.rejectedBtn').hide(); // Hide 'Reject' button
//         $(this).siblings('.completedBtn').show(); // Show 'Complete' button

//         updateStatus(orderID, 'processing');
//     }
// });

// // Handle the 'Complete' button click
// $('#ordersTable').on('click', '.completedBtn', function () {
//     let orderID = $(this).data('id');
//     if (confirm(`Marking order with ID ${orderID} as done`)) {
       

//         // Update the background color to green for completed
//         $(this).closest('tr').find('td').css('background-color', '#9fff88'); // Light green for completed
//         // Show/Hide the appropriate buttons
//         $(this).hide(); // Hide 'Complete' button

//         updateStatus(orderID, 'completed');
//     }
// });

// // Handle the 'Reject' button click
// $('#ordersTable').on('click', '.rejectedBtn', function () {
//     let orderID = $(this).data('id');
//     if (confirm(`Cancelling order with ID ${orderID}`)) {
        

//         // Update the background color to red for rejected and stop blinking
//         $(this).closest('tr').find('td').removeClass('blink');
//         $(this).closest('tr').css('background-color', '#ff9d88'); // Light red for rejected

//         // Hide all buttons after rejection
//         $(this).hide(); // Hide 'Reject' button
//         $(this).siblings('.processBtn, .completedBtn').hide(); // Hide 'Process' and 'Complete' buttons

//         updateStatus(orderID, 'rejected');
//     }
// });





// // Helper function to update status and styling
// function updateOrderStyle(orderID, status, color) {
//     const rows = getOrderRows(orderID);
//     rows.attr('data-order-status', status);
//     rows.find('td').removeClass('blink');
//     rows.find('td').css('background-color', color);
// }

// // Helper function to manage button visibility
// function updateButtons(buttonElement, action) {
//     const buttonRow = buttonElement.closest('tr');
//     switch(action) {
//         case 'process':
//             buttonElement.hide();
//             buttonRow.find('.rejectedBtn').hide();
//             buttonRow.find('.completedBtn').show();
//             break;
//         case 'complete':
//             buttonRow.find('.completedBtn').hide();
//             break;
//         case 'reject':
//             buttonRow.find('.processBtn, .completedBtn, .rejectedBtn').hide();
//             break;
//     }
// }

// // Process button click handler
// $('#ordersTable').on('click', '.processBtn', function() {
//     const orderID = $(this).data('id');
//     const callBeforePrint = $(this).closest('tr').find('td:nth-child(9)').text().trim() === 'Yes';

//     if (callBeforePrint && !confirm(`Did you call the customer before printing for order ${orderID}?`)) {
//         return;
//     }

//     if (confirm(`Processing order with ID ${orderID}`)) {
//         updateOrderStyle(orderID, 'processing', '#88beff'); // Light blue
//         updateButtons($(this), 'process');
//         updateStatus(orderID, 'processing');
//     }
// });

// // Complete button click handler
// $('#ordersTable').on('click', '.completedBtn', function() {
//     const orderID = $(this).data('id');
    
//     if (confirm(`Marking order with ID ${orderID} as done`)) {
        
//         updateOrderStyle(orderID, 'completed', '#9fff88'); // Light green
//         updateButtons($(this), 'complete');
//         updateStatus(orderID, 'completed');
//     }
// });

// // Reject button click handler
// $('#ordersTable').on('click', '.rejectedBtn', function() {
//     const orderID = $(this).data('id');
    
//     if (confirm(`Cancelling order with ID ${orderID}`)) {
       
//         updateOrderStyle(orderID, 'rejected', '#ff9d88'); // Light red
//         updateButtons($(this), 'reject');
//         updateStatus(orderID, 'rejected');
//     }
// });




















// Function to get all rows belonging to an order
function getAllOrderRows(orderID) {
    // Find the row containing the orderID
    const firstRow = $(`#ordersTable td:contains('${orderID}')`).closest('tr');
    
    // Get the rowspan value
    const rowspan = parseInt(firstRow.find('td:first-child').attr('rowspan'));
    
    // Get all rows for this order (including the first row and subsequent rows)
    const orderRows = firstRow.add(firstRow.nextAll().slice(0, rowspan - 1));
    
    return orderRows;
}

// Handle the 'Process' button click
$('#ordersTable').on('click', '.processBtn', function() {
    const orderID = $(this).data('id');
    const callBeforePrint = $(this).data('cbp');

    if (callBeforePrint === 'Yes' && !confirm(`Did you call the customer before printing for order ${orderID}?`)) {
        return;
    }
    
    if (confirm(`Processing order with ID ${orderID}`)) {
        const orderRows = getAllOrderRows(orderID);
        
        // Update all cells in all rows for this order
        orderRows.each(function() {
            $(this).find('td').css('background-color', '#88beff').removeClass('blink');
        });

        // Update button visibility
        $(this).hide()
               .siblings('.rejectedBtn').hide()
               .siblings('.completedBtn').show();

        updateStatus(orderID, 'processing');
    }
});

// Handle the 'Complete' button click
$('#ordersTable').on('click', '.completedBtn', function() {
    const orderID = $(this).data('id');
    
    if (confirm(`Marking order with ID ${orderID} as done`)) {
        const orderRows = getAllOrderRows(orderID);
        
        // Update all cells in all rows for this order
        orderRows.each(function() {
            $(this).find('td').css('background-color', '#9fff88');
        });

        // Update button visibility
        $(this).hide();

        updateStatus(orderID, 'completed');
    }
});

// Handle the 'Reject' button click
$('#ordersTable').on('click', '.rejectedBtn', function() {
    const orderID = $(this).data('id');
    
    if (confirm(`Cancelling order with ID ${orderID}`)) {
        const orderRows = getAllOrderRows(orderID);
        
        // Update all cells in all rows for this order
        orderRows.each(function() {
            $(this).find('td').css('background-color', '#ff9d88').removeClass('blink');
        });

        // Hide all buttons
        $(this).hide()
               .siblings('.processBtn, .completedBtn').hide();

        updateStatus(orderID, 'rejected');
    }
});

// Event delegation for dynamic rows
// Handle the 'Process' button click
$('#ordersTable').on('click', '.processBtn', function () {

    // call before print, did you call

    let orderID = $(this).data('id');
    if (confirm(`Processing order with ID ${orderID}`)) {
        updateStatus(orderID, 'processing');

        // Update the background color and stop blinking
        $(this).closest('tr').find('td').removeClass('blink');
        $(this).closest('tr').find('td').css('background-color', '#88beff'); // Light blue for processing

        // Show/Hide the appropriate buttons
        $(this).hide(); // Hide 'Process' button
        $(this).siblings('.rejectedBtn').hide(); // Hide 'Reject' button
        $(this).siblings('.completedBtn').show(); // Show 'Complete' button
    }
});

// Handle the 'Complete' button click
$('#ordersTable').on('click', '.completedBtn', function () {
    let orderID = $(this).data('id');
    if (confirm(`Marking order with ID ${orderID} as done`)) {
        updateStatus(orderID, 'completed');

        // Update the background color to green for completed
        $(this).closest('tr').find('td').css('background-color', '#9fff88'); // Light green for completed
        // Show/Hide the appropriate buttons
        $(this).hide(); // Hide 'Complete' button
    }
});

// Handle the 'Reject' button click
$('#ordersTable').on('click', '.rejectedBtn', function () {
    let orderID = $(this).data('id');
    if (confirm(`Cancelling order with ID ${orderID}`)) {
        updateStatus(orderID, 'rejected');

        // Update the background color to red for rejected and stop blinking
        $(this).closest('tr').find('td').removeClass('blink');
        $(this).closest('tr').find('td').css('background-color', '#ff9d88'); // Light red for rejected

        // Hide all buttons after rejection
        $(this).hide(); // Hide 'Reject' button
        $(this).siblings('.processBtn, .completedBtn').hide(); // Hide 'Process' and 'Complete' buttons
    }
});


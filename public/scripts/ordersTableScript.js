
// Event delegation for dynamic rows
$('#ordersTable').on('click', '.process-btn', function () {
    let orderID = $(this).data('id');
    processOrder(orderID);
    $(this).closest('tr').find('td').css('background-color', '#88beff');
});

$('#ordersTable').on('click', '.done-btn', function () {
    let orderID = $(this).data('id');
    $(this).closest('tr').find('td').css('background-color', '#9fff88');
    markDone(orderID);
});

$('#ordersTable').on('click', '.cancel-btn', function () {
    let orderID = $(this).data('id');
    $(this).closest('tr').find('td').css('background-color', '#ff9d88');
    cancelOrder(orderID);
});

function processOrder(orderId) {
    confirm(`Processing order with ID ${orderId}`);
    // Further processing logic can be implemented here
}

function markDone(orderId) {
    confirm(`Marking order with ID ${orderId} as done`);
    // Further done logic can be implemented here
}

function cancelOrder(orderId) {
    confirm(`Cancelling order with ID ${orderId}`);
    // Further cancel logic can be implemented here
}


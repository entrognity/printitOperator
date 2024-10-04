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

$(document).ready(function() {
    $('.process-btn').click(function() {
        $(this).closest('tr').css('background-color', '#88beff ');
        //processOrder($(this).data('id'));
    });

    $('.done-btn').click(function() {
        $(this).closest('tr').css('background-color', '#9fff88');
        //markDone($(this).data('id'));
    });

    $('.cancel-btn').click(function() {
        $(this).closest('tr').css('background-color', '#ff9d88');
        //cancelOrder($(this).data('id'));
    });
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

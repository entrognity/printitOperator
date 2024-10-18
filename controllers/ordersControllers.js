const Orders = require('../models/ordersModel');
const { Services } = require('../models/servicesModel');
const { Users } = require('../models/userModel');
const idGeneration = require('../utils/idGeneration');


exports.getOrders = async (req, res) => {
    try {
        // get services to populate the select service dropdown in filter
        const services = await Services.find().sort('serviceID');
        res.render('orders/orders', { services });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err
        });
    }
};


exports.getOrdersTable = async (req, res) => {
    try {

        const queryS = {};
        const sortOptions = {};

        // get operatorID -- CHECK FOR ANY POSSIBILITY or KEEP DOUBLE VALIDATION  
        // if(req.query.operatorID){
        //     queryS.operatorID = req.query.operatorID;
        // }else{
        //     return res.status(400).json({ error: 'Operator ID Not Found' });
        // }

        // Handle orderID filtering
        if(req.query.orderID){
            queryS.orderID = req.query.orderID;
        }

        // Handle serviceID filtering
        if (req.query.serviceID) {
            queryS.serviceID = parseInt(req.query.serviceID);
        }

        // Handle date range filter
        if (req.query.fromDate || req.query.toDate) {
            let dateFilter = {};
            const fromDate = req.query.fromDate ? new Date(req.query.fromDate) : new Date(0);
            const toDate = req.query.toDate ? new Date(`${req.query.toDate}T23:59:59.999Z`) : new Date();

            if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
                return res.status(400).json({ error: 'Invalid date format' });
            }

            if (fromDate > toDate) {
                return res.status(400).json({ error: 'From Date cannot be later than To Date' });
            }

            dateFilter.$gte = fromDate;
            dateFilter.$lte = toDate;
            queryS.createdAt = dateFilter;
        }

        // Handle sorting logic
        if (req.query.sortBy) {
            const sortBy = req.query.sortBy.split(',');
            sortBy.forEach(field => {
                if (['orderAmount', 'orderID'].includes(field)) {
                    sortOptions[field] = req.query.sortOrder === 'desc' ? -1 : 1;
                }
            });
        }
        // Default sort by creation date if not provided
        sortOptions.createdAt = -1;

        // Aggregation with $lookup and $match for filtering
        const allOrders = await Orders.aggregate([
            { $match: queryS },
            {
                $lookup: {
                    from: 'services',
                    localField: 'serviceID',
                    foreignField: 'serviceID',
                    as: 'serviceDetails'
                }
            },
            { $unwind: '$serviceDetails' },
            {
                $project: {
                    _id: 1,
                    orderID: 1,
                    serviceID: 1,
                    serviceName: '$serviceDetails.serviceName',
                    filesUri: 1,
                    pages: 1,
                    note: 1,
                    callBeforePrint: 1,
                    orderAmount: 1,
                    paymentStatus: 1,
                    orderStatus: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            },
            { $sort: sortOptions }
        ]);

        // const services = await Services.find().sort('serviceID');

        res.render('orders/ordersTable.ejs', { allOrders });

        // Respond based on request type
        // if (req.headers['content-type'] === 'text/html') {
        //     return res.render('orders/orders.ejs', { allOrders });
        // }

        // res.status(200).json({
        //     status: 'success',
        //     results: allOrders.length,
        //     data: { allOrders }
        // });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err
        });
    }
};

exports.getOrder = async (req, res) => {
    try {
        const allOrders = await Orders.find({ orderID: req.params.id });

        res.render('orders/ordersTable', { allOrders });

        // res.status(200).json({
        //     status: 'success',
        //     results: allOrders.length,
        //     data: { allOrders }
        // });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err
        });
    }
};

exports.getOrderDetailPopup = async (req, res) => {
    try{
        // get the orderID
        const orderID = req.params.id;

        // Aggregation with $lookup and $match for filtering
        const orderDetail = await Orders.aggregate([
            { $match: {orderID: orderID} },
            {
                $lookup: {
                    from: 'services',
                    localField: 'serviceID',
                    foreignField: 'serviceID',
                    as: 'serviceDetails'
                }
            },
            { $unwind: '$serviceDetails' },
            {
                $project: {
                    _id: 1,
                    userID: 1,
                    operatorID: 1,
                    orderID: 1,
                    serviceID: 1,
                    serviceName: '$serviceDetails.serviceName',
                    filesUri: 1,
                    pages: 1,
                    note: 1,
                    callBeforePrint: 1,
                    orderAmount: 1,
                    paymentStatus: 1,
                    orderStatus: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);

        // Check if orderDetail exists
        if (!orderDetail || orderDetail.length === 0) {
            return res.status(404).json({
                status: 'failed',
                message: 'Order not found'
            });
        }

        // Get the userID from the orderDetail
        const userID = orderDetail[0].userID;
        // Get the customer name
        const customer = await Users.findOne({ userMobNumber: userID }).select('userName');
        // Add customerName to orderDetail
        orderDetail[0].customerName = customer ? customer.userName : null;

        // render the popup
        res.render('orders/orderDetailPopup.ejs', { orderDetail });

        // Respond with order details
        // res.status(200).json({
        //     status: 'success',
        //     data: { orderDetail: orderDetail[0] } // Return the first element of the array
        // });

    } catch(err) {
        res.status(400).send({
            tatus: 'failed',
            message: err
        });
    }
}

exports.updateStatus = async (req, res) => {
    try{
        const {orderID, status} = req.body;
        const updateStatus = await Orders.findOneAndUpdate(
            {orderID: orderID}, 
            {$set: {orderStatus: status}},
            {new: true}
        );

        res.status(200).json({
            status: 'success',
            data: { updateStatus }
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err
        });
    }
};


// sanitize the data

exports.createOrder = async (req, res) => {
    try {
        const newOrder = await Orders.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                order: newOrder
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err
        });
    }
};


// only for dev, del while deploying

exports.createOrders = async (req, res) => {
    try {
        const newOrder = await Orders.insertMany(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                order: newOrder
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err
        });
    }
};
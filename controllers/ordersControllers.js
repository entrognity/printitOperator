const { Orders, OrderArticles } = require('../models/ordersModel');
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

        // console.log(req.user);

        const queryS = {};
        const sortOptions = {};

        // get operatorID -- CHECK FOR ANY POSSIBILITY or KEEP DOUBLE VALIDATION  
        // if(req.query.operatorID){
        //     queryS.operatorID = req.query.operatorID;
        // }else{
        //     return res.status(400).json({ error: 'Operator ID Not Found' });
        // }

        // Handle orderID filtering
        if (req.query.orderID) {
            queryS.orderID = req.query.orderID;
        }

        // Handle serviceID filtering
        // if (req.query.serviceID) {
        //     queryS.articles.serviceID = parseInt(req.query.serviceID);
        // }

        // Handle orderStatus filtering
        if (req.query.orderStatus) {
            queryS.orderStatus = req.query.orderStatus;
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

        // this works (v1)
        // const allOrders = await Orders.aggregate([
        //     // Initial match to filter orders
        //     { 
        //         $match: queryS 
        //     },
            
        //     // First lookup to get articles
        //     {
        //         $lookup: {
        //             from: 'orderarticles',
        //             localField: 'articleIDs',
        //             foreignField: 'articleID',
        //             as: 'articles'
        //         }
        //     },
            
        //     // Unwind the articles array to work with individual articles
        //     {
        //         $unwind: {
        //             path: '$articles',
        //             preserveNullAndEmptyArrays: true
        //         }
        //     },
            
        //     // Optional serviceID filter
        //     ...(req.query.serviceID ? [{
        //         $match: {
        //             'articles.serviceID': parseInt(req.query.serviceID)
        //         }
        //     }] : []),
            
        //     // Lookup services for each article
        //     {
        //         $lookup: {
        //             from: 'services',
        //             let: { serviceId: '$articles.serviceID' },
        //             pipeline: [
        //                 {
        //                     $match: {
        //                         $expr: { $eq: ['$serviceID', '$$serviceId'] }
        //                     }
        //                 }
        //             ],
        //             as: 'articleService'
        //         }
        //     },
            
        //     // Add serviceName to each article
        //     {
        //         $addFields: {
        //             'articles.serviceName': {
        //                 $ifNull: [
        //                     { $arrayElemAt: ['$articleService.serviceName', 0] },
        //                     'Unknown Service'
        //                 ]
        //             }
        //         }
        //     },
            
        //     // Clean up by removing the temporary articleService array
        //     {
        //         $project: {
        //             articleService: 0
        //         }
        //     },
            
        //     // Group back to reform the orders with updated articles
        //     {
        //         $group: {
        //             _id: '$_id',
        //             orderID: { $first: '$orderID' },
        //             customerID: { $first: '$customerID' },
        //             orderStatus: { $first: '$orderStatus' },
        //             orderAmount: { $first: '$orderAmount' },
        //             callBeforePrint: { $first: '$callBeforePrint' },
        //             createdAt: { $first: '$createdAt' },
        //             articles: {
        //                 $push: {
        //                     articleID: '$articles.articleID',
        //                     serviceID: '$articles.serviceID',
        //                     serviceName: '$articles.serviceName',  // Now correctly mapped
        //                     noOfPages: '$articles.noOfPages',
        //                     noOfCopies: '$articles.noOfCopies',
        //                     printColor: '$articles.printColor',
        //                     printSides: '$articles.printSides',
        //                     note: '$articles.note',
        //                     filesUri: '$articles.filesUri',
        //                     createdAt: '$articles.createdAt'
        //                 }
        //             }
        //         }
        //     },
            
        //     // Sort articles within each order
        //     {
        //         $addFields: {
        //             articles: {
        //                 $sortArray: {
        //                     input: '$articles',
        //                     sortBy: { createdAt: 1 }
        //                 }
        //             }
        //         }
        //     },
            
        //     // Final sort of orders
        //     { 
        //         $sort: sortOptions 
        //     }
        // ]);

        // this also works (v2) slightly efficient, readable
        const allOrders = await Orders.aggregate([
            // Initial match to filter orders early
            { 
                $match: queryS 
            },
            
            // Single lookup for articles with service filtering built in
            {
                $lookup: {
                    from: 'orderarticles',
                    let: { articleIds: '$articleIDs' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ['$articleID', '$$articleIds'] },
                                ...(req.query.serviceID ? { serviceID: parseInt(req.query.serviceID) } : {})
                            }
                        },
                        // Include service lookup within the articles pipeline
                        {
                            $lookup: {
                                from: 'services',
                                localField: 'serviceID',
                                foreignField: 'serviceID',
                                as: 'service'
                            }
                        },
                        // Project only needed fields and map service name
                        {
                            $project: {
                                articleID: 1,
                                serviceID: 1,
                                serviceName: {
                                    $ifNull: [
                                        { $arrayElemAt: ['$service.serviceName', 0] },
                                        'Unknown Service'
                                    ]
                                },
                                noOfPages: 1,
                                noOfCopies: 1,
                                printColor: 1,
                                printSides: 1,
                                note: 1,
                                filesUri: 1,
                                createdAt: 1
                            }
                        },
                        // Sort articles by createdAt within the lookup
                        { $sort: { createdAt: 1 } }
                    ],
                    as: 'articles'
                }
            },
            
            // Project final order structure
            {
                $project: {
                    orderID: 1,
                    orderStatus: 1,
                    orderAmount: 1,
                    callBeforePrint: 1,
                    createdAt: 1,
                    articles: 1
                }
            },
            
            // Final sort of orders
            { 
                $sort: sortOptions 
            }
        ]);


        // console.log(allOrders);

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
    try {
        // get the orderID
        const orderID = req.params.id;

        const orderDetail = await Orders.aggregate([
            // Initial match to filter orders early
            { 
                $match: {orderID: orderID} 
            },
            
            // Single lookup for articles with service filtering built in
            {
                $lookup: {
                    from: 'orderarticles',
                    let: { articleIds: '$articleIDs' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ['$articleID', '$$articleIds'] },
                            }
                        },
                        // Include service lookup within the articles pipeline
                        {
                            $lookup: {
                                from: 'services',
                                localField: 'serviceID',
                                foreignField: 'serviceID',
                                as: 'service'
                            }
                        },
                        {
                            $addFields: {
                                serviceName: {$ifNull: [
                                    { $arrayElemAt: ['$service.serviceName', 0] },
                                    'Unknown Service'
                                ]},
                                oprTemplate: { $arrayElemAt: ['$service.oprTemplate', 0] }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                articleID: 0,
                                serviceID: 0,
                                __v: 0,
                                createdAt: 0,
                                updatedAt: 0,
                                service: 0
                            }
                        },
                        // // Project only needed fields and map service name
                        // {
                        //     $project: { 
                        //         serviceName: {
                        //             $ifNull: [
                        //                 { $arrayElemAt: ['$service.serviceName', 0] },
                        //                 'Unknown Service'
                        //             ]
                        //         },
                        //     }
                        // },
                        // Sort articles by createdAt within the lookup
                        { $sort: { createdAt: 1 } }
                    ],
                    as: 'articles'
                }
            },
            
            // Project final order structure
            {
                $project: {
                    _id: 0,
                    userID: 1,
                    orderID: 1,
                    noOfServices: 1,
                    orderStatus: 1,
                    orderAmount: 1,
                    callBeforePrint: 1,
                    deliveryOption: 1,
                    paymentStatus: 1,
                    createdAt: 1,
                    articles: 1
                }
            }
        ]);

        // console.log(orderDetail)
        // res.json(orderDetail);





        // const orderDetail = await Orders.find({orderID: orderID});

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

        // // Respond with order details
        // res.status(200).json({
        //     status: 'success',
        //     data: { orderDetail: orderDetail[0] } // Return the first element of the array
        // });

    } catch (err) {
        console.log(err)
        res.status(400).send({
            tatus: 'failed',
            message: err
        });
    }
}

exports.updateStatus = async (req, res) => {
    try {
        const { orderID, status } = req.body;

        // Find the order to check its current status
        const order = await Orders.findOne({ orderID: orderID });

        // If the order does not exist, return a 404 error
        if (!order) {
            return res.status(404).json({
                status: 'failed',
                message: 'Order not found'
            });
        }

        // Check current status and apply business logic
        if (order.orderStatus === 'processing' && status === 'rejected') {
            return res.status(400).json({
                status: 'failed',
                message: 'Cannot reject after order is Accepted'
            });
        }

        if (order.orderStatus === 'rejected' && status === 'processing') {
            return res.status(400).json({
                status: 'failed',
                message: 'Cannot Accept after order is Rejected'
            });
        }

        const updateStatus = await Orders.findOneAndUpdate(
            { orderID: orderID },
            { $set: { orderStatus: status } },
            { new: true }
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


exports.createArticles = async (req, res) => {
    try {
        const newArticles = await OrderArticles.insertMany(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                articles: newArticles
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err
        });
    }
};
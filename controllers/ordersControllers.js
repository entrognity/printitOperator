const Orders = require('../models/ordersModel');
const Services = require('../models/servicesModel')

exports.getAllOrders = async (req, res) => {
    try {
        // EXECUTE QUERY
        // const features = new APIFeatures(Tour.find(), req.query)
        //     .filter()
        //     .sort()
        //     .limitFields()
        //     .paginate();


        // const allOrders = await Orders.find({});
        // console.log(allOrders);

        const allOrders = await Orders.aggregate([
            {
                $lookup: {
                    from: 'services', // The collection name in MongoDB (usually pluralized by Mongoose)
                    localField: 'serviceID', // Field from Orders
                    foreignField: 'serviceID', // Field from Services
                    as: 'serviceDetails' // The name of the field that will hold the joined documents
                }
            },
            {
                $unwind: '$serviceDetails' // Unwind to deconstruct the array of serviceDetails
            },
            {
                $project: {
                    _id: 1,
                    orderID: 1,
                    serviceID: 1,
                    serviceName: '$serviceDetails.serviceName', // Include serviceName from Services
                    filesUri: 1,
                    pages: 1,
                    note: 1,
                    callBeforePrint: 1,
                    deliveryOption: 1,
                    orderAmount: 1,
                    paymentStatus: 1,
                    orderStatus: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    __v: 1
                }
            }
        ]);
        console.log(allOrders);
         
        // Object.assign(obj, { newProperty: "value" });

        res.render('orders/orders.ejs', { allOrders });

        // // Check if SSR is needed based on some condition (e.g., query param or header)
        // if (req.headers['content-type'] === 'text/html') {
        //     // SSR (Server-Side Rendering)
        //     return res.render('orders', { allOrders });
        // }

        // Otherwise, send JSON response
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
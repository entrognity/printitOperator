const path = require('path');
const { Services, ServicesPrices, ServicesTrackings } = require('../models/servicesModel');
const { getDate } = require('../utils/dateaAndTime');

const getAllServicesSorted = async (attr) => {
    return await Services.find().sort(attr);
};

exports.getServices = async (req, res) => {
    // try {
    //     // res.sendFile(path.join(__dirname, 'public', 'index.html')); //not working
    //     // res.sendFile(path.join(__dirname, 'views', 'services/services.html')); //not working
    //     res.sendFile(path.join(__dirname, '../views/services/services.html'));
    // } catch (err) {
    //     res.status(404).json({
    //         status: 'failed',
    //         message: err
    //     });
    // }
    res.sendFile(path.join(__dirname, '../views/services/services.html'));
};

exports.allServices = async (req, res) => {
    try {
        // Fetch all services from the MongoDB database
        const allServices = await Services.find().sort('serviceID');

        // or
        // let query = Services.find();
        // query = query.sort('serviceID');
        // const allServices = await query;


        // Pass the fetched services to the 'all-services' EJS template
        res.render('services/allServices', { allServices });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.addEditServices = async (req, res) => {
    // try {
    //     res.sendFile(path.join(__dirname, '../views/services/addEditServices.html'));
    // } catch (err) {
    //     res.status(404).json({
    //         status: 'failed',
    //         message: err
    //     });
    // }

    try {
        // Fetch all services from the MongoDB database
        const services = await Services.find().sort('serviceID');
        const prices = await ServicesPrices.find();

        // Pass the fetched services to the 'all-services' EJS template
        res.render('services/addEditServices', { services, prices });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.updatePrices = async (req, res) => {
    // try {
    //     res.sendFile(path.join(__dirname, '../views/services/addEditServices.html'));
    // } catch (err) {
    //     res.status(404).json({
    //         status: 'failed',
    //         message: err
    //     });
    // }

    const prices = req.body;

    try {
        // Prepare the update operation excluding accountID
        const { accountID, ...updateFields } = prices; // Destructure to exclude accountID

        // Update records based on accountID
        const result = await ServicesPrices.updateOne(
            { accountID: accountID },
            { $set: updateFields } // Use updateFields for updating only relevant fields
        );

        if (result.nModified === 0) {
            return res.status(404).json({ error: 'No services found for the given accountID' });
        }

        res.json({
            status: 'success',
            message: 'Services updated successfully!'
        });
    } catch (error) {
        console.error('Error updating services:', error);
        res.status(500).json({ error: 'Failed to update services' });
    }
};


exports.activeDisableServices = async (req, res) => {
    // try {
    //     res.sendFile(path.join(__dirname, '../views/services/activeDisableServices.html'));
    // } catch (err) {
    //     res.status(404).json({
    //         status: 'failed',
    //         message: err
    //     });
    // }

    try {
        // Fetch both active and disabled services
        // const activeServices = await ServicesTrackings.find({ active: 'yes' });
        // const disabledServices = await ServicesTrackings.find({ active: 'no' });

        // aggregation to join Services and ServicesTracking collections
        const activeServices = await Services.aggregate([
            {
                $lookup: {
                    from: 'servicestrackings', // Collection name in MongoDB (note: Mongoose uses plural)
                    let: { serviceId: '$serviceID' }, // Define a variable for serviceID from Services
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$serviceID', '$$serviceId'] }, // Match serviceID
                                        { $eq: ['$isActive', 'yes'] }         // Condition for isActive
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'activeServices' // Name of the output field
                }
            },
            {
                $match: {
                    'activeServices.0': { $exists: true } // Only include services with at least one active service
                }
            },
            {
                // the fields/properties/attributes you want to get in final result
                $project: {
                    _id: 0, // Exclude the _id field
                    serviceID: 1,
                    serviceName: 1,
                    serviceDescription: 1,
                    // activeServices: 1 // Keep the active services
                }
            }
        ]).sort('serviceID');

        const disabledServices = await Services.aggregate([
            {
                $lookup: {
                    from: 'servicestrackings', // Collection name in MongoDB (note: Mongoose uses plural)
                    let: { serviceId: '$serviceID' }, // Define a variable for serviceID from Services
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$serviceID', '$$serviceId'] }, // Match serviceID
                                        { $eq: ['$isOpted', 'yes'] },
                                        { $eq: ['$isActive', 'no'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'disabledServices' // Name of the output field
                }
            },
            {
                $match: {
                    'disabledServices.0': { $exists: true } // Only include services with at least one active service
                }
            },
            {
                // the fields/properties/attributes you want to get in final result
                $project: {
                    _id: 0, // Exclude the _id field
                    serviceID: 1,
                    serviceName: 1,
                    serviceDescription: 1,
                    // disabledServices: 1 // Keep the active services
                }
            }
        ]).sort('serviceID');


        // console.log(disabledServices);
        // res.json(activeServices);

        // Render the EJS template and pass the active/disabled services
        res.render('services/activeDisableServices', { activeServices, disabledServices });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.updateStatus = async (req, res) => {
    const { servicesToActivate = [], servicesToDisable = [] } = req.body;

    try {
        // Activate selected services
        if (servicesToActivate.length > 0) {
            await ServicesTrackings.updateMany(
                { serviceID: { $in: servicesToActivate } },
                { isActive: 'yes' }
            );
        }

        // Disable selected services
        if (servicesToDisable.length > 0) {
            await ServicesTrackings.updateMany(
                { serviceID: { $in: servicesToDisable } },
                { isActive: 'no' }
            );
        }

        res.json({
            status: 'success',
            message: 'Services updated successfully!'
        });
    } catch (error) {
        console.error('Error updating services:', error);
        res.status(500).json({ error: 'Failed to update services' });
    }
};

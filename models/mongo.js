// insert.js
const { MongoClient } = require('mongodb');

// Replace with your MongoDB connection string
// const uri = 'mongodb://localhost:27017'; // For local MongoDB
const uri = 'mongodb+srv://entrognity:Planet777Earth@cluster0.mwhvd.mongodb.net/printit?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

async function run() {
    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Connect to a specific database and collection
        const database = client.db('printit'); // Replace with your database name

        // const collection = database.collection('servicestrackings'); // Replace with your collection name
        // const collection = database.collection('services');
        const collection = database.collection('servicesprices');

        // Create an array of documents to insert
        // const docs = [
        //     { serviceID: 1, serviceName: 'Normal Individual Print', serviceDescription: 'the document is printed on individual papers with no extra binding' },
        //     { serviceID: 2, serviceName: 'Spiral Binding', serviceDescription: 'the documnet is printed on papers and then binded spirally with a cover on either sides' }
        // ];
        // const docs = [
        //     { serviceID: 1, serviceName: 'Normal Individual Print', serviceDescription: 'the document is printed on individual papers with no extra binding' },
        //     { serviceID: 2, serviceName: 'Spiral Binding', serviceDescription: 'the documnet is printed on papers and then binded spirally with a cover on either sides' },
        //     { serviceID: 3, serviceName: 'SN3', serviceDescription: 'SD3' },
        //     { serviceID: 4, serviceName: 'SN4', serviceDescription: 'SD4' },
        //     { serviceID: 5, serviceName: 'SN5', serviceDescription: 'SD5' },
        //     { serviceID: 6, serviceName: 'SN6', serviceDescription: 'SD6' },
        //     { serviceID: 7, serviceName: 'SN7', serviceDescription: 'SD7' },
        //     { serviceID: 8, serviceName: 'SN8', serviceDescription: 'SD8' },
        //     { serviceID: 9, serviceName: 'SN9', serviceDescription: 'SD9' },
        //     { serviceID: 10, serviceName: 'SN10', serviceDescription: 'SD10' },
        //     { serviceID: 11, serviceName: 'SN11', serviceDescription: 'SD11' },
        //     { serviceID: 12, serviceName: 'SN12', serviceDescription: 'SD12' },
        //     { serviceID: 13, serviceName: 'SN13', serviceDescription: 'SD13' },
        //     { serviceID: 14, serviceName: 'SN14', serviceDescription: 'SD14' },
        //     { serviceID: 15, serviceName: 'SN15', serviceDescription: 'SD15' }
        // ];

        // const docs = [
        //     { accountID: 'acc1', serviceID: 1, isOpted: 'yes', isActive: 'yes' },
        //     { accountID: 'acc1', serviceID: 2, isOpted: 'yes', isActive: 'yes' },
        //     { accountID: 'acc1', serviceID: 3, isOpted: 'yes', isActive: 'yes' },
        //     { accountID: 'acc1', serviceID: 4, isOpted: 'yes', isActive: 'yes' },
        //     { accountID: 'acc1', serviceID: 5, isOpted: 'yes', isActive: 'yes' },
        //     { accountID: 'acc1', serviceID: 6, isOpted: 'yes', isActive: 'yes' },
        //     { accountID: 'acc1', serviceID: 7, isOpted: 'yes', isActive: 'yes' },
        //     { accountID: 'acc1', serviceID: 8, isOpted: 'yes', isActive: 'yes' },
        //     { accountID: 'acc1', serviceID: 9, isOpted: 'yes', isActive: 'no' },
        //     { accountID: 'acc1', serviceID: 10, isOpted: 'yes', isActive: 'no' },
        //     { accountID: 'acc1', serviceID: 11, isOpted: 'yes', isActive: 'no' },
        //     { accountID: 'acc1', serviceID: 12, isOpted: 'yes', isActive: 'no' },
        //     { accountID: 'acc1', serviceID: 13, isOpted: 'yes', isActive: 'no' },
        //     { accountID: 'acc1', serviceID: 14, isOpted: 'yes', isActive: 'no' },
        //     { accountID: 'acc1', serviceID: 15, isOpted: 'yes', isActive: 'no' }
        // ];

        const docs = [
            { accountID: 'acc1', individualBWPerPage: 2, individualColorPerPage: 5, spiralBinding: 50 }
        ];

        // Insert the documents
        const result = await collection.insertMany(docs);
        console.log(`${result.insertedCount} documents were inserted with the following ids:`);
        result.insertedIds.forEach(id => console.log(id));
    } catch (err) {
        console.error('Error inserting documents:', err);
    } finally {
        // Close the connection to the database
        await client.close();
    }
}

// Run the script
run().catch(console.error);

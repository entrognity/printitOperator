const crypto = require('crypto');

exports.generateOrderID = async (userMobNumber) => {
    const timestamp = Math.floor(Date.now() / 1000).toString(); // e.g., 1633022923
    const mobilePart = userMobNumber.slice(-3);
    // Add a random string for extra uniqueness
    // const randomString = crypto.randomBytes(2).toString('hex'); // Generates 4 characters (hexadecimal)
    return `ORD${mobilePart}${timestamp}`;
};


exports.generateOperatorID = async (shopName, operatorMobNumber) => {
    // const timestamp = Math.floor(Date.now() / 1000).toString(); // e.g., 1633022923
    // const mobilePart = userMobNumber.substring(0, 3);
    // Add a random string for extra uniqueness

    // 3 letters of shop name
    const shpNm = shopName.replace(/ /g,'').substring(0, 3).toUpperCase();

    // last 3 numbers of phone number
    const phNm = operatorMobNumber.slice(-3);

    // Add a random string for extra uniqueness
    const randomString = crypto.randomBytes(2).toString('hex').toUpperCase(); // Generates 4 characters (hexadecimal)

    return `OPR${shpNm}${phNm}${randomString}`;
};

exports.generateArticleID = async (userMobNumber) => {
    const timestamp = Math.floor(Date.now() / 1000).toString(); // e.g., 1633022923
    const mobilePart = userMobNumber.slice(-3);
    // Add a random string for extra uniqueness
    // const randomString = crypto.randomBytes(2).toString('hex'); // Generates 4 characters (hexadecimal)
    return `-ORD${timestamp}${mobilePart}`;
};

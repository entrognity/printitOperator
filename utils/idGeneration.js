exports.generateOrderID = async (userMobNumber) => {
    const timestamp = Math.floor(Date.now() / 1000).toString(); // e.g., 1633022923
    const mobilePart = userMobNumber.substring(0, 3);
    // Add a random string for extra uniqueness
    // const randomString = crypto.randomBytes(2).toString('hex'); // Generates 4 characters (hexadecimal)
    return `ORD${timestamp}${mobilePart}`;
};
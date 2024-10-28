

exports.generateSixDigOtp = async () => {
    // Generate a random 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000);
};

exports.generateFourDigOtp = async () => {
    // Generate a random 6-digit OTP
    return Math.floor(1000 + Math.random() * 9000);
};
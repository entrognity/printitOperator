
const getDate = () => {
    try {
        // Get the current date
        const countryCode = 91;
        const currentDate = new Date();
        
        // Create an Intl.DateTimeFormat object based on the country code
        // const formatter = new Intl.DateTimeFormat(countryCode, {
        //     year: 'numeric',
        //     month: 'long',
        //     day: 'numeric',
        //     hour: 'numeric',
        //     minute: 'numeric',
        //     second: 'numeric',
        //     timeZoneName: 'short'
        // });
        
        // Return the formatted date string
        // return formatter.format(currentDate);

        return currentDate;
    } catch (error) {
        // Handle invalid country code
        console.error('Error getting the date:', error);
    }
}

module.exports = { getDate };

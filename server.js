// libraries and modules
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');   


dotenv.config({ path: './config.env' })
const PORT = process.env.PORT || 3000;


// DB connection
mongoose
    .connect(process.env.MONGODB_URI, {
        // useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndModify: false
    })
    .then(() => console.log('DB connection successful'));


// server initialization (listen)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

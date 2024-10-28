// import libraries and modules
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const ordersRoutes = require('./routes/ordersRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const filesRoutes = require('./routes/filesRoutes');
const authRoutes = require('./routes/authRoutes');
const emailRoutes = require('./routes/emailRoutes');



const app = express();

// middlewares

// Set security HTTP headers (handle csp errors)
// app.use(
//     helmet({
//         contentSecurityPolicy: {
//             directives: {
//                 defaultSrc: ["'self'"], // Only allow content from the same origin
//                 scriptSrc: ["'self'", "https://code.jquery.com"], // Allow scripts from your domain and jQuery CDN
//                 styleSrc: ["'self'", "https://fonts.googleapis.com"], // Allow styles from your domain and Google Fonts
//                 fontSrc: ["'self'", "https://fonts.gstatic.com"], // Allow fonts from your domain and Google Fonts
//                 imgSrc: ["'self'", "data:"], // Allow images from your domain and inline base64 images
//                 connectSrc: ["'self'"], // Allow AJAX, WebSocket, or API calls only to your domain
//                 upgradeInsecureRequests: [], // Automatically upgrade HTTP to HTTPS
//             },
//         },
//     })
// );

// Limit requests from same API
const limiter = rateLimit({
    max: 300,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// body parsers, reading data from body into req.body
// app.use(bodyParser.json());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
// app.use(
//     hpp({
//         whitelist: [
//             'duration',
//             'ratingsQuantity',
//             'ratingsAverage',
//             'maxGroupSize',
//             'difficulty',
//             'price'
//         ]
//     })
// );


app.use(morgan('dev'));

app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'ejs'); // Set view engine to EJS
app.set('views', `${__dirname}/views`); // Set the directory where EJS files are located

// Application routes
app.use('/api/v1/orders', ordersRoutes);
app.use('/api/v1/services', servicesRoutes);
app.use('/api/v1/files', filesRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/email', emailRoutes);


// exports
module.exports = app;
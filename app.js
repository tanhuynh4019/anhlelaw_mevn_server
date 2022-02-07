const mongoose = require('mongoose');
const express = require('express');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const route = require('./routes/routes');

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;


//express-rate-limit
const limiter = rateLimit({
    // 15 minutes
    windowMs: 15 * 60 * 1000,
    // limit each IP to 100 requests per windowMs
    max: 100
});
app.use(limiter);

//helmet
app.use(helmet())

// plugin
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("uploads"));
app.use(express.static("public"));

// connect database 
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connect success!')).catch(error => console.log(error));

// routes
route(app);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})
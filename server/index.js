//On this page an express server is opened to allow connectivity to the database
const express = require('express');
const authRoute = require('./routes/auth');
const profileRoute = require('./routes/profile');
const accountRoute = require('./routes/account');
const transactionsRoute = require('./routes/transactions');
require('dotenv').config();

//This is the port number that the connection is opened on
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.set('view engine', 'ejs');
app.use(authRoute);
app.use(accountRoute.Router);
app.use(profileRoute);
app.use(transactionsRoute);

//The command to make the connection.
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});


//git branch test
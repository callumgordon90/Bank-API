// Authorisation middleware: 
// this file checks if authentification token is sent when a request is made to the API route by the client.
// the request is only sent forward to the private routes if the token is valid.
// otherwise an error is return without executing the route.


const jwt = require('jsonwebtoken');
const { pool } = require('../db/connect');


const authMiddleware = async function (req, res, next) {
    try {
        const token = req.header('Authorization').split(' ')[1];
        const decoded = jwt.verify(token, process.env.secret);
        const result = await pool.query(
            'select b.userid,b.first_name,b.last_name,b.email,t.access_token from bank_user b inner join tokens t on b.userid=t.userid where t.access_token=$1 and t.userid=$2',
            [token, decoded.userid]
        );
        const user = result.rows[0];
        if (user) {
            req.user = user;
            req.token = token;
            next();
        } else {
            throw new Error('Error while authentication');
        }
    } catch (error) {
        res.status(400).send({
            auth_error: 'Authentication failed.'
        });
    }
};

module.exports = authMiddleware;

//test test test
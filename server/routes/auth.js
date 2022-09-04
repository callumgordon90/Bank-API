//This file is the CRUD functionality for logging in, logging out, and signing up
//With token authorisation
const express = require('express');
const bcrypt = require('bcryptjs');

//To access and retrieve data from the database
//We use connection pool which is created in db > connect file and imported here
const { pool } = require('../db/connect');
const {
    validateUser,
    isInvalidField,
    generateAuthToken
} = require('../utils/common');
const authMiddleware = require('../middleware/auth');

const Router = express.Router();


//Here, the signup route function checks if information coming to the API
//contains the fields which are needed for registration using isInvalidField function defined in common.js

//This is the sign up function
Router.post('/signup', async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        const validFieldsToUpdate = [
            'first_name',
            'last_name',
            'email',
            'password'
        ];
        const receivedFields = Object.keys(req.body);

        const isInvalidFieldProvided = isInvalidField(
            receivedFields,
            validFieldsToUpdate
        );

        if (isInvalidFieldProvided) {
            return res.status(400).send({
                signup_error: 'Invalid field.'
            });
        }

        const result = await pool.query(
            'select count(*) as count from bank_user where email=$1',
            [email]
        );

        //Data returned will be from row property from result
        //So if the count is greater than zero, there already exists another user with same email
        //so an error message is returned
        const count = result.rows[0].count;
        if (count > 0) {
            return res.status(400).send({
                signup_error: 'User with this email address already exists.'
            });
        }
        // This part uses bcrypt to generate an encrypted password
        const hashedPassword = await bcrypt.hash(password, 8);

        //In this part of the sign up function, the pg npm package
        //permits the writing of queries in the database.
        await pool.query(
            'insert into bank_user(first_name, last_name, email, password) values($1,$2,$3,$4)',
            [first_name, last_name, email, hashedPassword]
        );
        //dynamic values by assigning $count variable
        res.status(201).send();
    } catch (error) {
        res.status(400).send({
            signup_error: 'Error while signing up..Try again later.'
        });
    }
});
//Info sent from user will become available inside req.body object in JSON format

//This is the sign in function
Router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await validateUser(email, password);
        //If the user does not exist in the database then we throw an error and message
        if (!user) {
            res.status(400).send({
                sigin_error: 'Email/password do not match.'
            });
        }
        const token = await generateAuthToken(user);

        // This part of the sign in function 
        //checks if there is a user with the provided email address.
        const result = await pool.query(
            'insert into tokens(access_token, userid) values($1,$2) returning *',
            [token, user.userid]
        );
        if (!result.rows[0]) {
            return res.status(400).send({
                signin_error: 'Error while signing in..Try again later.'
            });
        }
        // when the token is successfully added to tokens table, 
        // we return the user details and token back to the client
        user.token = result.rows[0].access_token;
        res.send(user);
    } catch (error) {
        res.status(400).send({
            signin_error: 'Email/password does not match.'
        });
    }
});

//This is the logout function
Router.post('/logout', authMiddleware, async (req, res) => {
    try {
        const { userid, access_token } = req.user;
        await pool.query('delete from tokens where userid=$1 and access_token=$2', [
            userid,
            access_token
        ]);
        res.send();
    } catch (error) {
        res.status(400).send({
            logout_error: 'Error while logging out..Try again later.'
        });
    }
});

module.exports = Router;
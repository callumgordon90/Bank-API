// all necessary dependencies:
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const puppeteer = require('puppeteer');
const moment = require('moment');
const { pool } = require('../db/connect');

// This function makes sure that an the correct fields are added by the user
const isInvalidField = (receivedFields, validFieldsToUpdate) => {
    return receivedFields.some(
        (field) => validFieldsToUpdate.indexOf(field) === -1
    );
};

//This function queries the database to check that a user with the same details
//does not already exist in the database, and if there is a valid user with this email in the database
const validateUser = async (email, password) => {
    const result = await pool.query(
        'select userid,  email, password from bank_user where email = $1',
        [email]
    );

    //If such a user exists, then we can compare the password of the user
    //with the password saved in the database to check if they match.
    const user = result.rows[0];
    if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            delete user.password;
            return user;
        } else {
            throw new Error();
        }
    } else {
        throw new Error();
    }
};
// function for json web token authentification
// If we get the user from validateUser function, 
// then we call generateAuthToken to generate jwt token by passing that user object to it.
const generateAuthToken = async (user) => {
    const { userid, email } = user;
    const secret = process.env.secret;
    const token = await jwt.sign({ userid, email }, secret);
    return token;
};

// function to query database for transaction history
const getTransactions = async (account_id, start_date, end_date) => {
    let result;
    try {
        if (start_date && end_date) {
            result = await pool.query(
                "select to_char(transaction_date, 'YYYY-MM-DD') as formatted_date,withdraw_amount,deposit_amount,balance from transactions where account_id=$1 and to_char(transaction_date, 'YYYY-MM-DD') between $2 and $3 order by transaction_date desc",
                [account_id, start_date, end_date]
            );
        } else {
            result = await pool.query(
                "select to_char(transaction_date, 'YYYY-MM-DD') as formatted_date,withdraw_amount,deposit_amount,balance from transactions where account_id=$1 order by transaction_date desc",
                [account_id]
            );
        }
        return result;
    } catch (error) {
        throw new Error();
    }
};

// function to generate a pdf of transaction history
const generatePDF = async (filepath) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`file:${path.join(filepath, 'transactions.html')}`, {
        waitUntil: 'networkidle2'
    });
    await page.setViewport({ width: 1680, height: 1050 });
    const pdfURL = path.join(filepath, 'transactions.pdf');
    await page.addStyleTag({
        content: `
    .report-table { border-collapse: collapse; width:100%; }
    .report-table td, th { border: 1px solid #ddd; padding: 10px; }
    .report-table th { text-align: left; }
    `
    });
    const pdf = await page.pdf({
        path: pdfURL,
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: `<div style="font-size:7px;white-space:nowrap;margin-left:38px;">
                        ${moment(new Date()).format('Do MMMM YYYY')}
                    </div>`,
        footerTemplate: `<div style="font-size:7px;white-space:nowrap;margin-left:38px;margin-right:35px;width:100%;">
                        <span style="display:inline-block;float:right;margin-right:10px;">
                            <span class="pageNumber"></span> / <span class="totalPages"></span>
                        </span>
                    </div>`,
        margin: {
            top: '1.2cm',
            right: '1.2cm',
            bottom: '1.2cm',
            left: '1.2cm'
        }
    });
    await browser.close();

    return pdf.length;
};

module.exports = {
    isInvalidField,
    validateUser,
    generateAuthToken,
    getTransactions,
    generatePDF
};
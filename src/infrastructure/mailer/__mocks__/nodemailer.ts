/**
 * Jest Mock
 * ./__mocks__/nodemailer.js
 **/
// load the real nodemailer
import nodemailer from 'nodemailer';
// import nodemailermock from 'nodemailer-mock';
// pass it in when creating the mock using getMockFor()
const nodemailermock = require('nodemailer-mock').getMockFor(nodemailer);
// export the mocked module
module.exports = nodemailermock;

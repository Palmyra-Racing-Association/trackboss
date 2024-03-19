const serverless = require('serverless-http');
const api = require('../../src/api/api');

const { createVerifier } = require('../../src/util/auth');

// Create a Lambda handler function
createVerifier();
exports.handler = serverless(api);

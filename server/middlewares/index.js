const { registerRequest, signinRequest } = require('./global/Authentication');
const { ContactRequest } = require('./global/Contact');
const { EnrollmentRequest } = require('./user/Enrollment');

module.exports = {
    registerRequest,
    signinRequest,

    ContactRequest,

    EnrollmentRequest
}
const { getAuthData, getUserNameByEmail, registerUser, signinUser, updateUserProfile } = require('./global/Authentication');
const { postContact, getContact, getContactByEmail, updateContact, deleteContact } = require('./global/Contact');

const { postEnrollment, getEnrollment, getEnrollmentByEmail, deleteEnrollment, updateEnrollment } = require('./user/Enrollment');

module.exports = { 
    getAuthData,
    getUserNameByEmail,
    registerUser,
    signinUser,
    updateUserProfile,

    postContact, getContact, getContactByEmail, updateContact, deleteContact,

    postEnrollment, getEnrollment, getEnrollmentByEmail, deleteEnrollment, updateEnrollment,
};
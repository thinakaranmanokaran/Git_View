const express = require('express');
const globalRouter = express.Router();

const { registerUser, getAuthData, updateUserProfile, signinUser, postContact, getContact, getContactByEmail, deleteContact, updateContact } = require('../controllers');
const { registerRequest, signinRequest, ContactRequest } = require('../middlewares');

// Registration route
globalRouter.post('/register', registerRequest, registerUser);
globalRouter.get('/register/data/:email', getAuthData);
globalRouter.put('/register/update/:email', updateUserProfile);

// Sign-in route
globalRouter.post('/signin', signinRequest, signinUser);

// Contact routes
globalRouter.post('/contact', ContactRequest, postContact);
globalRouter.get('/contact/all', getContact ); // Assuming you want to get all contacts
globalRouter.get('/contact/one/:email', getContactByEmail ); // Assuming you want to get all contacts
globalRouter.delete('/contact/one/:id', deleteContact ); // Assuming you want to get all contacts
globalRouter.put('/contact/update/:id', updateContact ); // Assuming you want to get all contacts

module.exports = globalRouter;
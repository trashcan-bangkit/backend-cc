/* eslint-disable no-unused-vars */
const admin = require('firebase-admin');
const axios = require('axios');
const firestore = admin.firestore();
// Firebase Web API Key (get this from your Firebase project settings)
const FIREBASE_WEB_API_KEY = process.env.FIREBASE_WEB_API_KEY;

// Signup Handler
const signupHandler = async (request, h) => {
    const { name, email, password } = request.payload;

    if (password.length < 8) {
        return h.response({ error: 'Password must be at least 8 characters long' }).code(400);
    }

    try {
        const userRecord = await admin.auth().createUser({ name, email, password });
        const docRef = await firestore.collection('users').add({
            name: name,
            email: email,
            password: password
        });        
        return h.response({ message: 'User created successfully', user: userRecord, docId: docRef.id }).code(201);
    } catch (error) {
        return h.response({ error: error.message }).code(400);
    }
};

// Signin Handler
const signinHandler = async (request, h) => {
    const { email, password } = request.payload;

    try {
        const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_WEB_API_KEY}`, {
            email,
            password,
            returnSecureToken: true
        });
        const { data } = response;
        // Check if the response contains a valid ID token
        if (data && data.idToken) {
            const idToken = data.idToken;
            return h.response({ message: 'User signed in successfully', token: idToken }).code(200);
        } else {
            // If the response does not contain a valid ID token, return an error
            return h.response({ error: 'Invalid response from Firebase' }).code(400);
        }
    } catch (error) {
        // Handle errors from the Firebase Authentication API
        const errorMessage = error.response?.data?.error?.message || 'An unknown error occurred';
        return h.response({ error: errorMessage }).code(400);
    }
};

// Profile Handler
const profileHandler = async (request, h) => {
    const userId = request.user.uid;

    try {
        const users = await admin.auth().getUser(userId);
        const { email } = users;
        const { name } = await firestore.collection('users').doc(userId).get();

        return h.response({ message: 'User profile retrieved successfully', user: { email, name} }).code(200);
    } catch (error) {
        return h.response({ error: error.message }).code(400);
    }
};

// Verify Token Middleware
const verifyToken = async (request, h) => {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
        return h.response({ error: 'Authorization header is missing' }).code(401).takeover();
    }

    const idToken = authorizationHeader.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        request.user = decodedToken;
        return h.continue;
    } catch (error) {
        return h.response({ error: 'Unauthorized' }).code(401).takeover();
    }
};

module.exports = {
    signupHandler,
    signinHandler,
    profileHandler,
    verifyToken
};

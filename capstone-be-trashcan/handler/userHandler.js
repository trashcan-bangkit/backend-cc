const admin = require('firebase-admin');
const firestore = admin.firestore();

const userHandler = async (request, h) => {
    const { name, password } = request.payload;

    try {
        // ID Firestore
        const docRef = await firestore.collection('users').add({
            name: name,
            password: password
        });

        return { status: 'success', message: 'User data saved', docId: docRef.id };
    } catch (error) {
        console.error('Error writing document: ', error);
        return { status: 'error', message: 'Failed to save user data' };
    }
};

module.exports = userHandler;




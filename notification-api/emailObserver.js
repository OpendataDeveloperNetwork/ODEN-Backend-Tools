const admin = require("firebase-admin")
let adminEmails = [];

try {
    const serviceAccount = require("./service-key.json");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} catch (error) {
    console.log('Error initializing Firebase Admin SDK (ENSURE IT IS IN FILE DIRECTORY):', error);
}

const db = admin.firestore();
const notificationApiRef = db.collection('notification-api');
const AdminRef = notificationApiRef.doc('admins');

/**
 * Observer to keep an updated array of admin emails.
 */
const adminEmailObserver = AdminRef.onSnapshot(docSnapshot => {
    console.log(`Received document snapshot: ${docSnapshot}`);
    // console.log(`Admin subscriber email list: ${docSnapshot.data().verifyLinkSubscribers}`)
    adminEmails = docSnapshot.data().verifyLinkSubscribers;
    console.log(`adminEmails = ${adminEmails}`);
}, err => {
    console.error(`Error retrieving admin's verify link subscriber list: ${err}`);
});

function getAdminEmails() {
    return adminEmails;
}

module.exports = {
    getAdminEmails, 
    adminEmailObserver
};

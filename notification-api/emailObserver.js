const admin = require("firebase-admin")
let subscribers = {};

try {
    const serviceAccount = require("./service-key.json");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} catch (error) {
    console.log('Error initializing Firebase Admin SDK (ENSURE IT IS IN FILE DIRECTORY):', error);
}

const db = admin.firestore();
const notificationApiSubscriberRef = db.collection('notification-api').doc('subscribers');

/**
 * Observer for email subscriptions.
 */
const subscriberObserver = notificationApiSubscriberRef.onSnapshot(docSnapshot => {
    // Grabs a snapshot of the 'subscriber' doc and loops through each array, appending to `subscriber` map.
    const data = docSnapshot.data();

    Object.keys(data).forEach((key) => {
        // adds only arrays to the `subscriber` map.
        if (Array.isArray(data[key])) {
            subscribers[key] = data[key];
        }
    });

    for (const key in subscribers) {
        console.log(`${key}: ${subscribers[key]}`);
      }
}, err => {
    console.error(`Error retrieving Subscriber document snapshot: ${err}`);
});

function getSubscribers() {
    return subscribers;
}

module.exports = {
    getSubscribers,
    subscriberObserver
};

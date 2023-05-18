const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./service-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Initialize Firestore
const firestore = admin.firestore();

// Function to delete duplicate entries
async function deleteDuplicates(collectionPath, fieldName) {
  const duplicates = [];
  const exists = [];

  const collection = firestore.collection(collectionPath);

  // Get all documents in the collection
  const querySnapshot = await collection.get();

  // Loop through each document
  querySnapshot.forEach((doc) => {
    const fieldValue = doc.get(fieldName);

    // Check if the current field value is already in the duplicates array
    if (exists.includes(fieldValue)) {
      // This is a duplicate entry
      duplicates.push(doc.id);
      console.log(doc.id);
    } else {
      exists.push(fieldValue);
      console.log(fieldValue);
    }
  });

  // Delete duplicate entries
  const deletePromises = duplicates.map((id) => collection.doc(id).delete());
  await Promise.all(deletePromises);

  console.log('Duplicates deleted:', duplicates.length);
}

// Usage
deleteDuplicates('verified-metadata', 'url');

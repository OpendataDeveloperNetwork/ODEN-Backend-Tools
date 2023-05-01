const admin = require('firebase-admin');

try {
    const serviceAccount = require("./service-key.json");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} catch (error) {
    console.log('Error initializing Firebase Admin SDK (ENSURE IT IS IN FILE DIRECTORY):', error);
}

const db = admin.firestore();

// Selects the test-validator collection
const test_validator = db.collection('verified-pool');

// 1. Function to fetch dataset
async function fetchDataset() {
    var newJSONObject = {};
    
    // Gets the data from collection
    const datasetSnapshot = await test_validator.get();
    
     if (datasetSnapshot.empty) {
        console.log('readDataSiteEntrys(): NO DATA FROM DATABASE.');
        return null;
    }
    
    datasetSnapshot.forEach(doc => {
        // Add each document to the JSON object
        newJSONObject[doc.id] = doc.data();
    });

    console.log(newJSONObject)

  return newJSONObject;
}

// // 2. Wrapper function to catch errors
// async function applyFilters(filters) {
//   const dataset = await fetchDataset();
//   const filteredData = [];

//   for (const data of dataset) {
//     let filterPassed = true;
//     for (const filter of filters) {
//       try {
//         if (!filter(data)) {
//           filterPassed = false;
//           break;
//         }
//       } catch (err) {
//         // 4. Set flag in firestore database
//         const db = firebase.firestore();
//         const flagRef = db.collection('flags').doc();
//         await flagRef.set({
//           filterName: filter.name,
//           errorMessage: err.message,
//           timestamp: firebase.firestore.FieldValue.serverTimestamp()
//         });
//         filterPassed = false;
//         break;
//       }
//     }
//     if (filterPassed) {
//       filteredData.push(data);
//     }
//   }

//   // 5. Log file with filters that do or do not work
//   const logMessage = `Filters: ${filters.map(filter => filter.name).join(', ')}\n` +
//                      `Filtered data count: ${filteredData.length}\n` +
//                      `Failed filter count: ${filters.length - filteredData.length}\n`;
//   console.log(logMessage);
// }

// // 3. Function to parse schema and ensure type matches
// function validateData(data, schema) {
//   for (const [field, type] of Object.entries(schema)) {
//     if (typeof data[field] !== type) {
//       throw new Error(`Field ${field} should be of type ${type}`);
//     }
//   }
// }

// // Sample usage:
// const schema = {
//   name: 'string',
//   age: 'number'
// };

// const filters = [
//   data => data.age > 20,
//   data => data.name.startsWith('J')
// ];

// applyFilters(filters.map(filter => {
//   return async data => {
//     validateData(data, schema);
//     return await filter(data);
//   };
// }));

fetchDataset()

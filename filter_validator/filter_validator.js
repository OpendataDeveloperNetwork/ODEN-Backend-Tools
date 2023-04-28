const firebase = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://your-project-id.firebaseio.com'
});

// 1. Function to fetch dataset
async function fetchDataset() {
  const db = firebase.firestore();
  const datasetRef = db.collection('dataset');
  const datasetSnapshot = await datasetRef.get();
  const dataset = datasetSnapshot.docs.map(doc => doc.data());
  return dataset;
}

// 2. Wrapper function to catch errors
async function applyFilters(filters) {
  const dataset = await fetchDataset();
  const filteredData = [];

  for (const data of dataset) {
    let filterPassed = true;
    for (const filter of filters) {
      try {
        if (!filter(data)) {
          filterPassed = false;
          break;
        }
      } catch (err) {
        // 4. Set flag in firestore database
        const db = firebase.firestore();
        const flagRef = db.collection('flags').doc();
        await flagRef.set({
          filterName: filter.name,
          errorMessage: err.message,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        filterPassed = false;
        break;
      }
    }
    if (filterPassed) {
      filteredData.push(data);
    }
  }

  // 5. Log file with filters that do or do not work
  const logMessage = `Filters: ${filters.map(filter => filter.name).join(', ')}\n` +
                     `Filtered data count: ${filteredData.length}\n` +
                     `Failed filter count: ${filters.length - filteredData.length}\n`;
  console.log(logMessage);
}

// 3. Function to parse schema and ensure type matches
function validateData(data, schema) {
  for (const [field, type] of Object.entries(schema)) {
    if (typeof data[field] !== type) {
      throw new Error(`Field ${field} should be of type ${type}`);
    }
  }
}

// Sample usage:
const schema = {
  name: 'string',
  age: 'number'
};

const filters = [
  data => data.age > 20,
  data => data.name.startsWith('J')
];

applyFilters(filters.map(filter => {
  return async data => {
    validateData(data, schema);
    return await filter(data);
  };
}));

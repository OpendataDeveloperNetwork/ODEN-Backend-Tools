const {
  default: axios
} = require("axios");
const dotenv = require('dotenv');

dotenv.config(); // For the .env file

const validator = require('jsonschema').Validator

const updateFile = require('./update_github').updateFile;

const test_data = require('./test_data.js').test_entries

// Goal for tomorrow:
// TODO: Loop through each object and ensure the schema, dataset, and filter fields exist (log if they do or dont)
// TODO: Fetch the schema, filter, and data from the urls, and ensure they are valid (check to make sure the dataset is json or not ...)

const test_update = async (test_entries) => {
  const validation = await validateEntries(test_entries)
  if (validation)
    updateFile(validation)
}

const validateEntries = async (entries) => {

  const stdLibFunc = await get_std_lib_func()
    .catch(err => {
      console.log("Error fetching standard library function.")
      return
    })

  const result = {}

  for (const entry of entries) {
    const url = entry.url
    const schemaUrl = entry.data.schema

    let schema
    try {
      schema = await fetchUrlData(schemaUrl, "schema")
    } catch (err) {
      console.log("Schema url invalid for: " + entry.url)
      continue
    }

    const datasets = entry.data.datasets || {}

    if (Object.keys(datasets).length == 0)
      console.log("No datasets for: " + entry.url)

    for (const [datasetKey, datasetObj] of Object.entries(datasets)) {
      const datasetUrl = datasetObj.url || {};

      let dataset
      try {
        dataset = await fetchUrlData(datasetUrl, "dataset")
      } catch (err) {
        console.log("Dataset url invalid for: " + entry.url)
        continue
      }

      const filters = datasetObj.filters || {};

      if (Object.keys(filters).length == 0)
        console.log("No filter for: " + entry.url)

      for (const [filterKey, filterUrl] of Object.entries(filters)) {
        let filterFunc

        try {
          const filter = await fetchUrlData(filterUrl, "filter")
          filterFunc = Function(filter)()
        } catch (err) {
          console.log("Filter url invalid for: " + url)
          continue
        }
        console.log("VALID ENTRY: " + url)

        const [
          conformSchema, correctness
        ] = validateFilter(filterFunc, dataset, schema, stdLibFunc) || []

        if (conformSchema !== undefined) {
          const schemaObj = result[url] = result[url] || {
            conformSchema: true,
            datasets: {}
          }
          const datasetObj = schemaObj.datasets[datasetKey] = schemaObj.datasets[datasetKey] || {
            filters: {}
          }
          const filterObj = datasetObj.filters[filterKey] = datasetObj.filters[filterKey] || {}

          schemaObj.conformSchema = !schemaObj.conformSchema || conformSchema
          filterObj.correctness = correctness

        } else {
          console.log("No validation result.")
        }
        console.log('')
      }
    }
  }
  return result
}

const fetchUrlData = async (urlParam, type) => {

  const res = await axios({
    url: urlParam,
    method: 'GET',
    responseType: 'blob',
  })

  if (["schema", "dataset"].includes(type) && !(res.headers.get("Content-Type").includes('application/json') || urlParam.endsWith(".json"))) {
    throw Error
  } else if (type == "filter" && !(res.headers.get("Content-Type").includes('text/plain') || urlParam.endsWith(".js"))) {
    throw Error
  }

  return res.data
}

const validateFilter = (filter, dataset, schema, stdLib) => {
  const v = new validator();

  try {
    const {
      data = [], errors = []
    } = filter(dataset, stdLib, schema, v, false) || {}

    // update needed only when errors are returned
    if (errors.length > 0) {
      const conformSchema = !errors.some(error => error.type === 'validation')
      const correctness = Math.round((data.length / (data.length + errors.length)) * 1000) / 1000
      return [conformSchema, correctness]
    }
  } catch (err) {
    console.log("Filter is invalid with the following error:\n" + err)
  }
}

const get_entries = async () => {
  url = "https://raw.githubusercontent.com/OpendataDeveloperNetwork/ODEN-Client/main/data.json";
  const res = await axios({
    url: url,
    method: 'GET',
    responseType: 'json',
  })
  result = res.data
  return result
}

const get_std_lib_func = async () => {
  const res = await axios({
    url: "https://raw.githubusercontent.com/OpendataDeveloperNetwork/ODEN-Transmogrifiers/dev/libraries/standard.js",
    method: 'GET',
    responseType: 'blob',
  })

  return Function(res.data)()
}

// Data from data.json file in client
// const entries_from_data_json = null
// get_entries()
//   .then((entries_from_data_json) => {
//     validateEntries(entries_from_data_json)
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// Data from hardcoded test entries
// validateEntries(test_entries)
test_update(test_data)
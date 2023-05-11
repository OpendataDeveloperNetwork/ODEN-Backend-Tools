const {
  default: axios
} = require("axios");

const validator = require('jsonschema').Validator

const updateFile = require('./update_github').updateFile;

const test_data = require('./test_data.js').test_entries

// Goal for tomorrow:
// TODO: Loop through each object and ensure the schema, dataset, and filter fields exist (log if they do or dont)
// TODO: Fetch the schema, filter, and data from the urls, and ensure they are valid (check to make sure the dataset is json or not ...)


const test_update = async (test_entries) => {
  get_entries().then(async entries => {
    const validation = await validateEntries(entries)
    if (validation)
      updateFile(validation)
  }).catch(err => { 
    console.log("Error fetching entries from data.json") 
  })
}


var email_message = '<p><b>The following filter entries have failed:</b><br><br>'
var invalid_entry_count = 0

const send_notification = async () => {
  email_message += "</p>"
  console.log(email_message)

  const requestBody = {
    subject: 'Notification: Invalid Entries',
    message: email_message
  };

  axios.post('http://localhost:8080/notifyAdmins', requestBody)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });

}


const add_to_email = (message, entry) => {
  const labels = entry.labels
  invalid_entry_count++
  city = labels.city || "<i>City missing</i>";
  region = labels.region || "<i>Region missing</i>";
  country = labels.country || "<i>Country missing</i>";

  email_message += `${invalid_entry_count}. ${message}${city}, ${region}, ${country}<br>`
  // email_message += `${invalid_entry_count}. ${message} <a href = "${entry.url}">Link</a><br>`

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
    console.log('')

    let schema
    try {
      schema = await fetchUrlData(schemaUrl, "schema")
    } catch (err) {
      console.log("Schema url invalid for: " + url)
      add_to_email("Schema url invalid for: ", entry)
      continue
    }

    const datasets = entry.data.datasets || {}

    if (Object.keys(datasets).length == 0) {
      console.log("No datasets for: " + entry.labels.city)
      add_to_email("No datasets for: ", entry)
      continue
    }


    for (const [datasetKey, datasetObj] of Object.entries(datasets)) {
      const datasetUrl = datasetObj.url || {};

      let dataset
      try {
        dataset = await fetchUrlData(datasetUrl, "dataset")
      } catch (err) {
        console.log("Dataset url invalid for: " + url)
        add_to_email("Dataset url invalid for: ", entry)
        continue
      }

      const filters = datasetObj.filters || {};

      if (Object.keys(filters).length == 0) {
        console.log("No filters for: " + url)
        add_to_email("No filters for: ", entry)
        continue
      }


      for (const [filterKey, filterUrl] of Object.entries(filters)) {
        let filterFunc

        try {
          const filter = await fetchUrlData(filterUrl, "filter")
          filterFunc = Function(filter)()
        } catch (err) {
          console.log("Filter url invalid for: " + url)
          add_to_email("Filter url invalid for: ", entry)
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
          add_to_email("Filter is invalid for: ", entry)
          console.log("No validation result for " + url)
        }
      }
    }

  }
  // if (invalid_entry_count > 0)
  //   send_notification()
  console.log(email_message)

  
  return result
}

const fetchUrlData = async (urlParam, type) => {

  const res = await axios({
    url: urlParam,
    method: 'GET',
    responseType: 'blob',
  })

  if (["schema", "dataset"].includes(type) && !(res.headers.get("Content-Type").includes('application/json') || urlParam.endsWith("json"))) {
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
    } = filter(dataset, {schema:schema, library:stdLib, JSONvalidator: v}) || {}

    // update needed only when errors are returned
    if (errors.length > 0) {
      const conformSchema = !errors.some(error => error.type === 'validation')
      const correctness = Math.round((data.length / (data.length + errors.length)) * 1000) / 1000
      return [conformSchema, correctness]
    }
  } catch (err) {
    console.log("Filter is invalid with the following error: " + err)
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
get_entries()
  .then((entries_from_data_json) => {
    test_update(entries_from_data_json)
  })
  .catch((error) => {
    console.error(error);
  });

// Data from hardcoded test entries
// validateEntries(test_entries)
// test_update(test_data)
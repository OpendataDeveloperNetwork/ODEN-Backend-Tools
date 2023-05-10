const {
  default: axios
} = require("axios");
const dotenv = require('dotenv');

dotenv.config(); // For the .env file

const validator = require('jsonschema').Validator

const updateFile = require('./update_github').updateFile;

const test_data = require('./test_data.js').test_entries

const data = `[{"registryid": 8, "title_of_work": "", "artistprojectstatement": null, "type": "Figurative", "status": "In place", "sitename": "Bentall Bldg.", "siteaddress": "501 Burrard Street", "primarymaterial": "bronze", "url": "https://covapp.vancouver.ca/PublicArtRegistry/ArtworkDetail.aspx?ArtworkId=8", "photourl": {"exif_orientation": 1, "thumbnail": true, "filename": "LBentallBust.JPG", "width": 1024, "format": "JPEG", "etag": "euTzlThbJ/WmVvgeO7YArg==", "mimetype": "image/jpeg", "id": "474f32613a9576400ec109ba2736fcfd", "last_synchronized": "2023-04-25T12:22:21.990158", "color_summary": ["rgba(91, 89, 71, 1.00)", "rgba(67, 70, 56, 1.00)", "rgba(67, 67, 58, 1.00)"], "height": 1024}, "ownership": "Privately owned", "neighbourhood": "Downtown", "locationonsite": "Moved to plaza level between 555 & 595 Burrard, formerly located between the two towers, above fountain", "geom": {"type": "Feature", "geometry": {"coordinates": [-123.1178, 49.286828], "type": "Point"}, "properties": {}}, "geo_local_area": "Downtown", "descriptionofwork": "This classic bust depicts the entrepreneur Charles Bentall who died in 1974.", "artists": ["241"], "photocredits": null, "yearofinstallation": "1977", "geo_point_2d": {"lon": -123.1178, "lat": 49.286828}},{"registryid": 19, "title_of_work": "Lovers II", "artistprojectstatement": null, "type": "Figurative", "status": "In place", "sitename": "Vancouver City Hall", "siteaddress": "453 West 12th Avenue at Cambie", "primarymaterial": null, "url": "https://covapp.vancouver.ca/PublicArtRegistry/ArtworkDetail.aspx?ArtworkId=19", "photourl": {"thumbnail": true, "filename": "LAW19-1.jpg", "width": 245, "format": "JPEG", "etag": "5atE/NnqkKwWNYZvR7DZDQ==", "mimetype": "image/jpeg", "id": "7fe528956a0df13b4878c2bd592915fa", "last_synchronized": "2023-04-25T12:22:24.521085", "color_summary": ["rgba(130, 142, 110, 1.00)", "rgba(117, 128, 86, 1.00)", "rgba(147, 165, 105, 1.00)"], "height": 370}, "ownership": "City of Vancouver", "neighbourhood": "Mount Pleasant", "locationonsite": "Northwest lawn", "geom": {"type": "Feature", "geometry": {"coordinates": [-123.114522, 49.261439], "type": "Point"}, "properties": {}}, "geo_local_area": "Mount Pleasant", "descriptionofwork": null, "artists": ["244"], "photocredits": null, "yearofinstallation": "1977", "geo_point_2d": {"lon": -123.114522, "lat": 49.261439}}, {"registryid": 21, "title_of_work": "Test 3", "artistprojectstatement": "The sculpture was commissioned by Larry Killam and others interested in improving business in the Gastown area in the early 1970s. Vern Simpson made the sculpture following a drawing by Fritz Jacobson. It was given as a Valentines Day gift to the City.  Then Mayor Tom Campbell threatened to have it hauled away to the city dump.  Vandals later decapitated it but the head was returned for a $50 reward.", "type": "Memorial or monument", "status": "No longer in place", "sitename": "Gastown", "siteaddress": "Carrall, Water & Powell Street", "primarymaterial": "copper stained with muriatic acid", "url": "https://covapp.vancouver.ca/PublicArtRegistry/ArtworkDetail.aspx?ArtworkId=21", "photourl": {"thumbnail": true, "filename": "LAW21-1.jpg", "width": 300, "format": "JPEG", "etag": "FkREe3CuaOcsgCqFkkoQFQ==", "mimetype": "image/jpeg", "id": "c3e6c09a97f347e095fdfd0c6c43de87", "last_synchronized": "2023-04-25T12:22:25.001699", "color_summary": ["rgba(62, 76, 70, 1.00)", "rgba(74, 80, 88, 1.00)", "rgba(69, 70, 86, 1.00)"], "height": 454}, "ownership": "City of Vancouver", "neighbourhood": "Downtown", "locationonsite": null, "geom": {"type": "Feature", "geometry": {"coordinates": [-123.104296, 49.283351], "type": "Point"}, "properties": {}}, "geo_local_area": "Downtown", "descriptionofwork": "This 66 bronze figure standing on a barrel is prominently located in Gastown and commemorates the man for whom Gastown is named. Born in 1830, Gassy Jack Deighton was an adventurer who went to sea and was attracted by the gold rush in California and then in New Caledonia (now British Columbia). He didnt strike it rich and instead became a tax man and a steamboat pilot and later ran a saloon which is why he stands on a whiskey barrel. The Globe Saloon which stood on the site was reputedly built in 24 hours by the thirsty workers. (Vancouver Sun, April 7, 2001, H3) The nickname Gassy Jack came from the fact that he talked so much. (drawn from Old Vancouver Townsite Walking Tour, Footprints Community Art Project, 2001)", "artists": ["134"], "photocredits": "Barbara Cole", "yearofinstallation": "1970", "geo_point_2d": {"lon": -123.104296, "lat": 49.283351}}]`

// Goal for tomorrow:
// TODO: Loop through each object and ensure the schema, dataset, and filter fields exist (log if they do or dont)
// TODO: Fetch the schema, filter, and data from the urls, and ensure they are valid (check to make sure the dataset is json or not ...)


const test_update = async (test_entries) => {
  const validation = await validateEntries(test_entries)
  if (validation)
    updateFile(validation)
}

var email_message = '<p><b>The following filter entries have failed:</b><br><br>'
var short_message = "<p><b>The following filter entries have failed:</b><br><br>1. Filter1</p>"
var email_message_string = '<p><b>The following filter entries have failed:</b><br><br>1. Filter is invalid for: https://data.calgary.ca/d/2kp2-hsy7<br>2. Schema url invalid for: http://opendata-saskatoon.cloudapp.net/<br>3. No filters for: https://opendata.vancouver.ca/explore/dataset/public-art/<br>4. Filter url invalid for: https://www.data.act.gov.au/d/j746-krni<br>5. Filter url invalid for: https://open.hamilton.ca/maps/a0bcdf73598c424d9e7ef72861dca71c_10<br>6. Filter url invalid for: https://data.tempe.gov/maps/tempegov::public-art-sites<br>7. Filter url invalid for: https://data.honolulu.gov/d/yef5-h88r<br></p>'
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


const add_to_email = (message) => {
  invalid_entry_count++
  email_message += invalid_entry_count + '. ' + message + '<br>'

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
      console.log("Schema url invalid for: " + entry.labels.city)
      add_to_email("Schema url invalid for: " + entry.labels.city)
      continue
    }

    const datasets = entry.data.datasets || {}

    if (Object.keys(datasets).length == 0) {
      console.log("No datasets for: " + entry.labels.city)
      add_to_email("No datasets for: " + entry.labels.city)
      continue
    }


    for (const [datasetKey, datasetObj] of Object.entries(datasets)) {
      const datasetUrl = datasetObj.url || {};

      let dataset
      try {
        dataset = await fetchUrlData(datasetUrl, "dataset")
      } catch (err) {
        console.log("Dataset url invalid for: " + entry.url)
        add_to_email("Dataset url invalid for: " + entry.labels.city)
        continue
      }

      const filters = datasetObj.filters || {};

      if (Object.keys(filters).length == 0) {
        console.log("No filters for: " + url)
        add_to_email("No filters for: " + entry.labels.city)
        continue
      }


      for (const [filterKey, filterUrl] of Object.entries(filters)) {
        let filter

        try {
          filter = await fetchUrlData(filterUrl, "filter")
          filterFunc = Function(filter)()
        } catch (err) {
          console.log("Filter url invalid for: " + url)
          add_to_email("Filter url invalid for: " + entry.labels.city)
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
          add_to_email("Filter is invalid for: " + entry.labels.city)
          console.log("No validation result.")
        }
      }
    }

  }
  if (invalid_entry_count > 0)
    send_notification()
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
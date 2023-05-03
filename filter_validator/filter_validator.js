const {
  default: axios
} = require("axios");
const validator = require('jsonschema').Validator;

const filter_blob = `const filter = function (data, std_lib, params) {
  // check for standard library and pull out required functions
  if (!std_lib) {
      throw "standard library not provided";
  }
  let add_required = std_lib.get("add_required");
  let add_if_not_null = std_lib.get("add_if_not_null")
  let remove_if_null = std_lib.get("remove_if_null");
  let remove_if_empty = std_lib.get("remove_if_empty");
  let validate_params = std_lib.get("validate_params");
  
  // validate parameters object
  params = validate_params(params);
 
  // convert JSON data to object form
  if (typeof data === 'string' || data instanceof String) {
      data = JSON.parse(data);
  }
  
  // define new data and errors array
  let total_entries = 0;
  let new_data = [];
  let errors = [];

  // iterate through each data entry
  data.map(d => {
      let item = {};
      let skip = false;
      total_entries++;
      
      // add name (required)
      if (!add_required(item, "name", d, d.title_of_work, params.skip_errors, errors)) {
          skip = true;
      }
  
      // add coordinates (required)
      let coordinates = {};
      if (!add_required(coordinates, "longitude", d, d.geo_point_2d?.lon, params.skip_errors, errors)) {
          skip = true;
      }
      if (!add_required(coordinates, "latitude", d, d.geo_point_2d?.lat, params.skip_errors, errors)) {
          skip = true;
      }
      item.coordinates = coordinates;

      // add optional fields

      // add details sequentially example
      item.details = {};
      add_if_not_null(item.details, "description", d.descriptionofwork);
      add_if_not_null(item.details, "artists_description", d.artistprojectstatement);
      
      // reset details for batch example
      item.details = {};

      // add details batch example
      item.details.description = d.descriptionofwork;
      item.details.artists_description = d.artistprojectstatement;
      item.details = remove_if_null(item.details);
      
      // check for and remove empty details object
      remove_if_empty(item, "details");
  
      // skip adding to new data if required field not found
      if (!skip) {
          new_data.push(item);
      }
  })

  // check if errors occurred
  if (errors.length > 0) {
      let err = {message: "data entries missing required field(s) during filtering", total_entries: total_entries, num_errors: errors.length, errors: errors};
      throw err;
  }

  // validate new data against a schema
  if (params.validate) {
      new_data.map(d => {
          params.validator.validate(d, params.schema, {required: true, throwAll: true});
      })
  }

  // return data and convert to string if enabled
  if (params.stringify) {
      return JSON.stringify(new_data, null);
  }

  return new_data;
}
return filter;`;

const data = `[{"registryid": 8, "title_of_work": "", "artistprojectstatement": null, "type": "Figurative", "status": "In place", "sitename": "Bentall Bldg.", "siteaddress": "501 Burrard Street", "primarymaterial": "bronze", "url": "https://covapp.vancouver.ca/PublicArtRegistry/ArtworkDetail.aspx?ArtworkId=8", "photourl": {"exif_orientation": 1, "thumbnail": true, "filename": "LBentallBust.JPG", "width": 1024, "format": "JPEG", "etag": "euTzlThbJ/WmVvgeO7YArg==", "mimetype": "image/jpeg", "id": "474f32613a9576400ec109ba2736fcfd", "last_synchronized": "2023-04-25T12:22:21.990158", "color_summary": ["rgba(91, 89, 71, 1.00)", "rgba(67, 70, 56, 1.00)", "rgba(67, 67, 58, 1.00)"], "height": 1024}, "ownership": "Privately owned", "neighbourhood": "Downtown", "locationonsite": "Moved to plaza level between 555 & 595 Burrard, formerly located between the two towers, above fountain", "geom": {"type": "Feature", "geometry": {"coordinates": [-123.1178, 49.286828], "type": "Point"}, "properties": {}}, "geo_local_area": "Downtown", "descriptionofwork": "This classic bust depicts the entrepreneur Charles Bentall who died in 1974.", "artists": ["241"], "photocredits": null, "yearofinstallation": "1977", "geo_point_2d": {"lon": -123.1178, "lat": 49.286828}},{"registryid": 19, "title_of_work": "Lovers II", "artistprojectstatement": null, "type": "Figurative", "status": "In place", "sitename": "Vancouver City Hall", "siteaddress": "453 West 12th Avenue at Cambie", "primarymaterial": null, "url": "https://covapp.vancouver.ca/PublicArtRegistry/ArtworkDetail.aspx?ArtworkId=19", "photourl": {"thumbnail": true, "filename": "LAW19-1.jpg", "width": 245, "format": "JPEG", "etag": "5atE/NnqkKwWNYZvR7DZDQ==", "mimetype": "image/jpeg", "id": "7fe528956a0df13b4878c2bd592915fa", "last_synchronized": "2023-04-25T12:22:24.521085", "color_summary": ["rgba(130, 142, 110, 1.00)", "rgba(117, 128, 86, 1.00)", "rgba(147, 165, 105, 1.00)"], "height": 370}, "ownership": "City of Vancouver", "neighbourhood": "Mount Pleasant", "locationonsite": "Northwest lawn", "geom": {"type": "Feature", "geometry": {"coordinates": [-123.114522, 49.261439], "type": "Point"}, "properties": {}}, "geo_local_area": "Mount Pleasant", "descriptionofwork": null, "artists": ["244"], "photocredits": null, "yearofinstallation": "1977", "geo_point_2d": {"lon": -123.114522, "lat": 49.261439}}, {"registryid": 21, "title_of_work": "Test 3", "artistprojectstatement": "The sculpture was commissioned by Larry Killam and others interested in improving business in the Gastown area in the early 1970s. Vern Simpson made the sculpture following a drawing by Fritz Jacobson. It was given as a Valentines Day gift to the City.  Then Mayor Tom Campbell threatened to have it hauled away to the city dump.  Vandals later decapitated it but the head was returned for a $50 reward.", "type": "Memorial or monument", "status": "No longer in place", "sitename": "Gastown", "siteaddress": "Carrall, Water & Powell Street", "primarymaterial": "copper stained with muriatic acid", "url": "https://covapp.vancouver.ca/PublicArtRegistry/ArtworkDetail.aspx?ArtworkId=21", "photourl": {"thumbnail": true, "filename": "LAW21-1.jpg", "width": 300, "format": "JPEG", "etag": "FkREe3CuaOcsgCqFkkoQFQ==", "mimetype": "image/jpeg", "id": "c3e6c09a97f347e095fdfd0c6c43de87", "last_synchronized": "2023-04-25T12:22:25.001699", "color_summary": ["rgba(62, 76, 70, 1.00)", "rgba(74, 80, 88, 1.00)", "rgba(69, 70, 86, 1.00)"], "height": 454}, "ownership": "City of Vancouver", "neighbourhood": "Downtown", "locationonsite": null, "geom": {"type": "Feature", "geometry": {"coordinates": [-123.104296, 49.283351], "type": "Point"}, "properties": {}}, "geo_local_area": "Downtown", "descriptionofwork": "This 66 bronze figure standing on a barrel is prominently located in Gastown and commemorates the man for whom Gastown is named. Born in 1830, Gassy Jack Deighton was an adventurer who went to sea and was attracted by the gold rush in California and then in New Caledonia (now British Columbia). He didnt strike it rich and instead became a tax man and a steamboat pilot and later ran a saloon which is why he stands on a whiskey barrel. The Globe Saloon which stood on the site was reputedly built in 24 hours by the thirsty workers. (Vancouver Sun, April 7, 2001, H3) The nickname Gassy Jack came from the fact that he talked so much. (drawn from Old Vancouver Townsite Walking Tour, Footprints Community Art Project, 2001)", "artists": ["134"], "photocredits": "Barbara Cole", "yearofinstallation": "1970", "geo_point_2d": {"lon": -123.104296, "lat": 49.283351}}]`

const test_validate = async function () {
  let schema = await axios({
    url: "https://raw.githubusercontent.com/OpendataDeveloperNetwork/ODEN-Transmogrifiers/main/schemas/public-art.json",
    method: 'GET',
    responseType: 'blob',
  })

  let std_lib_raw = await axios({
    url: "https://raw.githubusercontent.com/OpendataDeveloperNetwork/ODEN-Transmogrifiers/dev/libraries/standard.js",
    method: 'GET',
    responseType: 'blob',
  })
  const std_lib = new Function(std_lib_raw.data)();

  const v = new validator();

  const filter = new Function(filter_blob)();

  let my_new_data;
  try {
    my_new_data = filter(data, std_lib, {
      stringify: false,
      skip_errors: false,
      schema: schema.data,
      validator: v
    });
    console.log(my_new_data);
  } catch (err) {
    console.log(err);
  }
}

test_validate();
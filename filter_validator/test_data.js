// 0 and 2 are valid and should run the filters, 1 and 3 are invalid since they miss some fields
const test_entries = [
  {
    url: "https://data.calgary.ca/d/2kp2-hsy7", // landing page
    labels: {
      category: "public-art",
      country: "Canada",
      region: "Alberta",
      city: "Calgary",
    },
    data: {
      schema:
        "https://raw.githubusercontent.com/OpendataDeveloperNetwork/ODEN-Transmogrifiers/dev/schemas/public-art.json", // schema
      datasets: {
        json: {
          url: "https://data.calgary.ca/resource/2kp2-hsy7.json", // dataset
          filters: {
            json: "https://raw.githubusercontent.com/OpendataDeveloperNetwork/ODEN-Transmogrifiers/dev/filters/canada/alberta/calgary/public-art-json-to-json.js", // filter
          },
        },
      },
    },
  },
  {
    url: "http://opendata-saskatoon.cloudapp.net/",
    labels: {
      category: "",
      country: "Canada",
      region: "Saskatchewan",
      city: "Saskatoon",
    },
    data: {
      schema: "",
      datasets: {},
    },
  },
  {
    url: "https://data-cityofpg.opendata.arcgis.com/maps/CityofPG::public-art", // landing page
    labels: {
      category: "public-art",
      country: "Canada",
      region: "British Columbia",
      city: "Prince George",
    },
    data: {
      schema:
        "https://raw.githubusercontent.com/OpendataDeveloperNetwork/ODEN-Transmogrifiers/dev/schemas/public-art.json", // schema
      datasets: {
        geojson: {
          url: "https://services2.arcgis.com/CnkB6jCzAsyli34z/arcgis/rest/services/OpenData_Parks/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson", // dataset
          filters: {
            json: "https://raw.githubusercontent.com/OpendataDeveloperNetwork/ODEN-Transmogrifiers/dev/filters/canada/british-columbia/prince-george/public-art-geojson-to-json.js", // filter
          },
        },
      },
    },
  },
  {
    url: "https://opendata.vancouver.ca/explore/dataset/public-art/", // landing page
    labels: {
      category: "public-art",
      country: "Canada",
      region: "British Columbia",
      city: "Vancouver",
    },
    data: {
      schema:
        "https://raw.githubusercontent.com/OpendataDeveloperNetwork/ODEN-Transmogrifiers/dev/schemas/public-art.json", // schema
      datasets: {
        json: {
          url: "https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/public-art/exports/json?lang=en&timezone=America%2FLos_Angeles", // dataset", // dataset
          filters: {},
        },
      },
    },
  },
  {
    url: "https://www.data.act.gov.au/d/j746-krni",
    labels: {
      category: "public-art",
      country: "Australia",
      region: "Australian Capital Territory",
      city: "Canberra",
    },
    data: {
      schema:
        "https://raw.githubusercontent.com/OpendataDeveloperNetwork/ODEN-Transmogrifiers/dev/schemas/public-art.json",
      datasets: {
        json: {
          url: "https://www.data.act.gov.au/resource/j746-krni.json",
          filters: {
            json: "https://raw.githubusercontent.com/OpendataDeveloperNetwork/ODEN-Transmogrifiers/dev/filters/australia/australian-capital-territory/canberra/public-art-json-to-json.js",
          },
        },
      },
    },
  },
  {
    url: "https://open.hamilton.ca/maps/a0bcdf73598c424d9e7ef72861dca71c_10",
    labels: {
      category: "public-art",
      country: "Canada",
      region: "Ontario",
      city: "Hamilton",
    },
    data: {
      schema:
        "https://raw.githubusercontent.com/OpendataDeveloperNetwork/ODEN-Transmogrifiers/dev/schemas/public-art.json",
      datasets: {
        json: {
          url: "https://spatialsolutions.hamilton.ca/webgis/rest/services/OpenData/Tabular_Collection_3/MapServer/10/query?outFields=*&where=1%3D1&f=json",
          filters: {
            json: "https://raw.githubusercontent.com/OpendataDeveloperNetwork/ODEN-Transmogrifiers/dev/filters/canada/ontario/hamilton/public-art-json-to-json.js",
          },
        },
      },
    },
  },
  {
    url: "https://data.tempe.gov/maps/tempegov::public-art-sites",
    labels: {
      category: "public-art",
      country: "United States",
      region: "Arizona",
      city: "Tempe",
    },
    data: {
      schema:
        "https://raw.githubusercontent.com/OpendataDeveloperNetwork/ODEN-Transmogrifiers/dev/schemas/public-art.json",
      datasets: {
        json: {
          url: "https://services.arcgis.com/lQySeXwbBg53XWDi/arcgis/rest/services/Public_Art_Sites/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson",
          filters: {
            json: "https://raw.githubusercontent.com/OpendataDeveloperNetwork/ODEN-Transmogrifiers/dev/filters/united-states/arizona/tempe/public-art-geojson-to-json.js",
          },
        },
      },
    },
  },
  {
    url: "https://data.honolulu.gov/d/yef5-h88r",
    labels: {
      category: "public-art",
      country: "United States",
      region: "Hawaii",
      city: "Honolulu",
    },
    data: {
      schema:
        "https://raw.githubusercontent.com/OpendataDeveloperNetwork/ODEN-Transmogrifiers/dev/schemas/public-art.json",
      datasets: {
        json: {
          url: "https://data.honolulu.gov/resource/yef5-h88r.json",
          filters: {
            json: "https://raw.githubusercontent.com/OpendataDeveloperNetwork/ODEN-Transmogrifiers/dev/filters/united-states/hawaii/honolulu/public-art-json-to-json.js",
          },
        },
      },
    },
  },
];

const test_metadata = [
  {
    url: "https://data-cityofpg.opendata.arcgis.com/maps/CityofPG::public-art",
    labels: {
      categorized: false,
      hasCountry: true,
      hasRegion: true,
      hasCity: true,
      isFilterable: false,
      landingUrl404d: false,
    },
    data: {
      conformSchema: true,
      schema404d: false,
      datasets: {},
    },
    info: {
      hasEmail: true,
      hasName: true,
      submissionTime: 1683156831392,
    },
  },
  {
    url: "https://data.calgary.ca/d/2kp2-hsy7",
    labels: {
      categorized: false,
      hasCountry: true,
      hasRegion: true,
      hasCity: true,
      isFilterable: false,
      landingUrl404d: false,
    },
    data: {
      conformSchema: false,
      schema404d: false,
      datasets: {},
    },
    info: {
      hasEmail: true,
      hasName: true,
      submissionTime: 1683156831392,
    },
  },
  {
    url: "http://opendata-saskatoon.cloudapp.net/",
    labels: {
      categorized: false,
      hasCountry: true,
      hasRegion: true,
      hasCity: true,
      isFilterable: false,
      landingUrl404d: false,
    },
    data: {
      conformSchema: false,
      schema404d: false,
      datasets: {},
    },
    info: {
      hasEmail: true,
      hasName: true,
      submissionTime: 1683156831392,
    },
  },
  {
    url: "https://opendata.vancouver.ca/explore/dataset/public-art/",
    labels: {
      categorized: false,
      hasCountry: true,
      hasRegion: true,
      hasCity: true,
      isFilterable: false,
      landingUrl404d: false,
    },
    data: {
      conformSchema: false,
      schema404d: false,
      datasets: {},
    },
    info: {
      hasEmail: true,
      hasName: true,
      submissionTime: 1683156831392,
    },
  },
  {
    url: "https://www.data.act.gov.au/d/j746-krni",
    labels: {
      categorized: false,
      hasCountry: true,
      hasRegion: true,
      hasCity: true,
      isFilterable: false,
      landingUrl404d: false,
    },
    data: {
      conformSchema: false,
      schema404d: false,
      datasets: {},
    },
    info: {
      hasEmail: true,
      hasName: true,
      submissionTime: 1683156831392,
    },
  },
  {
    url: "https://open.hamilton.ca/maps/a0bcdf73598c424d9e7ef72861dca71c_10",
    labels: {
      categorized: false,
      hasCountry: true,
      hasRegion: true,
      hasCity: true,
      isFilterable: false,
      landingUrl404d: false,
    },
    data: {
      conformSchema: false,
      schema404d: false,
      datasets: {},
    },
    info: {
      hasEmail: true,
      hasName: true,
      submissionTime: 1683156831392,
    },
  },
  {
    url: "https://data.tempe.gov/maps/tempegov::public-art-sites",
    labels: {
      categorized: false,
      hasCountry: true,
      hasRegion: true,
      hasCity: true,
      isFilterable: false,
      landingUrl404d: false,
    },
    data: {
      conformSchema: false,
      schema404d: false,
      datasets: {},
    },
    info: {
      hasEmail: true,
      hasName: true,
      submissionTime: 1683156831392,
    },
  },
  {
    url: "https://data.honolulu.gov/d/yef5-h88r",
    labels: {
      categorized: false,
      hasCountry: true,
      hasRegion: true,
      hasCity: true,
      isFilterable: false,
      landingUrl404d: false,
    },
    data: {
      conformSchema: false,
      schema404d: false,
      datasets: {"json":{"filters":{}}},
    },
    info: {
      hasEmail: true,
      hasName: true,
      submissionTime: 1683156831392,
    },
  },
  {
    url: "https://data.calgary.ca/Recreation-and-Culture/Public-Art/2kp2-hsy7",
    labels: {
      categorized: false,
      hasCountry: true,
      hasRegion: true,
      hasCity: true,
      isFilterable: false,
      landingUrl404d: false,
    },
    data: {
      conformSchema: false,
      schema404d: false,
      datasets: {},
    },
    info: {
      hasEmail: true,
      hasName: true,
      submissionTime: 1683156831392,
    },
  },
  {
    url: "https://open-kitchenergis.opendata.arcgis.com/maps/KitchenerGIS::public-art-and-industrial-artifacts",
    labels: {
      categorized: false,
      hasCountry: true,
      hasRegion: true,
      hasCity: true,
      isFilterable: false,
      landingUrl404d: false,
    },
    data: {
      conformSchema: false,
      schema404d: false,
      datasets: {},
    },
    info: {
      hasEmail: true,
      hasName: true,
      submissionTime: 1683156831392,
    },
  },
  {
    url: "https://data.mississauga.ca/maps/mississauga::public-art-locations-permanent",
    labels: {
      categorized: false,
      hasCountry: true,
      hasRegion: true,
      hasCity: true,
      isFilterable: false,
      landingUrl404d: false,
    },
    data: {
      conformSchema: false,
      schema404d: false,
      datasets: {},
    },
    info: {
      hasEmail: true,
      hasName: true,
      submissionTime: 1683156831392,
    },
  },
  {
    url: "https://data.sfgov.org/Culture-and-Recreation/Public-Art-from-1-Art-Program-/cf6e-9e4j",
    labels: {
      categorized: false,
      hasCountry: true,
      hasRegion: true,
      hasCity: true,
      isFilterable: false,
      landingUrl404d: false,
    },
    data: {
      conformSchema: false,
      schema404d: false,
      datasets: {},
    },
    info: {
      hasEmail: true,
      hasName: true,
      submissionTime: 1683156831392,
    },
  },
  {
    url: "https://data.weho.org/Art/Urban-Art-Locations/twt6-v6gc",
    labels: {
      categorized: false,
      hasCountry: true,
      hasRegion: true,
      hasCity: true,
      isFilterable: false,
      landingUrl404d: false,
    },
    data: {
      conformSchema: false,
      schema404d: false,
      datasets: {},
    },
    info: {
      hasEmail: true,
      hasName: true,
      submissionTime: 1683156831392,
    },
  },
  {
    url: "https://data.honolulu.gov/d/yef5-h88r",
    labels: {
      categorized: false,
      hasCountry: true,
      hasRegion: true,
      hasCity: true,
      isFilterable: false,
      landingUrl404d: false,
    },
    data: {
      conformSchema: false,
      schema404d: false,
      datasets: {},
    },
    info: {
      hasEmail: true,
      hasName: true,
      submissionTime: 1683156831392,
    },
  },
  {
    url: "https://data.cityofchicago.org/d/sj6t-9cju",
    labels: {
      categorized: false,
      hasCountry: true,
      hasRegion: true,
      hasCity: true,
      isFilterable: false,
      landingUrl404d: false,
    },
    data: {
      conformSchema: false,
      schema404d: false,
      datasets: {},
    },
    info: {
      hasEmail: true,
      hasName: true,
      submissionTime: 1683156831392,
    },
  },
  {
    url: "https://data.honolulu.gov/d/yef5-h88r",
    labels: {
      categorized: false,
      hasCountry: true,
      hasRegion: true,
      hasCity: true,
      isFilterable: false,
      landingUrl404d: false,
    },
    data: {
      conformSchema: false,
      schema404d: false,
      datasets: {},
    },
    info: {
      hasEmail: true,
      hasName: true,
      submissionTime: 1683156831392,
    },
  },
  {
    url: "https://geohub.cambridge.ca/maps/KitchenerGIS::public-art-and-industrial-artifacts",
    labels: {
      categorized: false,
      hasCountry: true,
      hasRegion: true,
      hasCity: true,
      isFilterable: false,
      landingUrl404d: false,
    },
    data: {
      conformSchema: false,
      schema404d: false,
      datasets: {},
    },
    info: {
      hasEmail: true,
      hasName: true,
      submissionTime: 1683156831392,
    },
  },
  {
    url: "https://data.cityofnewyork.us/Housing-Development/Public-Design-Commission-Outdoor-Public-Art-Invent/2pg3-gcaa",
    labels: {
      categorized: false,
      hasCountry: true,
      hasRegion: true,
      hasCity: true,
      isFilterable: false,
      landingUrl404d: false,
    },
    data: {
      conformSchema: false,
      schema404d: false,
      datasets: {},
    },
    info: {
      hasEmail: true,
      hasName: true,
      submissionTime: 1683156831392,
    },
  },
  {
    url: "https://data.syr.gov/datasets/8984543a51234cc89b62158e0622b235_0/explore?location=43.036548%2C-76.156383%2C13.84&showTable=true",
    labels: {
      categorized: false,
      hasCountry: true,
      hasRegion: true,
      hasCity: true,
      isFilterable: false,
      landingUrl404d: false,
    },
    data: {
      conformSchema: false,
      schema404d: false,
      datasets: {},
    },
    info: {
      hasEmail: true,
      hasName: true,
      submissionTime: 1683156831392,
    },
  },
  {
    url: "https://data-avl.opendata.arcgis.com/datasets/a80df375f1c0424abcb88bdd474f73f7_0/about",
    labels: {
      categorized: false,
      hasCountry: true,
      hasRegion: true,
      hasCity: true,
      isFilterable: false,
      landingUrl404d: false,
    },
    data: {
      conformSchema: false,
      schema404d: false,
      datasets: {},
    },
    info: {
      hasEmail: true,
      hasName: true,
      submissionTime: 1683156831392,
    },
  },
  {
    url: "https://data.charlottenc.gov/maps/charlotte::public-art-4",
    labels: {
      categorized: false,
      hasCountry: true,
      hasRegion: true,
      hasCity: true,
      isFilterable: false,
      landingUrl404d: false,
    },
    data: {
      conformSchema: false,
      schema404d: false,
      datasets: {},
    },
    info: {
      hasEmail: true,
      hasName: true,
      submissionTime: 1683156831392,
    },
  },
  {
    url: "https://data-avl.opendata.arcgis.com/datasets/a80df375f1c0424abcb88bdd474f73f7_0/about",
    labels: {
      categorized: false,
      hasCountry: true,
      hasRegion: true,
      hasCity: true,
      isFilterable: false,
      landingUrl404d: false,
    },
    data: {
      conformSchema: false,
      schema404d: false,
      datasets: {},
    },
    info: {
      hasEmail: true,
      hasName: true,
      submissionTime: 1683156831392,
    },
  },
  {
    url: "https://data.austintexas.gov/dataset/City-of-Austin-Public-Art-Collection/uuk6-933w",
    labels: {
      categorized: false,
      hasCountry: true,
      hasRegion: true,
      hasCity: true,
      isFilterable: false,
      landingUrl404d: false,
    },
    data: {
      conformSchema: false,
      schema404d: false,
      datasets: {},
    },
    info: {
      hasEmail: true,
      hasName: true,
      submissionTime: 1683156831392,
    },
  },
  {
    url: "https://data.norfolk.gov/Government/Public-Art/k8ry-iqjg",
    labels: {
      categorized: false,
      hasCountry: true,
      hasRegion: true,
      hasCity: true,
      isFilterable: false,
      landingUrl404d: false,
    },
    data: {
      conformSchema: false,
      schema404d: false,
      datasets: {},
    },
    info: {
      hasEmail: true,
      hasName: true,
      submissionTime: 1683156831392,
    },
  },
  {
    url: "https://data.seattle.gov/Community/Public-Art-Data/j7sn-tdzk",
    labels: {
      categorized: false,
      hasCountry: true,
      hasRegion: true,
      hasCity: true,
      isFilterable: false,
      landingUrl404d: false,
    },
    data: {
      conformSchema: false,
      schema404d: false,
      datasets: {},
    },
    info: {
      hasEmail: true,
      hasName: true,
      submissionTime: 1683156831392,
    },
  },
];

const data = `[{"registryid": 8, "title_of_work": "", "artistprojectstatement": null, "type": "Figurative", "status": "In place", "sitename": "Bentall Bldg.", "siteaddress": "501 Burrard Street", "primarymaterial": "bronze", "url": "https://covapp.vancouver.ca/PublicArtRegistry/ArtworkDetail.aspx?ArtworkId=8", "photourl": {"exif_orientation": 1, "thumbnail": true, "filename": "LBentallBust.JPG", "width": 1024, "format": "JPEG", "etag": "euTzlThbJ/WmVvgeO7YArg==", "mimetype": "image/jpeg", "id": "474f32613a9576400ec109ba2736fcfd", "last_synchronized": "2023-04-25T12:22:21.990158", "color_summary": ["rgba(91, 89, 71, 1.00)", "rgba(67, 70, 56, 1.00)", "rgba(67, 67, 58, 1.00)"], "height": 1024}, "ownership": "Privately owned", "neighbourhood": "Downtown", "locationonsite": "Moved to plaza level between 555 & 595 Burrard, formerly located between the two towers, above fountain", "geom": {"type": "Feature", "geometry": {"coordinates": [-123.1178, 49.286828], "type": "Point"}, "properties": {}}, "geo_local_area": "Downtown", "descriptionofwork": "This classic bust depicts the entrepreneur Charles Bentall who died in 1974.", "artists": ["241"], "photocredits": null, "yearofinstallation": "1977", "geo_point_2d": {"lon": -123.1178, "lat": 49.286828}},{"registryid": 19, "title_of_work": "Lovers II", "artistprojectstatement": null, "type": "Figurative", "status": "In place", "sitename": "Vancouver City Hall", "siteaddress": "453 West 12th Avenue at Cambie", "primarymaterial": null, "url": "https://covapp.vancouver.ca/PublicArtRegistry/ArtworkDetail.aspx?ArtworkId=19", "photourl": {"thumbnail": true, "filename": "LAW19-1.jpg", "width": 245, "format": "JPEG", "etag": "5atE/NnqkKwWNYZvR7DZDQ==", "mimetype": "image/jpeg", "id": "7fe528956a0df13b4878c2bd592915fa", "last_synchronized": "2023-04-25T12:22:24.521085", "color_summary": ["rgba(130, 142, 110, 1.00)", "rgba(117, 128, 86, 1.00)", "rgba(147, 165, 105, 1.00)"], "height": 370}, "ownership": "City of Vancouver", "neighbourhood": "Mount Pleasant", "locationonsite": "Northwest lawn", "geom": {"type": "Feature", "geometry": {"coordinates": [-123.114522, 49.261439], "type": "Point"}, "properties": {}}, "geo_local_area": "Mount Pleasant", "descriptionofwork": null, "artists": ["244"], "photocredits": null, "yearofinstallation": "1977", "geo_point_2d": {"lon": -123.114522, "lat": 49.261439}}, {"registryid": 21, "title_of_work": "Test 3", "artistprojectstatement": "The sculpture was commissioned by Larry Killam and others interested in improving business in the Gastown area in the early 1970s. Vern Simpson made the sculpture following a drawing by Fritz Jacobson. It was given as a Valentines Day gift to the City.  Then Mayor Tom Campbell threatened to have it hauled away to the city dump.  Vandals later decapitated it but the head was returned for a $50 reward.", "type": "Memorial or monument", "status": "No longer in place", "sitename": "Gastown", "siteaddress": "Carrall, Water & Powell Street", "primarymaterial": "copper stained with muriatic acid", "url": "https://covapp.vancouver.ca/PublicArtRegistry/ArtworkDetail.aspx?ArtworkId=21", "photourl": {"thumbnail": true, "filename": "LAW21-1.jpg", "width": 300, "format": "JPEG", "etag": "FkREe3CuaOcsgCqFkkoQFQ==", "mimetype": "image/jpeg", "id": "c3e6c09a97f347e095fdfd0c6c43de87", "last_synchronized": "2023-04-25T12:22:25.001699", "color_summary": ["rgba(62, 76, 70, 1.00)", "rgba(74, 80, 88, 1.00)", "rgba(69, 70, 86, 1.00)"], "height": 454}, "ownership": "City of Vancouver", "neighbourhood": "Downtown", "locationonsite": null, "geom": {"type": "Feature", "geometry": {"coordinates": [-123.104296, 49.283351], "type": "Point"}, "properties": {}}, "geo_local_area": "Downtown", "descriptionofwork": "This 66 bronze figure standing on a barrel is prominently located in Gastown and commemorates the man for whom Gastown is named. Born in 1830, Gassy Jack Deighton was an adventurer who went to sea and was attracted by the gold rush in California and then in New Caledonia (now British Columbia). He didnt strike it rich and instead became a tax man and a steamboat pilot and later ran a saloon which is why he stands on a whiskey barrel. The Globe Saloon which stood on the site was reputedly built in 24 hours by the thirsty workers. (Vancouver Sun, April 7, 2001, H3) The nickname Gassy Jack came from the fact that he talked so much. (drawn from Old Vancouver Townsite Walking Tour, Footprints Community Art Project, 2001)", "artists": ["134"], "photocredits": "Barbara Cole", "yearofinstallation": "1970", "geo_point_2d": {"lon": -123.104296, "lat": 49.283351}}]`

module.exports = { test_entries, test_metadata };

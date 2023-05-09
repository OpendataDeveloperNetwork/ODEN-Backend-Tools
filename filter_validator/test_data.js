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
            json: "https://github.com/OpendataDeveloperNetwork/ODEN-Transmogrifiers/blob/dev/filters/australia/australian-capital-territory/canberra/public-art-json-to-json.js",
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
            json: "https://github.com/OpendataDeveloperNetwork/ODEN-Transmogrifiers/blob/dev/filters/canada/ontario/hamilton/public-art-json-to-json.js",
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
            json: "https://github.com/OpendataDeveloperNetwork/ODEN-Transmogrifiers/blob/dev/filters/united-states/arizona/tempe/public-art-geojson-to-json.js",
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
            json: "https://github.com/OpendataDeveloperNetwork/ODEN-Transmogrifiers/blob/dev/filters/united-states/hawaii/honolulu/public-art-json-to-json.js",
          },
        },
      },
    },
  },
];

const test_metadata = [
  {
    id: "gSyuSab7AdnwIZq2qzm1",
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
    id: "gSyuSab7AdnwIZq2qzm1",
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
    id: "gSyuSab7AdnwIZq2qzm1",
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
    id: "gSyuSab7AdnwIZq2qzm1",
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
    id: "gSyuSab7AdnwIZq2qzm1",
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
    id: "gSyuSab7AdnwIZq2qzm1",
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
    id: "gSyuSab7AdnwIZq2qzm1",
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
    id: "gSyuSab7AdnwIZq2qzm1",
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
];

module.exports = { test_entries, test_metadata };

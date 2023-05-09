const updateFile = (new_content) => {
  const owner = 'OpendataDeveloperNetwork';
  const repo = 'ODEN-Client';
  const file_path = 'metadata.json';
  // const new_content = { cor: 21 }; // The new content you want to write to the file
  
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${file_path}`;
  
  // Get the data
  fetch(url)
      .then((res) => res.json())
      .then((data) => {
          const content = Buffer.from(data.content, 'base64').toString();
          const sha = data.sha;
          const message = 'Update test.json';

          try {
            const content_to_update = _generate_updated_content(content, new_content)
            console.log(content_to_update)
          } catch (err) {
            console.log(err)
          }
  
          // const new_file_content = { ...JSON.parse(content), ...new_content };
          // const new_file_content_str = JSON.stringify(new_file_content, null, 2);
          // const new_file_content_base64 = Buffer.from(new_file_content_str).toString('base64');

          
  
          // fetch(url, {
          //     method: 'PUT',
          //     headers: {
          //         'Content-Type': 'application/json',
          //         Accept: 'application/vnd.github+json',
          //         Authorization: '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'
          //     },
          //     body: JSON.stringify({
          //         message: message,
          //         content: new_file_content_base64,
          //         sha: sha
          //     })
          // })
          //     .then((res) => res.json())
          //     .then((data) => {
          //         console.log(`File ${file_path} in ${owner}/${repo} repository has been updated. Response:`, data);
          //     })
          //     .catch((err) => {
          //         console.error(`Error updating file ${file_path} in ${owner}/${repo} repository:`, err);
          //     });
      })
      .catch((err) => {
          console.error(`Error fetching file ${file_path} in ${owner}/${repo} repository:`, err);
      });
}

// updateFile({})

const _generate_updated_content = (content, new_content) => {
  // const data_arr = JSON.parse(content)
            
  const data_arr = test_metadata
  // console.log(data_arr)
  console.log(JSON.stringify(new_content))

  const metadata_map = new Map(
    data_arr.map(data => [data.url, data])
  )
  // console.log(metadata_map.get("https://data-cityofpg.opendata.arcgis.com/maps/CityofPG::public-art").data.datasets)

  let is_update_needed = false

  Object.entries(new_content).forEach(([url, new_data]) => {
    let obj = metadata_map.get(url)

    // if data entry does not exist in metadata.json, do nothing
    if (obj !== undefined) {

      // check if update is needed. update is needed if any data entry in metadata.json has a different conformSchema or correctness value
      if (!is_update_needed) {
        is_update_needed = _check_is_update_needed(obj.data, new_data)
      }

      obj = {
        ...obj,
        data: {
          ...obj.data,
          conformSchema: new_data.conformSchema,
          datasets: { ...new_data.datasets }
        }
      }
      metadata_map.set(url, obj)
    }
  })

  // console.log(metadata_map.get("https://data-cityofpg.opendata.arcgis.com/maps/CityofPG::public-art").data.datasets)

  return [...metadata_map.values()]
}

const _check_is_update_needed = (existing_data, new_data) => {
  if (new_data.conformSchema !== existing_data.conformSchema) {
    return true
  } else {
    const datasetsObj = existing_data.datasets
    for (const [dataset_type, dataset] of Object.entries(new_data.datasets)) {
      for (const [filter_type, filter] of Object.entries(dataset.filters)) {
        if (filter.correctness !== datasetsObj[dataset_type]?.filters?.[filter_type]?.correctness) {
          return true
        }
      }
    }
  }
  return false
}

const test_metadata = 
[
  {
    "id": "gSyuSab7AdnwIZq2qzm1",
    "url": "https://data-cityofpg.opendata.arcgis.com/maps/CityofPG::public-art",
    "labels": {
      "categorized": false,
      "hasCountry": true,
      "hasRegion": true,
      "hasCity": true,
      "isFilterable": false,
      "landingUrl404d": false
    },
    "data": {
      "conformSchema": true,
      "schema404d": false,
      "datasets": {
        "json": {
          "filters": {
            "json": {
                "correctness": 0.99,
              }
          }  
        }
      }
    },
    "info": {
      "hasEmail": true,
      "hasName": true,
      "submissionTime": 1683156831392
    }
  },
  {
    "id": "gSyuSab7AdnwIZq2qzm1",
    "url": "https://data.calgary.ca/d/2kp2-hsy7",
    "labels": {
      "categorized": false,
      "hasCountry": true,
      "hasRegion": true,
      "hasCity": true,
      "isFilterable": false,
      "landingUrl404d": false
    },
    "data": {
      "conformSchema": false,
      "schema404d": false,
      "datasets": {}
    },
    "info": {
      "hasEmail": true,
      "hasName": true,
      "submissionTime": 1683156831392
    }
  },
  {
    "id": "gSyuSab7AdnwIZq2qzm1",
    "url": "https://data.calgary.ca/d/4jah-h97u",
    "labels": {
      "categorized": false,
      "hasCountry": true,
      "hasRegion": true,
      "hasCity": true,
      "isFilterable": false,
      "landingUrl404d": false
    },
    "data": {
      "conformSchema": false,
      "schema404d": false,
      "datasets": {}
    },
    "info": {
      "hasEmail": true,
      "hasName": true,
      "submissionTime": 1683156831392
    }
  },
  {
    "id": "gSyuSab7AdnwIZq2qzm1",
    "url": "https://data.calgary.ca/d/6933-unw5",
    "labels": {
      "categorized": false,
      "hasCountry": true,
      "hasRegion": true,
      "hasCity": true,
      "isFilterable": false,
      "landingUrl404d": false
    },
    "data": {
      "conformSchema": false,
      "schema404d": false,
      "datasets": {}
    },
    "info": {
      "hasEmail": true,
      "hasName": true,
      "submissionTime": 1683156831392
    }
  },
  {
    "id": "gSyuSab7AdnwIZq2qzm1",
    "url": "https://data.calgary.ca/d/c2es-76ed",
    "labels": {
      "categorized": false,
      "hasCountry": true,
      "hasRegion": true,
      "hasCity": true,
      "isFilterable": false,
      "landingUrl404d": false
    },
    "data": {
      "conformSchema": false,
      "schema404d": false,
      "datasets": {}
    },
    "info": {
      "hasEmail": true,
      "hasName": true,
      "submissionTime": 1683156831392
    }
  },
  {
    "id": "gSyuSab7AdnwIZq2qzm1",
    "url": "https://data.calgary.ca/d/tfmd-grpe",
    "labels": {
      "categorized": false,
      "hasCountry": true,
      "hasRegion": true,
      "hasCity": true,
      "isFilterable": false,
      "landingUrl404d": false
    },
    "data": {
      "conformSchema": false,
      "schema404d": false,
      "datasets": {}
    },
    "info": {
      "hasEmail": true,
      "hasName": true,
      "submissionTime": 1683156831392
    }
  }
]

module.exports = { updateFile }



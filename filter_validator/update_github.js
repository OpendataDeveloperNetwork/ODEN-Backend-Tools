const dotenv = require('dotenv');

dotenv.config(); // For the .env file

const test_data = require('./test_data.js').test_metadata

const updateFile = (new_content) => {
  const owner = 'OpendataDeveloperNetwork';
  const repo = 'ODEN-Client';
  const file_path = 'metadata.json';
  
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${file_path}`;
  
  // Get the data
  fetch(url)
      .then((res) => res.json())
      .then((data) => {
          const content = Buffer.from(data.content, 'base64').toString();
          const sha = data.sha;

          const [updated_urls, new_file_content] = _generate_new_file_content(content, new_content)

          if (new_file_content) {
              const new_file_content_str = JSON.stringify(new_file_content, null, 2);
              const new_file_content_base64 = Buffer.from(new_file_content_str).toString('base64');

              //TODO: add identifiers of each updated entry in commit message
              const message = `Updated the following entries in metadata.json: ${updated_urls.join(", ")}`;
      
              fetch(url, {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json',
                      Accept: 'application/vnd.github+json',
                      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
                  },
                  body: JSON.stringify({
                      message: message,
                      content: new_file_content_base64,
                      sha: sha
                  })
              })
              .then((res) => res.json())
              .then((data) => {
                  console.log(`File ${file_path} in ${owner}/${repo} repository has been updated. Response:`, data);
              })
              .catch((err) => {
                  console.error(`Error updating file ${file_path} in ${owner}/${repo} repository:`, err);
              });
          } else {
            console.log("No update needed.")
          }
      })
      .catch((err) => {
          console.error(`Error fetching file ${file_path} in ${owner}/${repo} repository:`, err);
      });
}

// updateFile({})

const _generate_new_file_content = (content, new_content) => {
  const data_arr = JSON.parse(content)
            
  // const data_arr = test_data
  // console.log(data_arr)

  const metadata_map = new Map(
    data_arr.map(data => [data.url, data])
  )
  // console.log(metadata_map.get("https://data-cityofpg.opendata.arcgis.com/maps/CityofPG::public-art").data.datasets)
  // console.log(metadata_map)

  // file update is needed if any data entry in metadata.json has a different conformSchema or correctness value
  let is_file_update_needed = false
  const updated_entries_urls = []

  Object.entries(new_content).forEach(([url, new_data]) => {
    const obj = metadata_map.get(url)

    // if data entry does not exist in metadata.json, do nothing
    if (obj !== undefined) {

      // check if update is needed for each entry. 
      const is_entry_update_needed = _check_is_update_needed(obj.data, new_data)
      is_file_update_needed = is_file_update_needed || is_entry_update_needed

      if (is_entry_update_needed) {
        // truncate url
        updated_entries_urls.push(url.replace(/^(https?:\/\/)?([^\/]+)(\/.*)?$/, '$2'))
        const updated_obj = {
          ...obj,
          data: {
            ...obj.data,
            conformSchema: new_data.conformSchema,
            datasets: { ...new_data.datasets }
          }
        }
        metadata_map.set(url, updated_obj)
      }
    }
  })

  // console.log(metadata_map.get("https://data-cityofpg.opendata.arcgis.com/maps/CityofPG::public-art").data.datasets)
  // console.log(is_update_needed, metadata_map)

  return is_file_update_needed ? [updated_entries_urls, [...metadata_map.values()]] : [];
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

module.exports = { updateFile }



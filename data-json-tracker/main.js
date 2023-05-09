import { existsSync, mkdirSync, createWriteStream, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

/**
 * Removes the protocol from the url
 * @param {string} url URL to remove the protocol from
 * @returns New url without the protocol (i.e. https://www.google.com -> www.google.com)
 */
function remove_url_protocol(url) {
  // check if the url passed in is an array
  if (Array.isArray(url)) {
    const urlsWithoutProtocol = url.map((url) => {
      return url.replace(/^https?:\/\//i, '');
    });
    return urlsWithoutProtocol;
  }
  return url.replace(/^https?:\/\//i, '');
}

/**
 * Downloads the files from the link and saves them to the directory
 * @param {string} link Link to the file
 * @returns {boolean} True if the file was downloaded successfully, false otherwise
 */
async function downloadFiles(link) {
  try {
    // Make directory if it does not exist
    if (!existsSync(process.env.DOWNLOAD_DIRECTORY)) {
      mkdirSync(process.env.DOWNLOAD_DIRECTORY, { recursive: true });
    }

    const response = await fetch(link);

    if (!response.ok) {
      console.log(`Failed to download ${link}: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to download ${link}: ${response.status} ${response.statusText}`);
    }

    // Get rid of slashes in the filename
    const filename = remove_url_protocol(link).replace(/:|\//g, "-");;
    const destPath = join(process.env.DOWNLOAD_DIRECTORY, filename);

    // Write the file to the directory
    const dest = createWriteStream(destPath);
    response.body.pipe(dest);

    await new Promise((resolve, reject) => {
      dest.on('finish', resolve);
      dest.on('error', reject);
    });

    console.log(`Downloaded ${link} to ${destPath}`);
    return true;
  } catch (error) {
    console.error(`Error downloading files: ${error.message}`);
    return false;
  }
}

/**
 * Checks the ./data-json directory for the files in data_json_list
 * @param {string[]} data_json_list List of data.json files
 * @returns {boolean} True if the file exists in the directory, false otherwise
 */
async function check_directory(data_json_list) {
  try {
    // Loop through the list of data.json files
    for (let i = 0; i < data_json_list.length; i++) {
      // Get rid of slashes in the filename
      const filename = remove_url_protocol(data_json_list[i]).replace(/:|\//g, "-");;
      const destPath = join(process.env.DOWNLOAD_DIRECTORY, filename);

      if (!existsSync(destPath)) {
        console.log(`File ${remove_url_protocol(data_json_list[i])} does not exist. Downloading...`);
        const status = await downloadFiles(data_json_list[i]);
        if (!status) {
          console.log(`Failed to download ${data_json_list[i]}`);
          return false;
        }
      }
    }

    return true;
  } catch (error) {
    console.error(`Error checking directory: ${error.message}`);
    return false;
  }
}

/**
 * Parses the data.json files and extracts the title, description, and landing page
 * @param {string[]} data_json_list List of data.json files
 * @returns {JSON} JSON object with the filename as the key and the title, description, and landing page as the value
 */
async function parse_data_json(data_json_list) {
  // Ensure the data.json conforms to the us standards, and has the right type
  // Extract the titles and put them in file_data, key=filename, value=title
  var file_data = {};

  for (let i = 0; i < data_json_list.length; i++) {
    const filename = remove_url_protocol(data_json_list[i]).replace(/:|\//g, "-");;
    const destPath = join(process.env.DOWNLOAD_DIRECTORY, filename);
    file_data[filename] = [];

    const data = JSON.parse(readFileSync(destPath, 'utf8'));

    if (data.conformsTo === process.env.US_STANDARED && data["@type"] === process.env.TYPE) {
      console.log(`${filename} conforms to the US standard and has the right type`);
      for (let j = 0; j < data.dataset.length; j++) {
        file_data[filename].push({
          title: data.dataset[j].title,
          description: data.dataset[j].description ? data.dataset[j].description : "",
          landingPage: data.dataset[j].landingPage,
        });
      }
    }
  }

  return file_data;
}

/**
 * Compares the fields of the data.json files (title, description, landing page)
 * @param {string} data_json_url URL to the data.json file
 * @param {string} data_json Data from the data.json file
 * @param {string} file_data Data from the cached data.json files
 */
async function compare_fields(data_json_url, data_json, file_data, changes) {
  // Compare the fields of the data.json files (title, description, landing page)
  const filename = remove_url_protocol(data_json_url).replace(/:|\//g, "-");
  // Search for the filename in file_data
  if (file_data[filename]) {
    if (!changes[filename]) {
      changes[filename] = [];
    }

    for (let i = 0; i < data_json.dataset.length; i++) {
      // Search for the title in the file_data
      const title = data_json.dataset[i].title;
      const index = file_data[filename].findIndex(x => x.title === title);
      if (index !== -1) {
        // Compare the description and landing page
        if (data_json.dataset[i].description !== file_data[filename][index].description) {
          changes[filename].push({ title: title, description: data_json.dataset[i].description });
        }
        if (data_json.dataset[i].landingPage !== file_data[filename][index].landingPage) {
          changes[filename].push({ title: title, landingPage: data_json.dataset[i].landingPage });
        }
      } else {
        changes[filename].push({ title: title, missing: true });
      }

    }
    if (changes[filename].length > 0) {
      console.log(`Changes found in ${filename}`);
      // Replace downloaded file with the new file
      const destPath = join(process.env.DOWNLOAD_DIRECTORY, filename);
      writeFileSync(destPath, JSON.stringify(data_json, null, 2), { flag: 'w' });
    }

  } else {
    console.log(`${filename} does not exist in file_data`);
  }
}


/**
 * Compares the data.json files to the cached data.json files
 * @param {string} data_json_list List of all the data.json files
 * @param {string} file_data Data from the cached data.json files
 */
async function compare_data(data_json_list, file_data) {
  var changes = {};
  // Loop through the list of data.json files, fetch the data, and then compare
  await Promise.all(data_json_list.map(async (data_json_url) => {
    try {
      const response = await fetch(data_json_url);
      const data = await response.json();
      if (data.conformsTo === process.env.US_STANDARED && data["@type"] === process.env.TYPE) {
        await compare_fields(data_json_url, data, file_data, changes);
      } else {
        console.log(`${data_json_url} does not conform to the US standard and has the right type`);
      }
    } catch (error) {
      console.log(error);
    }
  }));
  return changes;
}

/**
 * Logs the changes to the log.txt file
 * @param {JSON} changes JSON object with the filename as the key and the title, description, and landing page as the value
 * @returns {void}
*/
async function log_changes(changes) {
  const timestamp = new Date().toISOString();
  const changesArray = Object.entries(changes).filter(([key, value]) => value.length > 0);
  if (changesArray.length > 0) {
    const log = {
      timestamp,
      changes: changesArray.reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
    };
    fs.appendFile('log.txt', JSON.stringify(log) + '\n', (err) => {
      if (err) throw err;
      console.log('Changes logged to log.txt');
    });
  }
}

// For future the filter will be using the transmogrifier

async function main() {
  const data_json_list = ['http://opendata.vancouver.ca/data.json', "https://opendata.victoria.ca/data.json"];
  const directory_exists = await check_directory(data_json_list);
  if (directory_exists) {
    const file_data = await parse_data_json(data_json_list);
    const changes = await compare_data(data_json_list, file_data);
    await log_changes(changes)
  }
}

main();

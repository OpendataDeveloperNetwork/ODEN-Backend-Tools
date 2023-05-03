import { existsSync, mkdirSync, createWriteStream } from 'fs';
import { basename, join } from 'path';
import fetch from 'node-fetch';

/**
 * Downloads the files from the link and saves them to the directory
 * @param {string} link Link to the file
 * @param {string} directory Path to the directory
 * @returns {boolean} True if the file was downloaded successfully, false otherwise
 */
async function downloadFiles(link, directory) {
  try 
  {
    // Make directory if it does not exist
    if (!existsSync(directory)) 
    {
      mkdirSync(directory, { recursive: true });
    }

    const response = await fetch(link);

    if (!response.ok) 
    {
      throw new Error(`Failed to download ${link}: ${response.status} ${response.statusText}`);
    }

    // Get rid of slashes in the filename
    const filename = link.replace(/\//g, '-');
    const destPath = join(directory, filename);

    // Write the file to the directory
    const dest = createWriteStream(destPath);
    response.body.pipe(dest);

    await new Promise((resolve, reject) => 
    {
      dest.on('finish', resolve);
      dest.on('error', reject);
    });

    console.log(`Downloaded ${filename} to ${destPath}`);
    return true;
  } catch (error) 
  {
    console.error(`Error downloading files: ${error.message}`);
    return false;
  }
}

/**
 * Checks the ./data-json directory for the files in data_json_list
 * @param {string[]} data_json_list List of data.json files
 * @param {string} directory Path to the directory
 * @returns {boolean} True if the file exists in the directory, false otherwise
 */
async function check_directory(data_json_list, directory) {
  try 
  {
    // Loop through the list of data.json files
    for (let i = 0; i < data_json_list.length; i++) 
    {
      // Get rid of slashes in the filename
      const filename = data_json_list[i].replace(/\//g, '-');
      const destPath = join(directory, filename);
      
      if (!existsSync(destPath)) 
      {
        console.log(`File ${data_json_list[i]} does not exist. Downloading...`);
        const status = downloadFiles(data_json_list[i], directory);
        if (!status) {
          console.log(`Failed to download ${data_json_list[i]}`);
          return false;
        }
      }
    }

    return true;
  } catch (error) 
  {
    console.error(`Error checking directory: ${error.message}`);
    return false;
  }
}

async function main() {
  var file_data = {};
  const data_json_list = ['http://opendata.vancouver.ca/data.json', "http://opendata.victoria.ca/data.json"];
  const directory = './data-json';
  const directory_exists = await check_directory(data_json_list, directory);
  if (directory_exists) 
  {
      // Extract the titles and put them in file_data, key=filename, value=title
      
  }
}

main();

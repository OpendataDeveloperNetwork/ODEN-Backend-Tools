import { existsSync, mkdirSync, createWriteStream } from 'fs';
import { basename, join } from 'path';
import fetch from 'node-fetch';

async function downloadFiles(links, directory) {
  try {
    // Make directory if it does not exist
    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }
    
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const response = await fetch(link);
      if (!response.ok) {
        throw new Error(`Failed to download ${link}: ${response.status} ${response.statusText}`);
      }
      const filename = basename(link);
      const destPath = join(directory, filename);
      const dest = createWriteStream(destPath);
      response.body.pipe(dest);
      await new Promise((resolve, reject) => {
        dest.on('finish', resolve);
        dest.on('error', reject);
      });
      console.log(`Downloaded ${link} to ${destPath}`);
    }
    
    console.log(`All files downloaded successfully to ${directory}`);
    return true;
  } catch (error) {
    console.error(`Error downloading files: ${error.message}`);
    return false;
  }
}

async function main() {
  try {
    const result = await downloadFiles([
      'http://opendata.vancouver.ca/data.json'
    ], './data-json');
    console.log('All downloads complete');
    return result;
  } catch (err) {
    console.error(`Error downloading links: ${err.message}`);
    return false;
  }
}

main();

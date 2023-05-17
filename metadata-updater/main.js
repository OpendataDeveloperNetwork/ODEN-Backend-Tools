import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

async function main() {
    const data_json = await get_data_json();
    const metadata_json = await get_metadata_json();
    const new_metadata = await update_metadata(data_json, metadata_json);
    // Overwrite the metadata.json file
    await push_changes(new_metadata);
}
main(); // Run the program.

/**
 * Gets the data.json file from the data.json url
 * @returns Array of objects from the data.json file
 */
async function get_data_json() {
    const response = await fetch(process.env.DATA_JSON_URL);
    const data_json = await response.json();
    return data_json;
}

/**
 * Gets the metadata.json file from the metadata.json url
 * @returns Array of objects from the metadata.json file
 */
async function get_metadata_json() {
    const response = await fetch(process.env.METADATA_JSON_URL);
    const metadata_json = await response.json();
    return metadata_json;
}

/**
 * Compares the data.json file with the metadata.json file
 * @param {JSON[]} data_json 
 * @param {JSON[]} metadata_json 
 * @returns New metadata.json file
 */
async function update_metadata(data_json, metadata_json) {
    for (let i = 0; i < data_json.length; i++) {
        const data_obj = data_json[i];
        const metadata_obj = metadata_json.find(obj => obj.url === data_obj.url);
        console.log(`Updating metadata for entry ${data_obj.url}`);
        if (metadata_obj) {
            await update_categorized(data_obj, metadata_obj);
            await update_landing404d(data_obj, metadata_obj);
            await update_isFilterable(metadata_obj);
            if (metadata_obj.labels.isFilterable) {
                await update_datasets_url404d(data_obj.data.datasets, metadata_obj.data.datasets);
            } else {
                console.log('No datasets; skipping checking dataset URLs.')
            }
        }
    }
    return metadata_json;
}

/**
 * Updates the categorized field in the metadata.json file
 * @param {JSON} data_obj Data object from the data.json file
 * @param {JSON} metadata_obj Metadata object from the metadata.json file
 */
async function update_categorized(data_obj, metadata_obj) {
    console.log('Checking categorized...')
    // Update the categorized field if length of category is greater than 0
    if (data_obj.labels.category !== "Uncategorized") {
        metadata_obj.labels.categorized = true;
    } else {
        metadata_obj.labels.categorized = false;
    }
    console.log(`\tSet categorized to ${metadata_obj.labels.categorized}; Category: ${data_obj.labels.category}`);
}

/**
 * Checks if the landing url is a 404
 * @param {JSON} data_obj Data object from the data.json file
 * @param {JSON} metadata_obj Metadata object from the metadata.json file
 */
async function update_landing404d(data_obj, metadata_obj) {
    console.log('Checking landing URL...')
    if (data_obj.url !== "") {
        try {
            const response = await axios.get(data_obj.url);
            if (response.status === 404) {
                metadata_obj.labels.landingUrl404d = true;
            } else {
                metadata_obj.labels.landingUrl404d = false;
            }
        } catch (e) {
            metadata_obj.labels.landingUrl404d = true;
            console.log(`\n\t-- Error: An error occurred accessing the landing URL \'${data_obj.url}\' --\n`);
        }
        console.log(`\tLanding URL 404'd state: ${metadata_obj.labels.landingUrl404d}`)
    } else {
        console.log(`\n\t-- Error: No landing url located! --\n`)
    }
}

/**
 * Checks if the dataset is filterable
 * @param {JSON} metadata_obj Metadata object from the metadata.json file
 */
async function update_isFilterable(metadata_obj) {
    console.log('Checking if entry is filterable...')
    const status = await isDatasetsEmpty(metadata_obj);
    if (status) {
        metadata_obj.labels.isFilterable = false;
        console.log(`Updated isFilterable to false`);
    } else {
        metadata_obj.labels.isFilterable = true;
        console.log(`Updated isFilterable to true`);
    }
    console.log(`\tFilterable status set to ${metadata_obj.labels.isFilterable}.`);
}

/**
 * Checks if the datasets field is empty
 * @param {JSON} jsonObj JSON object from the metadata.json file
 * @returns True if datasets is empty, false otherwise
 */
async function isDatasetsEmpty(jsonObj) {
    if (!jsonObj.data.datasets) {
        return true;
    }
    for (let dataset in jsonObj.data.datasets) {
        if (Object.keys(jsonObj.data.datasets[dataset]).length !== 0) {
            return false;
        }
    }
    return true;
}

/**
 * For each dataset in the data obj, check to see if the dataset url returns 404;
 * update the metadata accordingly.
 * @param {JSONObject} data_obj the data object to check
 * @param {JSONObject} metadata_obj the metadata object to update
 */
async function update_datasets_url404d(data_obj_datasets, metadata_obj_datasets) {
    console.log('Checking dataset URLs...')
    // Get the dataset formats: json, csv, xml, etc.
    const dataset_keys = Object.keys(data_obj_datasets);
    if (dataset_keys.length) {
        // For each format, GET the url; set the appropriate 'url404d' metadata boolean appropriately.
        dataset_keys.forEach(async (dataset_format) => {
            try {
                const response = await axios.get(data_obj_datasets[dataset_format].url);
                if (response.status === 404) {
                    metadata_obj_datasets[dataset_format].url404d = true;
                } else {
                    metadata_obj_datasets[dataset_format].url404d = false;
                }
            } catch (err) {
                metadata_obj_datasets[dataset_format].url404d = true;
                console.log(`\n\t-- Error: An error occurred accessing the dataset URL \'${dataset_format}\': \'${data_obj_datasets[dataset_format].url}\' --\n`);
            }
            console.log(`\tDataset \'${dataset_format}\' URL 404'd state: ${metadata_obj_datasets[dataset_format].url404d}`);
        });
    } else {
        console.log("\tNo datasets.");
    }
}


async function push_changes(new_metadata) {
    // const owner = 'OpendataDeveloperNetwork';
    // const repo = 'ODEN-Client';
    // const file_path = 'metadata.json';
    const url = `https://api.github.com/repos/${process.env.OWNER}/${process.env.REPO}/contents/${process.env.FILE_PATH}`;

    const new_file_content_str = JSON.stringify(new_metadata, null, 2);
    const new_file_content_base64 = Buffer.from(new_file_content_str).toString('base64');

    const message = `Updated metadata.json file from data.json`;
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            console.log(`Response:`, data);
            const sha = data.sha;
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
                    console.log(`Response:`, data);
                })
                .catch((err) => {
                    console.error(`Error updating file:`, err);
                });
        })
}

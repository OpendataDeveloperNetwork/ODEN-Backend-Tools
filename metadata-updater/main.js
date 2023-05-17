import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

var outstanding_errors = [];

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
 * Updates the categorized field in the metadata.json file
 * @param {JSON} data_obj Data object from the data.json file
 * @param {JSON} metadata_obj Metadata object from the metadata.json file
 */
async function update_categorized(data_obj, metadata_obj) {
    console.log(`URL: ${data_obj.url}`);
    console.log(`Category: ${data_obj.labels.category.length}`);
    console.log(`Categorized: ${metadata_obj.labels.categorized}`);
    // Update the categorized field if length of category is greater than 0
    if (data_obj.labels.category !== "Uncategorized") {
        metadata_obj.labels.categorized = true;
        console.log(`Updated categorized to true`);
    } else {
        metadata_obj.labels.categorized = false;
    }
    console.log("-----------------------");
}

/**
 * Gets the url for the a dataset from the dataset object
 * @param {JSON} dataset Field within dataset field in object from the data.json file
 * @returns String of the url; empty string if no url or an error occurs.
 */
async function getDatasetUrl(dataset) {
    try {
        return dataset.url || "";
    } catch (e) {
        return "";
    }
}

/**
 * Checks if the landing url is a 404
 * @param {JSON} data_obj Data object from the data.json file
 * @param {JSON} metadata_obj Metadata object from the metadata.json file
 */
async function check_for_landing_404(data_obj, metadata_obj) {
    if (data_obj.url !== "") {
        try {
            const response = await axios.get(data_obj.url);
            if (response.status === 404) {
                metadata_obj.labels.landingUrl404d = true;
                outstanding_errors.push(data_obj.url);
                console.log(`Updated 404 to true`);
            } else {
                metadata_obj.labels.landingUrl404d = false;
            }
        } catch (e) {
            outstanding_errors.push(data_obj.url);
        }
    }
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
 * Checks if the dataset is filterable
 * @param {JSON} metadata_obj Metadata object from the metadata.json file
 */
async function check_if_dataset_is_filterable(metadata_obj) {
    const status = await isDatasetsEmpty(metadata_obj);
    if (status) {
        metadata_obj.labels.isFilterable = false;
        console.log(`Updated isFilterable to false`);
    } else {
        metadata_obj.labels.isFilterable = true;
        console.log(`Updated isFilterable to true`);
    }
}

/**
 * Compares the data.json file with the metadata.json file
 * @param {JSON[]} data_json 
 * @param {JSON[]} metadata_json 
 * @returns New metadata.json file
 */
async function compare_data(data_json, metadata_json) {
    for (let i = 0; i < data_json.length; i++) {
        const data_obj = data_json[i];
        const metadata_obj = metadata_json.find(obj => obj.url === data_obj.url);
        if (metadata_obj) {
            await update_categorized(data_obj, metadata_obj);
            await check_for_landing_404(data_obj, metadata_obj);
            await check_if_dataset_is_filterable(metadata_obj);
        }
    }
    return metadata_json;
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

async function main() {
    const data_json = await get_data_json();
    const metadata_json = await get_metadata_json();
    const new_metadata = await compare_data(data_json, metadata_json);
    // Overwrite the metadata.json file
    await push_changes(new_metadata);
}

main();
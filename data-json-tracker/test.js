/**
 * Create a list of regexes from a list of categories
 * @param {string[]} category_list List of categories to search for
 * @returns List of regexes
 */
function get_regex_list(category_list) {
    const regex_list = [];
    try {
        category_list.map(category => {
            regex_list.push(new RegExp(category, 'i'));
        })
    } catch (error) {
        console.log(`Error creating regex list: ${error.message}`);
        return false;
    }
    return regex_list;
}

/**
 * Search for a list of categories in a data.json file
 * @param {string[]} category_list List of categories to search for
 * @param {string} data_json_list Data.json file to search in
 * @returns Object with categories as keys and title + landingPage as values
 */
async function search_for_category(category_list, data_json_list) {
    const regex_list = get_regex_list(category_list);
    if (!regex_list) {
        return false;
    }

    const result_object = {};

    // Initialize result object
    category_list.map(category => {
        result_object[category] = [];
    })
    // Fetch each data.json file and search for categories
    const promises = data_json_list.map(data_json_url => {
        return fetch(data_json_url)
            .then(response => response.json())
            .then(json => {
                json.dataset.map(dset => {
                    // Check if title matches any of the regexes
                    const regex = regex_list.find(regex => dset.title.match(regex));
                    if (regex) {
                        // Add it to the result object
                        const category = category_list[regex_list.indexOf(regex)];
                        result_object[category].push({
                            title: dset.title,
                            landingPage: dset.landingPage
                        });
                    }
                })
            })
            .catch(error => {
                console.log(`Error searching ${data_json_url}: ${error.message}`);
            });
    });

    await Promise.all(promises);

    return result_object;
}

async function test() {
    const category_list = ["art", "bike", "food"]
    const data_json_list = ["http://opendata.vancouver.ca/data.json", "http://open.hamilton.ca/data.json"];
    const res = await search_for_category(category_list, data_json_list);
    console.log(res);
}

test();

// Example output:
// {
//     art: [{
//             title: 'Public art - Artists',
//             landingPage: 'https://opendata.vancouver.ca/explore/dataset/public-art-artists/'
//         },
//         {
//             title: 'Public art',
//             landingPage: 'https://opendata.vancouver.ca/explore/dataset/public-art/'
//         }
//     ],
//     bike: [...],
//     food: [...]
// }
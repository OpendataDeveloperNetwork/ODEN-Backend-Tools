# ODEN-Backend-Tools

## Filter validator tool

The filter validator tool is run once everyday and validates the entries from the data.json. It checks to see if the filters are working properly and if not, it will update the metadata.json and send an email to the admins detailing which entry url's failed and the cause of the error. 

This uses two javascript files which are the filter_validator.js and update_github.js

### filter_validator.js

The filter_validator.js script is used to validate filter entries embedded in each data entry with their respective dataset and schema. It performs validation checks and sends email notifications for any invalid entries. Here's an overview of the script:

- The validateEntries function is the main entry point, which takes an array of data entries as input and performs validation on each entry.
- Inside the validateEntries function, it fetches the standard library function using get_std_lib_func.
- It then iterates over each data entry and performs schema and dataset validations for each entry and its associated filters.
- If any validation errors occur, it adds the entry to the email message using add_to_email.
- It defines helper functions such as remove_url_protocol and addSpaceBeforeTLD for manipulating URLs, and add_to_email for appending invalid entries to the email message.
- Once the validation process is complete, it sends a notification email containing the list of invalid entries using the send_notification function.
- Finally, it returns a result object containing the validation information for each entry.

### update_github.js

The update_github.js script is responsible for updating the metadata.json file in a GitHub repository with new content. It utilizes the GitHub API for fetching and updating the file. Here's an overview of the script:

- It defines the updateFile function, which takes the new content as input and updates the metadata.json file in the specified GitHub repository.
- Inside the updateFile function, it fetches the existing metadata.json file from the repository using the GitHub API.
- It generates new file content by comparing the existing content with the new content, checking for any differences in the conformSchema or correctness values.
- If any updates are needed, it prepares the new file content, including the updated entries' URLs.
- It then sends a PUT request to the GitHub API, updating the file with the new content and providing the necessary authentication using a GitHub token.
- Finally, it logs the update status or any errors that occur during the process.

## Data.json Tracker
The tools flow is as follows: 
- It fetches the data.json list from the ODEN Client GitHub
- It checks if the URLs are downloaded in the cache, if not it downloads them 
- It fetches each URL from the web and compares against the cached version for any changes to the datasets 
- At the end of executing it updates a local log file with any errors encountered, and the results it found. Additionally, it sends an email to admins with the errors and results.

Do Note to run this program an environment file is required and can be found in the Backend Tools -> Data.json Tracker folder in the Google Drive.
### main.js
Contains all the logic for finding differences between cached files and fetched files

### test.js
Contains code for pushing/updating a GitHub file using the GitHub rest API. This code is used throughout the project.

## Metadata Updater
This tools responsibility is to keep the “categorized”, “landing404d”, “isFilterable”, and “schema404d” booleans within the metadata.json file in sync with the data.json file found in the ODEN Client GitHub.
### main.js
Contains all the logic for comparing the data.json and metadata.json files from the ODEN Client GitHub to find and update any differences with the fields mentioned above.

## Notification API

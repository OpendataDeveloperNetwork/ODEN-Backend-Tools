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

## Notification API

import fetch from 'node-fetch';

const owner = 'OpendataDeveloperNetwork';
const repo = 'ODEN-Client';
const file_path = 'data.json';
const new_content = { cor: 21 }; // The new content you want to write to the file

const url = `https://api.github.com/repos/${owner}/${repo}/contents/${file_path}`;

// Get the data
fetch(url)
    .then((res) => res.json())
    .then((data) => {
        // Update the file
        const content = Buffer.from(data.content, 'base64').toString();
        const sha = data.sha;
        // Commit Message
        const message = 'Testing the github api';

        // Create New file content
        const new_file_content = JSON.parse(content);
        const new_file_content_str = JSON.stringify(new_file_content, null, 2);
        const new_file_content_base64 = Buffer.from(new_file_content_str).toString('base64');
        console.log(new_file_content);
        // Push the changes to the github
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.github+json',
                Authorization: 'Bearer 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'
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
    })
    .catch((err) => {
        console.error(`Error fetching file ${file_path} in ${owner}/${repo} repository:`, err);
    });
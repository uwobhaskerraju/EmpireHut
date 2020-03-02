//https://medium.com/@ferie/how-to-pass-environment-variables-at-building-time-in-an-angular-application-using-env-files-4ae1a80383c
//https://medium.com/@mjangid/environment-variables-with-angular-cli-4cdbb96017f6

import { writeFile } from 'fs';
require('dotenv').config();
let apiURL;

const targetPath = `./src/environments/environment.prod.ts`;
const envConfigFile = `export const environment = {production: true, apiUrl: '${apiURL}',imagePath:'../assets/images/',apiBaseURL:'https://localhost:8080/api/',defaultPicture:'default.jpg'};`
writeFile(targetPath, envConfigFile, function (err) {
    if (err) {
        console.log(err);
    }
})
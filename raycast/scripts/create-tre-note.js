#!/usr/bin/env node

// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title Create Tre note
// @raycast.mode compact

// Optional parameters:
// @raycast.icon 🤖
// @raycast.argument1 { "type": "text", "placeholder": "Placeholder" }

// import os module
const os = require("os");
const fs = require('fs');

const path = `${os.homedir()}/OneDriveTre`
const date = new Date().toISOString().split('T')[0]


const usersIdentifier=process.argv.slice(2)[0]
const fileIdentifier = `${date}_${usersIdentifier}`
const fileName = `${path}/${fileIdentifier}.md`


//File content
const split = fileIdentifier.split('_')
const headerContent = split.slice(1)
  .map(str => {
    const uc = str.charAt(0).toUpperCase() + str.slice(1);
   return  uc;
}).join(' ')


const header = `# ${headerContent}`
const body = `\n\n# Resultat\n## Sammanfattning\n## Artefakter\n`
const footer = split.map(s =>  `#${s}`).join('\n')

const content = `${header}\n${body}\n${footer}`
fs.writeFile(fileName, content, err => {
  if (err) {
    console.error(err);
  }
  // file written successfully
});




console.log(fileIdentifier)
//console.log("Hello World! Argument1 value: " + process.argv.slice(2)[0])


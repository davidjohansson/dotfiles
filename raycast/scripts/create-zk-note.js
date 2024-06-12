#!/usr/bin/env node

// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title Create Zettelkasten note
// @raycast.mode compact

// Optional parameters:
// @raycast.icon 🤖
// @raycast.argument1 { "type": "text", "placeholder": "Placeholder" }

// import os module
const os = require("os");
const fs = require('fs');

// const path = `${os.homedir()}/Google\\ Drive/My\\ Drive/zettelkasten`
const path = `${os.homedir()}/Google Drive/My Drive/zettelkasten`
// const path = `${os.homedir()}`
let date1 = new Date();
const day = date1.toISOString().split('T')[0].replaceAll('-', '')
const time = `${date1.getHours().toString().padStart(2, '0')}${date1.getMinutes().toString().padStart(2, '0')}`

const date = `${day}${time}`

const usersIdentifier=process.argv.slice(2)[0]
const fileIdentifier = `${date}-${usersIdentifier.replaceAll(' ', '-').replaceAll('?', '')}`
const fileName = `${path}/${fileIdentifier}.md`

//File content
// const split = fileIdentifier.split('-')
// const headerContent = split.slice(1)
//   .map(str => {
//     const uc = str.charAt(0).toUpperCase() + str.slice(1);
//    return  uc;
// }).join(' ')
//
//
const header = `${fileIdentifier}`
const content = `${header}\n# ${usersIdentifier}`

fs.writeFile(fileName, content, err => {
  if (err) {
    console.error(err);
  }
  // file written successfully
});

console.log(fileIdentifier)


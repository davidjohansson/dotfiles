#!/usr/bin/env zx

$.verbose = false
const path = `${os.homedir()}/OneDriveTre`
const date = (await $`date +%F`).stdout.trim()

//massa argument framför nr 4, t ex node o stuff
const fileIdentifier = `${date}_${process.argv[3]}`
const fileName = `${path}/${fileIdentifier}.md`

const split = fileIdentifier.split('_')

 await $`eval touch ${fileName}`

const header = split.slice(1)

  .map(str => {
    const uc = str.charAt(0).toUpperCase() + str.slice(1);
   return  uc;
}).join(' ')


await $`echo "# ${header}" >> ${fileName} `
await $`echo "\n\n# Resultat\n## Sammanfattning\n## Artefakter\n" >> ${fileName} `
await Promise.all(split.map(s =>  $`echo "#${s}" >> ${fileName} `))
await $`echo ${fileName}`.pipe(process.stdout)

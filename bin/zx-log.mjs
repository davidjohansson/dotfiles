#!/usr/bin/env zx

$.verbose = false
const path = `${os.homedir()}/vimwiki/tre`
const date = (await $`date +%F`).stdout.trim()

//massa argument framför nr 4, t ex node o stuff
const fileIdentifier = `${date}_${process.argv[3]}`
const fileName = `${path}/${fileIdentifier}.md`

const split = fileIdentifier.split('_')

 await $`eval touch ${fileName}`

await $`echo "" >> ${fileName} `
await Promise.all(split.map(s =>  $`echo "#${s}" >> ${fileName} `))
await $`echo ${fileName}`.pipe(process.stdout)

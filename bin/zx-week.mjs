#!/usr/bin/env zx
$.verbose = false

await $`date +"%U" `.pipe(process.stdout)



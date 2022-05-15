#!/usr/bin/env zx
$.verbose = false

await $`icalBuddy -n -nnc -1 -na 1 -ec "Bettys_schema, Alex_schema" eventsToday`.pipe(process.stdout)



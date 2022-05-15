#!/usr/bin/env zx
$.verbose = false

await $`icalBuddy -nnc -1 -na 1 -ic "Alex_schema" eventsToday`.pipe(process.stdout)



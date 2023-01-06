#!/bin/bash
dates(){
  startdate=20220101
  enddate=20221231

  for (( date="20220101"; date != enddate; )); do
    date="$(date -j -f %Y%m%d -v+1d $date +%Y%m%d)"
    echo "${date}"
  done
}

dates

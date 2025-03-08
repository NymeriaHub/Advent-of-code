#!/bin/bash

year=$1
day=$2

if [ -z "$year" ] || [ -z "$day" ]; then
    echo "Usage: ./advent.sh <année> <jour>"
    exit 1
fi

ts-node src/$year/day$day/index.ts 
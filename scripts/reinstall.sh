#!/usr/bin/env bash

# Fail on error
set -e

# Echo commands
set -x

rm -rf node_modules
rm -rf docs/node_modules
rm -rf wglt/node_modules

# If called with "--update", then use npm i
if [ "$1" == "--update" ]; then
  rm -rf package-lock.json
  npm i --strict-peer-deps
else
  npm ci --strict-peer-deps
fi

#!/usr/bin/env bash

# Fail on error
set -e

# Echo commands
set -x

rm -rf node_modules

for dir in `ls packages`; do
  if test -d "packages/$dir/node_modules"; then
    rm -rf "packages/$dir/node_modules"
  fi
done

rm -rf package-lock.json
npm i --strict-peer-deps

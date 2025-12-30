#!/usr/bin/env bash

# Fail on error
set -e

# Echo commands
set -x

rm -rf node_modules

for dir in `ls packages`; do
  if test -d "packages/$dir/.turbo"; then
    rm -rf "packages/$dir/.turbo"
  fi
  if test -d "packages/$dir/dist"; then
    rm -rf "packages/$dir/dist"
  fi
  if test -d "packages/$dir/node_modules"; then
    rm -rf "packages/$dir/node_modules"
  fi
done

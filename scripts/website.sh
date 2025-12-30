#!/usr/bin/env bash

# Fail on error
set -e

# Echo commands
set -x

# Clear out existing website examples
rm -rf packages/wglt-docs/public/examples

# Create website examples from package builds
mkdir -p packages/wglt-docs/public/examples

for dir in `ls packages`; do
  if test -f "packages/$dir/dist/index.html"; then
    rm -rf "packages/wglt-docs/public/examples/$dir"
    mkdir -p "packages/wglt-docs/public/examples/$dir"
    cp -R "packages/$dir/dist/." "packages/wglt-docs/public/examples/$dir"
  fi
done

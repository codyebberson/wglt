#!/usr/bin/env bash

PACKAGES=(
  "wglt"
  "create-wglt"
)

for package in ${PACKAGES[@]}; do
    echo "Publish $package"
    pushd packages/$package
    VERSION=$(node -p "require('./package.json').version")
    if [[ $VERSION == *"beta"* ]]; then
        npm publish --access public --tag beta
    else
        npm publish --access public
    fi
    popd
done

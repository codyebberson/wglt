#!/usr/bin/env bash

# Fail on error
set -e

# Echo commands
set -x

npx npm-check-updates --workspaces --root --upgrade --target latest --enginesNode

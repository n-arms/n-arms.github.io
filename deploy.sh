#!/usr/bin/env sh

git checkout gh-pages
git checkout main .
trap "git checkout main" EXIT

rm -rf ./node_modules
rm -rf ./lib
rm -rf ./src 
rm -f ./README.md
rm -f ./webpack.config.js
rm -f ./package-lock.json
rm -f ./bsconfig.json
rm -f ./package.json

git add .
git commit -am "desploy.sh: deploy to gh-pages"

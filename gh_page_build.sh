#!/usr/bin/env bash
#build script for gh-pages repository

git add .
git commit -m "$*"
git push origin master
echo "**********************************pushed to master"
yarn run build
echo "**********************************build done"
git checkout gh-pages
echo "**********************************now in gh-pages branch"
sleep 1
find -maxdepth 1 ! -name gh_page_build.sh ! -name build ! -name node_modules ! -name .git ! -name .gitignore ! -name . -exec rm -rv {} \; 
echo "**********************************removed old files"
cp -a dist/. .
cp -a build/. .
git add .
git commit -m "$*"
git push origin gh-pages
echo "**********************************gh-pages is pushed"
git checkout master
echo "**********************************return to master branch"
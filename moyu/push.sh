#!/bin/sh
git checkout master
git reset --hard origin/master
git pull
gulp b
cp -R dist/www/  /opt/www/static.mall.moyu.com/assets
cd /opt/www/static.mall.moyu.com/assets
svn up
svn add *
DATE=$(date +%Y-%m-%d" "%H:%I:%S)
svn commit -m "$DATE"

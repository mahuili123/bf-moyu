#!/bin/sh
## ./test.sh f1   [f1,f2,f3]
git pull
gulp b
cp -R dist/h5/  /opt/www/$1.static.mall.moyu.com/assets
cd /opt/h5/$1.static.mall.moyu.com/assets

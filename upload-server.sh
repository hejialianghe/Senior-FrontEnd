
#!usr/bin/env sh
yarn build
scp  -o stricthostkeychecking=no -r ./dist/* root@122.51.11.29:/home/www/blog
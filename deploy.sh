#!usr/bin/env bash

#当发生错误中止脚本

set -e

# cd 到构建输出的目录下
cd dist

git config --global user.email "hejialianghe@qq.com"
git config --global user.name "hejialianghe"

git init
git add -A
git commit -m 'deploy'

ls



git push -f https://${access_token}@github.com/hejialianghe/hejialianghe.github.io master

echo '部署成功!'
cd - 

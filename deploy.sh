#!usr/bin/env bash

echo '代码上传中......'
#当发生错误中止脚本
set -e

# cd 到构建输出的目录下
cd dist

git init
git add -A
git commit -m 'deploy'

ls

git push -f https://${access_token}@github.com/hejialianghe/hejialianghe.github.io master

cd - 
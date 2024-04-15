#!/bin/bash
echo "0 - Clean old version"
rm -rf docker/image_builder/frontend

#echo "0 - App : Not perform the validation of the certificate with global http.sslVerify false"
#git config --global http.sslVerify false

echo "1 - App : npm install command"
cd src/app/web/frontend/
npm  i -f -ddd

echo "2 - App :  Analyzing project frontEnd with Sonarqube"
npm run sonar

echo "2 - App : Build Angular Front-End $1"
npm run build_$1

cd -

echo "3 - App : Copy FrontEnd artifact to webapp container folder"
cp -r src/app/web/frontend/dist/ docker/image_builder/frontend

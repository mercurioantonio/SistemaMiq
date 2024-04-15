#!/bin/bash
echo "0 - Clean old version"
rm -rf docker/image_builder/backend

echo "1 - App : Copy Python source and supporting files"
cp -r src/app/web/backend/ docker/image_builder/backend

echo "2 - App : Run sonar scanner"
#mvn sonar:sonar -Dsonar.login=admin -Dsonar.password=admin -f docker/image_builder/backend
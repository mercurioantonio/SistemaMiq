#!/bin/bash# Stop and remove old container and image
echo "Stopping and removing previously created containers"
docker stop app_container
docker rm app_container
docker rmi app_tmpl003:latest --force

# Variables section
export SONARQUBE_HOST=http://localhost:9001
export GITLAB_TOKEN=REPLACEME_WITH_YOUR_PERSONAL_GITLAB_TOKEN

# Git pull from the repository
echo "git pull from the repository"
git pull

# From root source folder run build_script.sh . The generated artifacts application.war are copied into image_builder folder and the Angular SPA distribution folder is copied into image_builder/tmp folder. 
echo "Launch build_script.sh"
./build_script.sh dev # ./build_script.sh prd
#
## The DockerFile in image_builder folder, contains a base Wildfly Image to run the apps. Run the following command in the following path docker\image_builder :
echo "Build Docker Image"
cd ./docker/image_builder
docker build --build-arg GITLAB_TOKEN_ARG=${GITLAB_TOKEN} --rm -t app_tmpl003 . --platform linux/arm64/v8

# Run Images
echo "Run Docker Images"
docker run -p 18080:8080 -p 8787:8787 --env-file customization/local_env.properties  --name app_container --rm app_tmpl003


# Application template 

# Introduction

This repository contains the first implementation of a template for an application platform template with the following:

* Angular Single Page Application (SPA)
* Python rest api application


# Repository Structure

For specific folder's documentation see the inner README.md 

~~~
├── docker/image_builder
├── infrastructure/
├── local_dev_environment_/
├── src/
├── .gitignore
├── .gitlab-ci.yml
├── build_script_be.sh
├── build_script_fe.sh
├── build_script.sh
├── info_template.yaml
├── Makefile
├── run_local.sh
└── README.md
~~~

* `docker/image_builder`: contains the `Dockerfile` which describes the container.
* `infrastructure`: contains the CloudFormation, the k8s resources for the POD in Kubernetes.
* `local_dev_environments`: contains docker-compose.yml for setting local dev environment with aws localstack and sonarqube
* `src`: contains application template back-end and front-end codebase
* `.gitlab-ci.yml`: a descriptor for the gitlab pipeline
* `build_script_be.sh`: the build script for src backend directory codebase
* `build_script_fe.sh`: the build script for src frontend directory codebase
* `build_script.sh`: the build script for src directory codebase
* `info_template.yaml`: a descriptor for the template
* `Makefile`: commands used by the gitlab pipeline
* `run_local.sh`: the script for local testing

# LINK SAMPLE
DEV (when you lauch run_local.sh)
http://localhost:18080/context_replaceme/#/

The server api responde to this context path 
http://localhost:18080/api/v1/.....

FRONTEND
http://dev-app-tmpl003.de.dm.pirelli.internal/context_replaceme


BACKEND (example call to rest apli sample)
http://dev-app-tmpl003.de.dm.pirelli.internal/application/api/v1/track



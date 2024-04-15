include infrastructure/k8s/script/config.conf
export

build_be:
	set -euf
	./build_script_be.sh

build_fe:
	set -euf
	@echo "CI_COMMIT_BRANCH : ${CI_COMMIT_BRANCH}"
	@if [ ${CI_COMMIT_BRANCH} = "dev" ]; then \
		./build_script_fe.sh ${CI_COMMIT_BRANCH}; \
	else \
		./build_script_fe.sh prd; \
	fi

docker_build_push:
	set -euf
	@echo "Current tag: ${TAG_IMAGE_ENV}"
	@echo "Building Docker image and pushing to registry..."
	cd infrastructure/k8s/script && ./docker-build-push.sh ${TAG_IMAGE_ENV}

deploy:
	@cat infrastructure/k8s/k8sresources/*.yaml | envsubst | sed 's/"""/"/g' | kubectl apply -f -
	@if [ -f infrastructure/k8s/k8sresources/flask-deployment.yaml ]; then kubectl rollout restart --namespace ${PLANT} deploy ${APPNAME}-flask-deployment; fi 
	@if [ ${CI_ENVIRONMENT_NAME} = "prd" ]; then mv ~/.kube/config_dev ~/.kube/config && kubectl delete deploy --namespace=${PLANT} --force ${APPNAME}-task-deployment ${APPNAME}-worker-deployment ${APPNAME}-flask-deployment || true; fi
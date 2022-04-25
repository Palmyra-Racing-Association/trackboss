#!/bin/bash
export TRACKBOSS_ENVIRONMENT_NAME=$1
export PROJECT_ROOT=$2

gitCommitId=`git rev-parse --short HEAD`
echo "Building Big Green Button build $TRACKBOSS_ENVIRONMENT_NAME with $gitCommitId"

# build back end docker container
echo "Back end building Dockerimage...."
cd $PROJECT_ROOT/
npm install
bash devops/deploy/backend/buildDockerImage.sh

# build front end
echo "Front end node build....."
cd $PROJECT_ROOT/frontend
npm install
npm run build

# deploy back end
echo "Backend CDK infrastructure build...."
cd $PROJECT_ROOT/devops/deploy/backend
bash deployBackendInfra.sh
echo "In a 5-10 minutes, you can hit this by accessing /api/health on the load balancer."

# deploy front end
echo "Backend front end infrastructure build...."
cd $PROJECT_ROOT/devops/deploy/frontend
bash deployFrontEnd.sh
echo "DONE"
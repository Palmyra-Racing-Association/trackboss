#!/bin/bash
export TRACKBOSS_ENVIRONMENT_NAME=$1
export PROJECT_ROOT=$2
if [ -z $1 ]; then
  echo "Please specify an environment name."
  exit -1
fi;
if [ -z $2 ]; then
  echo "Please specify a project root."
  exit -1
fi;

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
npm run build-$TRACKBOSS_ENVIRONMENT_NAME

bash infrastructureButton.sh $PROJECT_ROOT
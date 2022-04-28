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

echo "Front end node build....."
cd $PROJECT_ROOT/frontend
npm install
npm run build-$TRACKBOSS_ENVIRONMENT_NAME

cd $PROJECT_ROOT/devops/deploy/frontend
npm install
echo "Deploying front end, here is the CDK diff."
npx cdk diff
echo "Deploying Track Boss front end.  Most of the time this will just update S3 objects"
npx cdk deploy --require-approval never
echo "Track Boss front end deployed.  Please update any DNS records in Bluehost if needed."
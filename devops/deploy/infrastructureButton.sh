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
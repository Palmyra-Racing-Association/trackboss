#!/bin/bash
export PROJECT_ROOT=$1
export TRACKBOSS_ENVIRONMENT_NAME=$2

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
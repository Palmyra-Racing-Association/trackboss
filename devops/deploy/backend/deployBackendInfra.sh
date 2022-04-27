#!/bin/bash
export PROJECT_ROOT=$1
if [ -z $1 ]; then
  echo "Please specify a project root."
  exit -1
fi;
cd $PROJECT_ROOT/deploy/backend
npm install
echo "Deploy backend infrastructure.  Here is the CDK diff..."
npx cdk diff
echo "Destroying existing infra - this is the fastest way to reload Docker containers as of 4/2022"
# npx cdk destroy --force
npx cdk deploy --require-approval never
echo "Back end infra is built!  Please manually update any DNS records associated with the change in bluehost"
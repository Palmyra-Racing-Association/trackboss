#!/bin/bash
export PROJECT_ROOT=$1
if [ -z $1 ]; then
  echo "Please specify a project root."
  exit -1
fi;
cd $PROJECT_ROOT/devops/deploy/backend
npm install
echo "Deploy backend infrastructure.  Here is the CDK diff..."
npx cdk diff
npx cdk deploy --require-approval never
echo "Back end infra is built!"
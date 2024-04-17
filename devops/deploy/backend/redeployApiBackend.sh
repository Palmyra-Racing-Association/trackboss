#!/bin/bash
if [ -z $1 ]; then
  echo "Please specify an environment name."
  exit -1
fi;
if [ -z $2 ]; then
  echo "Please specify a project root."
  exit -1
fi;

apprunner_arn=`aws apprunner list-services | jq -c '.ServiceSummaryList[] | select( .ServiceName | contains("trackbossRunner"))' | jq -r .ServiceArn`
aws apprunner start-deployment --service-arn $apprunner_arn
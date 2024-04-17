#!/bin/bash
if [ -z $1 ]; then
  echo "Please specify an environment name."
  exit -1
fi;
if [ -z $2 ]; then
  echo "Please specify a project root."
  exit -1
fi;

instance_id=`aws ec2 describe-instances --filters "Name=tag:EnvironmentName,Values=$1" "Name=instance-state-name,Values=running" | jq -r '.Reservations[0].Instances[0].InstanceId'`
if [ $instance_id == "null" ]; then
  echo "No instance found for environment $1, leaving it alone for now!"
else
  echo $instance_id
  aws ec2 terminate-instances --instance-ids $instance_id
fi;

apprunner_arn=`aws apprunner list-services | jq -c '.ServiceSummaryList[] | select( .ServiceName | contains("trackbossRunner"))' | jq -r .ServiceArn`
aws apprunner start-deployment --service-arn $apprunner_arn
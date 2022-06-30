#!/bin/bash
if [ -z $1 ]; then
  echo "Please specify an environment name."
  exit -1
fi;
instance_id=`aws ec2 describe-instances --filters "Name=tag:EnvironmentName,Values=$1" "Name=instance-state-name,Values=running" | jq -r '.Reservations[0].Instances[0].InstanceId'`
if [ $instance_id == "null" ]; then
  echo "No instance found for environment $1, leaving it alone for now!"
else
  echo $instance_id
  aws ec2 terminate-instances --instance-ids $instance_id
fi
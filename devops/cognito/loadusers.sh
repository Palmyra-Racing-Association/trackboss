#!/bin/bash -e
export AWS_PAGER=""
userPoolId=$1
csvFile=$2

bash deleteusers.sh $1

# now create a job to load the user pool.
aws cognito-idp create-user-import-job --user-pool-id $userPoolId --job-name "initialImport-`date +%s`" --cloud-watch-logs-role-arn arn:aws:iam::425610073499:role/service-role/Cognito-UserImport-Role > job-info.json
cat job-info.json
uploadUrl=`cat job-info.json | jq -r .UserImportJob.PreSignedUrl`
jobId=`cat job-info.json | jq -r .UserImportJob.JobId`
echo $uploadUrl
echo $jobId
curl -v -T $csvFile -H "x-amz-server-side-encryption:aws:kms" $uploadUrl
sleep 10
aws cognito-idp start-user-import-job --user-pool-id $userPoolId --job-id $jobId
aws cognito-idp create-group --group-name admin --user-pool-id $userPoolId --precedence 1
aws cognito-idp create-group --group-name member --user-pool-id $userPoolId --precedence 3
aws cognito-idp create-group --group-name membershipAdmin --user-pool-id $userPoolId --precedence 2
#!/bin/bash -e
export AWS_PAGER=""
jobInfo="/tmp/job-info.json"
userPoolId=$1
csvFile=$2

# now create a job to load the user pool.
aws cognito-idp create-user-import-job --user-pool-id $userPoolId --job-name "initialImport-`date +%s`" --cloud-watch-logs-role-arn arn:aws:iam::425610073499:role/service-role/Cognito-UserImport-Role > $jobInfo
cat $jobInfo
uploadUrl=`cat $jobInfo | jq -r .UserImportJob.PreSignedUrl`
jobId=`cat $jobInfo | jq -r .UserImportJob.JobId`
echo $uploadUrl
echo $jobId
curl -v -T $csvFile -H "x-amz-server-side-encryption:aws:kms" $uploadUrl
sleep 10
aws cognito-idp start-user-import-job --user-pool-id $userPoolId --job-id $jobId
aws cognito-idp create-group --group-name admin --user-pool-id $userPoolId --precedence 1
aws cognito-idp create-group --group-name membershipAdmin --user-pool-id $userPoolId --precedence 2
aws cognito-idp create-group --group-name member --user-pool-id $userPoolId --precedence 3

sleep 30
# make all users members of member (say that 3 times fast)
aws cognito-idp list-users --user-pool-id $1 | jq -r '.Users | .[] | .Username' | xargs -n 1 -P 5 -I % bash -c "echo adding %; aws cognito-idp admin-add-user-to-group --user-pool-id $userPoolId --group-name member --username %"
aws cognito-idp list-users --user-pool-id $1 | jq -r '.Users | .[] | .Username' | xargs -n 1 -P 5 -I % bash -c "echo adding %; aws cognito-idp admin-add-user-to-group --user-pool-id $userPoolId --group-name membershipAdmin --username %"
rm $jobInfo
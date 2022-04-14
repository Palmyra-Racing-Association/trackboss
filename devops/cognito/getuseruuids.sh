#!/bin/bash -e
export AWS_PAGER=""
userPoolId=$1
csvFile=$2

emails=(`cat $csvFile | cut -d ',' -f6`)
for email in ${emails[@]}; do
  uuid=`aws cognito-idp admin-get-user --user-pool-id us-east-1_8O5sjdZ25 --username $email | jq -r .Username`
  echo "update member set uuid = '$uuid', last_modified_date = now() where email = '$email';";
done
echo $emails
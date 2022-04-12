#!/bin/bash -e
export AWS_PAGER=""
userPoolId=$1
# easy delete to clean up the user pool before loading it. This gives me one button push which is awesome.
aws cognito-idp list-users --user-pool-id $1 | jq -r '.Users | .[] | .Username' | xargs -n 1 -P 5 -I % bash -c "echo Deleting %; aws cognito-idp admin-delete-user --user-pool-id $userPoolId --username %"
aws cognito-idp delete-group --group-name admin --user-pool-id $userPoolId
aws cognito-idp delete-group --group-name member --user-pool-id $userPoolId
aws cognito-idp delete-group --group-name membershipAdmin --user-pool-id $userPoolId
#!/bin/bash -e

# easy delete to clean up the user pool before loading it. This gives me one button push which is awesome.
aws cognito-idp list-users --user-pool-id $1 | jq -r '.Users | .[] | .Username' | xargs -n 1 -P 5 -I % bash -c "echo Deleting %; aws cognito-idp admin-delete-user --user-pool-id $COGNITO_USER_POOL_ID --username %"

# now create a job to load the user pool.
aws cognito-idp create-user-import-job --user-pool-id $1 --job-name "initialImport-`date +%s`" --cloud-watch-logs-role-arn arn:aws:iam::425610073499:role/service-role/Cognito-UserImport-Role


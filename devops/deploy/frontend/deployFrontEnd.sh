#!/bin/bash
npm install
echo "Deploying front end, here is the CDK diff."
npx cdk diff
echo "Deploying Track Boss front end.  Most of the time this will just update S3 objects"
npx cdk deploy --require-approval never
echo "Track Boss front end deployed.  Please update any DNS records in Bluehost if needed."
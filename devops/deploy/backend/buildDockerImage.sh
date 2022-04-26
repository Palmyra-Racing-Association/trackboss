#!/bin/bash
imageName="pra/trackbossapi:latest"
dockerRegistry="425610073499.dkr.ecr.us-east-1.amazonaws.com"
gitCommitId=`git rev-parse --short HEAD`
echo "Building docker image for $gitCommitId"
docker build --platform linux/amd64 -t $imageName .
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $dockerRegistry
docker tag $imageName $dockerRegistry/$imageName
docker push $dockerRegistry/$imageName
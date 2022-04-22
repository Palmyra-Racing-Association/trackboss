#!/bin/bash
gitCommitId=`git rev-parse --short HEAD`
echo "Building docker image for $gitCommitId"
docker build -t pra/trackbossapi:latest .
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 425610073499.dkr.ecr.us-east-1.amazonaws.com
docker tag pra/trackbossapi:latest 425610073499.dkr.ecr.us-east-1.amazonaws.com/pra/trackbossapi:latest
docker push 425610073499.dkr.ecr.us-east-1.amazonaws.com/pra/trackbossapi:latest
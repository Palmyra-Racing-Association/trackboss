#!/bin/bash
sudo yum install -y awscli
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 425610073499.dkr.ecr.us-east-1.amazonaws.com
docker pull 425610073499.dkr.ecr.us-east-1.amazonaws.com/pra/trackbossapi:latest
aws s3 cp s3://praconfig/tbenv-test ./
docker run --env-file tbenv-test 425610073499.dkr.ecr.us-east-1.amazonaws.com/pra/trackbossapi:latest -p 3000:3000
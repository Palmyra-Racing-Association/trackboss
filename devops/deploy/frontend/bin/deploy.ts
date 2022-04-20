#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { DeployStack } from '../lib/deploy-stack';

const app = new cdk.App();
const stackName = process.env.ENVIRONMENT_NAME || 'trackboss';
// eslint-disable-next-line no-new
new DeployStack(app, `${stackName}-frontend-stack`);

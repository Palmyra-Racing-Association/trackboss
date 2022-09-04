#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { DeployStack } from '../lib/deploy-stack';

const app = new App();
const stackName = process.env.TRACKBOSS_ENVIRONMENT_NAME || 'trackboss';
// eslint-disable-next-line no-new
new DeployStack(app, `${stackName}-frontend-stack`);

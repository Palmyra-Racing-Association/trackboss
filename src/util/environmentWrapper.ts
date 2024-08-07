/* eslint-disable import/prefer-default-export */
import AWS from 'aws-sdk';
import logger from '../logger';

let squareObject : any;

export async function getEnvironmentParameter(name: string) {
    const ssmClient = new AWS.SSM({
        apiVersion: '2014-11-06',
        region: 'us-east-1',
    });
    const paramValue = '';
    try {
        const envData = await ssmClient.getParameter({
            Name: `/${name}`,
            WithDecryption: true,
        }).promise();
        logger.info(`Retrieved environment parameter ${name}`);
        return envData.Parameter?.Value;
    } catch (error) {
        logger.error(error);
    }
    return paramValue;
}

export async function getCognitoPoolId() {
    return getEnvironmentParameter('cognitoPoolId');
}

export async function getCognitoClientId() {
    return getEnvironmentParameter('cognitoClientId');
}

export async function getSquareObject() {
    if (!squareObject) {
        const secretsClient = new AWS.SecretsManager();
        const secretValue = await secretsClient.getSecretValue({
            SecretId: '/trackboss/app/square',
        }).promise();
        logger.info('Pulled Square login info');
        squareObject = JSON.parse(secretValue.SecretString || '');
    }
    return squareObject;
}

export async function getConnectionObject() {
    const secretsClient = new AWS.SecretsManager();
    const secretValue = await secretsClient.getSecretValue({
        SecretId: '/trackboss/app/rds',
    }).promise();
    logger.info('Pulled database connection info');
    return JSON.parse(secretValue.SecretString || '');
}

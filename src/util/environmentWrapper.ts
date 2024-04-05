/* eslint-disable import/prefer-default-export */
import AWS from 'aws-sdk';
import logger from '../logger';

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

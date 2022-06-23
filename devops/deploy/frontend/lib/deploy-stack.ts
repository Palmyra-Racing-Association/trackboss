/* eslint-disable import/prefer-default-export */
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deployment from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import { Duration } from '@aws-cdk/core';

export class DeployStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const environmentName = process.env.TRACKBOSS_ENVIRONMENT_NAME || 'trackboss';
    const projectRoot = process.env.PROJECT_ROOT;
    const domains = [`${environmentName}.palmyramx.com`];
    const bucketName = `${environmentName}-frontend-deploy-bucket`;
    const certArns = ['arn:aws:acm:us-east-1:425610073499:certificate/139b9cfa-087f-4e30-8565-cceb33ec6a21'];
    for (let index = 0; index < domains.length; index++) {
      let domain = domains[index];
      const deploymentBucket = new s3.Bucket(this, bucketName, {
        bucketName: domain,
        // lifecycle rules are flippant, but this is ephemeral build stuff
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
        versioned: false,
        encryption: s3.BucketEncryption.S3_MANAGED,
        // it is a public website after all!
        publicReadAccess: true,
        websiteIndexDocument: 'index.html',
        websiteErrorDocument: 'error.html',
      });

      // eslint-disable-next-line no-unused-vars
      const deployment = new s3Deployment.BucketDeployment(this, 'deployStaticWebsite', {
        sources: [s3Deployment.Source.asset(`${projectRoot}/frontend/build`)],
        destinationBucket: deploymentBucket,
      });

      const certificate = acm.Certificate.fromCertificateArn(
        this,
        'Certificate',
        // found using aws acm list-certificates --region us-east-1
        certArns[index],
      );

      const cachePolicy = new cloudfront.CachePolicy(this, 'cachePolicy', {
        cachePolicyName: `${environmentName}CachePolicy`,
        comment: 'A default policy for a Track Boss environment',
        defaultTtl: Duration.minutes(10),
      });

      // eslint-disable-next-line no-unused-vars
      const distribution = new cloudfront.Distribution(this, 'applyToCdnDistribution', {
        defaultBehavior: {
          cachePolicy,
          origin: new origins.S3Origin(deploymentBucket),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        domainNames: [domain],
        certificate: certificate,
      });

      const cloudfrontOutput = new cdk.CfnOutput(this, 'bucketName', {
        value: distribution.domainName,
        description: 'Distribution domain name',
        exportName: 'distributionDomainName',
      });
    }
  }
}

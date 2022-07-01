/* eslint-disable import/prefer-default-export */
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deployment from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as route53 from '@aws-cdk/aws-route53';
import { Duration } from '@aws-cdk/core';

export class DeployStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const environmentName = process.env.TRACKBOSS_ENVIRONMENT_NAME || 'trackboss';
    const projectRoot = process.env.PROJECT_ROOT;
    const domains = [`${environmentName}.hogbackmx.com`];
    const bucketName = `${environmentName}-frontend-deploy-bucket`;
    const certArns = ['arn:aws:acm:us-east-1:425610073499:certificate/6bdd2367-df28-4226-866d-8d057ce0f496'];
    for (let index = 0; index < domains.length; index++) {
      let domain = domains[index];
      const deploymentBucket = new s3.Bucket(this, bucketName+domain, {
        bucketName: domain+'-frontend',
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
      const deployment = new s3Deployment.BucketDeployment(this, 'deployStaticWebsite'+domain, {
        sources: [s3Deployment.Source.asset(`${projectRoot}/frontend/build`)],
        destinationBucket: deploymentBucket,
      });

      const certificate = acm.Certificate.fromCertificateArn(
        this,
        'Certificate'+domain,
        // found using aws acm list-certificates --region us-east-1
        certArns[index],
      );

      const cachePolicy = new cloudfront.CachePolicy(this, 'cachePolicy'+domain, {
        cachePolicyName: `${environmentName}-frontEndCachePolicy`,
        comment: 'A default policy for a Track Boss environment',
        defaultTtl: Duration.minutes(10),
      });

      // eslint-disable-next-line no-unused-vars
      const distribution = new cloudfront.Distribution(this, 'applyToCdnDistribution'+domain, {
        defaultBehavior: {
          cachePolicy,
          origin: new origins.S3Origin(deploymentBucket),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        domainNames: [domain],
        certificate: certificate,
      });

      const zone = route53.HostedZone.fromHostedZoneAttributes(this, 'trackbossZone',
        {
          hostedZoneId: 'Z01677201PBLHEH8PE24N',
          zoneName: 'hogbackmx.com'
        },
      );
      const dnsARecord = new route53.ARecord(this, 'TrackBossApiAliasRecord', {
        zone,
        recordName: `${process.env.TRACKBOSS_ENVIRONMENT_NAME}.hogbackmx.com`,
        target: route53.RecordTarget.fromAlias({
          bind() {
            return {
              dnsName: distribution.domainName,
              hostedZoneId: 'Z2FDTNDATAQYW2',
            }
          }
        })
      });

      const cloudfrontOutput = new cdk.CfnOutput(this, 'bucketName', {
        value: distribution.domainName,
        description: 'Distribution domain name',
        exportName: `distributionDomainName-${process.env.TRACKBOSS_ENVIRONMENT_NAME}`,
      });
    }
  }
}

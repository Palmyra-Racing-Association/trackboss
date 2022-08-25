import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as iam from '@aws-cdk/aws-iam';
import * as route53 from '@aws-cdk/aws-route53';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as rds from '@aws-cdk/aws-rds';
import * as cdk from '@aws-cdk/core';
import { Tags } from '@aws-cdk/core';
import * as logs from '@aws-cdk/aws-logs';
import * as ssm from '@aws-cdk/aws-ssm';

export class DeployStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const account = cdk.Stack.of(this).account;
    const region = cdk.Stack.of(this).region;

    const vpc = ec2.Vpc.fromLookup(this, 'ImportVPC',{isDefault: true});
    
    const environmentName = process.env.TRACKBOSS_ENVIRONMENT_NAME || 'trackboss';

    const alb = new elbv2.ApplicationLoadBalancer(this, 'alb', {
      loadBalancerName: `${environmentName}-alb`,
      vpc,
      internetFacing: true,
    });

    const zone = route53.HostedZone.fromHostedZoneAttributes(this, 'trackbossZone', 
        {
            hostedZoneId: 'Z01677201PBLHEH8PE24N',
            zoneName: 'hogbackmx.com'
        },
    );
    const dnsARecord = new route53.ARecord(this, 'TrackBossApiAliasRecord', {
        zone,
        recordName: `${environmentName}api.hogbackmx.com`,
        target: route53.RecordTarget.fromAlias({
            bind() {
                return {
                    dnsName: alb.loadBalancerDnsName,
                    hostedZoneId: alb.loadBalancerCanonicalHostedZoneId,
                }
            }
        })
    });

    const hogbackmxCert = new acm.DnsValidatedCertificate(this, 'backendCertificateApi', {
        domainName: '*.hogbackmx.com',
        hostedZone: zone,
        region: 'us-east-1',
    });

      const listener = alb.addListener('Listener',
          {
              port: 4443,
              open: true,
              protocol: elbv2.ApplicationProtocol.HTTPS,
              certificates: [
                  hogbackmxCert,
              ],
          }
      );

    const dockerReg = `${account}.dkr.ecr.${region}.amazonaws.com`;
    const dockerImg = `${dockerReg}/pra/trackbossapi:latest`;

    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      'sudo su',
      'yum install -y awscli',
      `aws s3 cp s3://praconfig/${environmentName}-env /home/ec2-user`,
      `aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${dockerReg}`,
      `docker pull ${dockerImg}`,
      `docker run -p 3000:3000 --env-file /home/ec2-user/${environmentName}-env ${dockerImg}`,
    );

    const asg = new autoscaling.AutoScalingGroup(this, 'asg', {
      vpc,
      autoScalingGroupName: `${environmentName}-backend-asg`,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.SMALL,
      ),
      // see https://aws.amazon.com/ec2/pricing/on-demand/ for this number. This should be checked against
      // instance classes every once in a while to make sure that this is optimal.
      spotPrice: '0.023',
      keyName: 'prakeyz',
      role: iam.Role.fromRoleName(this, 'ec2-role', 'ec2_aws_access'),
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
      userData,
      minCapacity: 1,
      maxCapacity: 1,
    });

    listener.addTargets('trackboss-api', {
      port: 3000,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targets: [asg],
      priority: 1,
      conditions: [
        elbv2.ListenerCondition.hostHeaders(
            [`${environmentName}api.hogbackmx.com`]
        ),
      ],
      healthCheck: {
        path: '/api/health',
        unhealthyThresholdCount: 2,
        healthyThresholdCount: 5,
        interval: cdk.Duration.seconds(30),
      },
    });

    listener.addAction('trackboss', {
      // priority: 5,
      // conditions: [elbv2.ListenerCondition.pathPatterns(['/static'])],
      action: elbv2.ListenerAction.fixedResponse(200, {
        contentType: 'text/html',
        messageBody: '<h1>TrackBoss API</h1>',
      }),
    });

    // create DB security group that allows attaching to auto scaling group
    const rdsSecurityInBound = new ec2.SecurityGroup(this, 'rdsSecurityGroupInbound', {
      vpc,
      allowAllOutbound: true,
      description: 'inbound rules for database',
    })
    rdsSecurityInBound.connections.allowFrom(
      new ec2.Connections({
        securityGroups: asg.connections.securityGroups
      }), 
      ec2.Port.tcp(3306),
      'allow access to database from application server.'
    );

    
    const rdsInstance = rds.DatabaseInstance.fromDatabaseInstanceAttributes(this, 'trackBossAppDb', {
      instanceIdentifier: 'praclubmanager2-dev',
      instanceEndpointAddress: 'arn:aws:rds:us-east-1:425610073499:db:praclubmanager2-dev',
      port: 3306,
      securityGroups: [rdsSecurityInBound],
    });
    
    rdsInstance.connections.allowFrom(rdsSecurityInBound, ec2.Port.tcp(3306), 'Allow connections from app server');

    const taggableInfra = [asg, alb];
    taggableInfra.forEach(infraElement => {
      Tags.of(infraElement).add('EnvironmentName', environmentName);
      Tags.of(infraElement).add('Name', `${environmentName}-api`);  
    });

    const applicationLogsGroup = new logs.LogGroup(
      this, 'LogGroup', {
        logGroupName: `${environmentName}-api-logs`
      }
    );
    
    new ssm.StringParameter(this, 'cognitoPoolId', {
      allowedPattern: '.*',
      parameterName: 'cognitoPoolId',
      stringValue: process.env.COGNITO_POOL_ID || '',
      tier: ssm.ParameterTier.STANDARD,
    });
    
    new ssm.StringParameter(this, 'cognitoClientId', {
      allowedPattern: '.*',
      parameterName: 'cognitoClientId',
      stringValue: process.env.COGNITO_CLIENT_ID || '',
      tier: ssm.ParameterTier.STANDARD,
    });

    new ssm.StringParameter(this, 'clubEmail', {
      allowedPattern: '.*',
      parameterName: 'clubEmail',
      stringValue: process.env.CLUB_EMAIL || '',
      tier: ssm.ParameterTier.STANDARD,
    });

    new cdk.CfnOutput(this, 'albDNS', {
      value: alb.loadBalancerDnsName,
    });

    new cdk.CfnOutput(this, 'apiDns', {
      value: dnsARecord.domainName,
    });
  }
}
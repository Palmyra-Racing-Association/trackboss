import { App, CfnOutput, Duration, Size, Stack, StackProps, Tags } from 'aws-cdk-lib';
import { aws_autoscaling as autoscaling } from 'aws-cdk-lib';
import { aws_ec2 as ec2 } from 'aws-cdk-lib';
import { aws_ecs as ecs } from 'aws-cdk-lib';
import { aws_elasticloadbalancingv2 as elbv2 } from 'aws-cdk-lib';
import { aws_iam as iam } from 'aws-cdk-lib';
import { aws_certificatemanager as acm } from 'aws-cdk-lib';
import { aws_route53 as route53 } from 'aws-cdk-lib';
import { aws_rds as rds } from 'aws-cdk-lib';
import { aws_logs as logs } from 'aws-cdk-lib';
import { aws_ssm as ssm } from 'aws-cdk-lib';
import { aws_sqs as sqs } from 'aws-cdk-lib';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_lambda_event_sources as lambdaEventSources } from 'aws-cdk-lib';
import { DatabaseInstanceEngine, MysqlEngineVersion } from 'aws-cdk-lib/aws-rds';

export class DeployStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);
    const account = Stack.of(this).account;
    const region = Stack.of(this).region;

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
        interval: Duration.seconds(30),
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
    /*
    const bastionDisk: ec2.BlockDevice = {
      deviceName: '/dev/sda1',
      volume: ec2.BlockDeviceVolume.ebs(30, {encrypted: true}),
    };
    
    const windowsBastion = new ec2.Instance(this, 'windowsBastion', {
      vpc,
      instanceName: `${environmentName}-bastion`,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.SMALL,
      ),      
      machineImage: new ec2.WindowsImage(ec2.WindowsVersion.WINDOWS_SERVER_2022_ENGLISH_FULL_BASE),
      keyName: 'prakeyz',
      blockDevices: [bastionDisk],
    });

    windowsBastion.addUserData(`
      Set-ExecutionPolicy Bypass -Scope Process -Force; 
      [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; 
      iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'));
      choco install mysql.workbench;
      & "C:\Program Files\MySQL\MySQL Workbench 8.0 CE\MySQLWorkbench.exe"`);

    // Elastic IP
    const eip = new ec2.CfnEIP(this, "Ip", 
      { 
        instanceId: windowsBastion.instanceId,
      }
    )
    */

    // create DB security group that allows attaching to auto scaling group
    const rdsSecurityInBound = new ec2.SecurityGroup(this, 'rdsSecurityGroupInbound', {
      vpc,
      allowAllOutbound: true,
      description: 'inbound rules for database',
    })

    const rdsInboundGroups = asg.connections.securityGroups;
    /*
    windowsBastion.connections.securityGroups.forEach((group) => {
      rdsInboundGroups.push(group);
    });
    */

    rdsSecurityInBound.connections.allowFrom(
      new ec2.Connections({
        securityGroups: rdsInboundGroups,
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

    // create queue
    const emailQueue = new sqs.Queue(this, 'trackboss-email-queue', {
        queueName: 'trackboss-queue-EMAIL',
        visibilityTimeout: Duration.minutes(10),
    });

    const textQueue = new sqs.Queue(this, 'trackboss-text-queue', {
        queueName: 'trackboss-queue-TEXT',
        visibilityTimeout: Duration.minutes(10),
    });
    
    const rdsParamGroup = new rds.ParameterGroup(this, 'trackbossRdsParamGroup', {
      engine: DatabaseInstanceEngine.mysql({ version: MysqlEngineVersion.VER_5_7 }),
      description: 'RDS MySql parameter group to allow the use of triggers.', 
    });  
    rdsParamGroup.addParameter('log_bin_trust_function_creators','1');
    
    // inbound handling for text messages
    const inboundMemberCommLambda = new lambda.Function(this, 'inboundMemberCommHandler', {
        runtime: lambda.Runtime.NODEJS_16_X,
        tracing: lambda.Tracing.ACTIVE,
        code: lambda.Code.fromAsset('../../../lambda'),
        handler: 'messageProcessor.handler',
        environment: {},
        timeout: Duration.minutes(10),
    });
    emailQueue.grantConsumeMessages(inboundMemberCommLambda);
    textQueue.grantConsumeMessages(inboundMemberCommLambda);
    const memberCommIamPolicy = new iam.PolicyStatement();
    memberCommIamPolicy.addActions('ses:SendEmail', 'ses:SendRawEmail');
    memberCommIamPolicy.addActions('ses:SendEmail', 'ses:SendHtmlEmail');
    memberCommIamPolicy.addResources('*');
    memberCommIamPolicy.addActions('sns:Publish');
    memberCommIamPolicy.addResources('*');
    inboundMemberCommLambda.addToRolePolicy(memberCommIamPolicy);
    inboundMemberCommLambda.addEventSource(new lambdaEventSources.SqsEventSource(emailQueue));
    inboundMemberCommLambda.addEventSource(new lambdaEventSources.SqsEventSource(textQueue));

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

    new CfnOutput(this, 'albDNS', {
      value: alb.loadBalancerDnsName,
    });

    new CfnOutput(this, 'apiDns', {
      value: dnsARecord.domainName,
    });

    /*
    new CfnOutput(this, 'bastionDns', {
      value: eip.attrPublicIp,
    })
    */
  }
}
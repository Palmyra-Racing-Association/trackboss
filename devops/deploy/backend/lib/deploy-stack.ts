import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';

export class DeployStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, 'ImportVPC',{isDefault: true});

    const alb = elbv2.ApplicationLoadBalancer.fromLookup(this, 'alb', {
      loadBalancerArn: 'arn:aws:elasticloadbalancing:us-east-1:425610073499:loadbalancer/app/4343HogbackHill-lb/2bd650d93825f0dd',
    });

    const listener = alb.addListener('Listener', {
      port: 81,
      open: true,
      protocol: elbv2.ApplicationProtocol.HTTPS,
      certificates: [elbv2.ListenerCertificate.fromArn('arn:aws:acm:us-east-1:425610073499:certificate/eca2cbf8-247e-4edc-86fb-99c8f28c9dd7')],
    });

    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      'sudo su',
      'yum install -y httpd',
      'yum install -y awscli',
      'systemctl start httpd',
      'systemctl enable httpd',
      'echo "<h1>Hello World from $(hostname -f)</h1>" > /var/www/html/index.html',
    );

    const asg = new autoscaling.AutoScalingGroup(this, 'asg', {
      vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO,
      ),
      role: iam.Role.fromRoleName(this, 'ec2-role', 'ec2_aws_access'),
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
      userData,
      minCapacity: 1,
      maxCapacity: 1,
    });

    listener.addTargets('default-target', {
      port: 80,
      targets: [asg],
      healthCheck: {
        path: '/',
        unhealthyThresholdCount: 2,
        healthyThresholdCount: 5,
        interval: cdk.Duration.seconds(30),
      },
    });

    listener.addAction('/static', {
      priority: 5,
      conditions: [elbv2.ListenerCondition.pathPatterns(['/static'])],
      action: elbv2.ListenerAction.fixedResponse(200, {
        contentType: 'text/html',
        messageBody: '<h1>Static ALB Response</h1>',
      }),
    });

    new cdk.CfnOutput(this, 'albDNS', {
      value: alb.loadBalancerDnsName,
    });
  }
}
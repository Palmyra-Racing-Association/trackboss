import { App, CfnOutput, Duration, Stack, StackProps, Tags } from 'aws-cdk-lib';
import { aws_rds as rds } from 'aws-cdk-lib';
import { aws_ec2 as ec2 } from 'aws-cdk-lib';
import { SubnetGroup } from 'aws-cdk-lib/aws-rds';

export class TestDbStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);
    const account = Stack.of(this).account;
    const region = Stack.of(this).region;
    const vpc = ec2.Vpc.fromLookup(this, 'vpc', { isDefault:true });
    const testRds = new rds.DatabaseInstanceFromSnapshot(this, 'TbTest', {
      snapshotIdentifier: process.env.TRACKBOSS_RDS_LATEST || '',
      engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_5_7_38 }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
      publiclyAccessible: true,
      subnetGroup: SubnetGroup.fromSubnetGroupName(this, 'subnets', 'default'),
      vpc,
      storageType: rds.StorageType.GP2,
      allocatedStorage: 20,
    });
    // create DB security group that allows attaching to auto scaling group
    const rdsSecurityInBound = new ec2.SecurityGroup(this, 'rdsSecurityGroupInbound', {
      vpc,
      allowAllOutbound: true,
      description: 'inbound rules for database',
    })
    rdsSecurityInBound.connections.allowFrom(
      new ec2.Connections(), 
      ec2.Port.tcp(3306),
      'allow access to database from application server.'
    );    

    testRds.connections.allowFrom(rdsSecurityInBound, ec2.Port.tcp(3306), 'Allow connections from app server');

    /*
    new CfnOutput(this, 'apiDns', {
      value: testRds.dbInstanceEndpointAddress,
    });
    */
  }
}

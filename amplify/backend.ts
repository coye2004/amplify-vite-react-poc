import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { IAspect, CfnResource, Aspects } from 'aws-cdk-lib';
import { Construct, IConstruct } from 'constructs';

// CDK Aspect to automatically apply ADSK-Boundary to all IAM roles
class PermissionsBoundaryAspect implements IAspect {
  private readonly permissionsBoundaryArn: string;

  constructor(permissionsBoundaryArn: string) {
    this.permissionsBoundaryArn = permissionsBoundaryArn;
  }

  visit(node: IConstruct): void {
    if (node instanceof CfnResource && node.cfnResourceType === 'AWS::IAM::Role') {
      node.addPropertyOverride('PermissionsBoundary', this.permissionsBoundaryArn);
    }
  }
}

const backend = defineBackend({
  auth,
  data,
});

const ADSK_BOUNDARY_ARN = 'arn:aws:iam::720853352242:policy/ADSK-Boundary';

// Apply ADSK-Boundary to all roles - this is all we need for compliance
Aspects.of(backend.stack).add(new PermissionsBoundaryAspect(ADSK_BOUNDARY_ARN));

console.log('✅ ADSK-Boundary applied to all IAM roles!');

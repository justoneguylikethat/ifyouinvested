import {
  IAMClient,
  AttachRolePolicyCommand,
  PutRolePolicyCommand,
  ListAttachedRolePoliciesCommand,
  ListRolePoliciesCommand,
} from '@aws-sdk/client-iam';

const credentials = {
  accessKeyId: process.env.REMOTION_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REMOTION_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY,
};


const iam = new IAMClient({ region: 'us-east-1', credentials });
const ROLE = 'remotion-lambda-role';
const ACCOUNT_ID = '339712833884';
const REGION = 'us-east-2';

// Remotion-required inline policy covering S3, Lambda invocation, and logs
const remotionPolicy = {
  Version: '2012-10-17',
  Statement: [
    {
      Sid: 'S3BucketAccess',
      Effect: 'Allow',
      Action: [
        's3:GetObject',
        's3:DeleteObject',
        's3:PutObject',
        's3:PutObjectAcl',
        's3:GetObjectAcl',
        's3:ListBucket',
        's3:ListAllMyBuckets',
        's3:GetBucketLocation',
        's3:CreateBucket',
        's3:PutBucketAcl',
        's3:GetBucketAcl',
        's3:PutLifecycleConfiguration',
        's3:GetLifecycleConfiguration',
        's3:DeleteBucket',
        's3:AbortMultipartUpload',
        's3:ListMultipartUploadParts',
      ],
      Resource: '*',
    },
    {
      Sid: 'LambdaAccess',
      Effect: 'Allow',
      Action: [
        'lambda:InvokeFunction',
        'lambda:InvokeAsync',
        'lambda:GetFunction',
      ],
      Resource: `arn:aws:lambda:${REGION}:${ACCOUNT_ID}:function:*`,
    },
    {
      Sid: 'LogsAccess',
      Effect: 'Allow',
      Action: [
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
        'logs:DescribeLogStreams',
        'logs:FilterLogEvents',
        'logs:GetLogEvents',
      ],
      Resource: '*',
    },
  ],
};

async function main() {
  console.log(`\n🔍 Current policies on "${ROLE}":`);

  const attached = await iam.send(new ListAttachedRolePoliciesCommand({ RoleName: ROLE }));
  console.log('  Managed:', attached.AttachedPolicies.map(p => p.PolicyName));

  const inline = await iam.send(new ListRolePoliciesCommand({ RoleName: ROLE }));
  console.log('  Inline:', inline.PolicyNames);

  console.log('\n📎 Attaching AWSLambdaBasicExecutionRole (managed)...');
  try {
    await iam.send(new AttachRolePolicyCommand({
      RoleName: ROLE,
      PolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
    }));
    console.log('  ✅ Already attached or attached now.');
  } catch (e) {
    console.log('  ⚠️', e.message);
  }

  console.log('\n📝 Putting RemotionRenderPermissions inline policy...');
  await iam.send(new PutRolePolicyCommand({
    RoleName: ROLE,
    PolicyName: 'RemotionRenderPermissions',
    PolicyDocument: JSON.stringify(remotionPolicy),
  }));
  console.log('  ✅ RemotionRenderPermissions attached!');

  console.log('\n✅ Final policies on role:');
  const finalAttached = await iam.send(new ListAttachedRolePoliciesCommand({ RoleName: ROLE }));
  const finalInline = await iam.send(new ListRolePoliciesCommand({ RoleName: ROLE }));
  console.log('  Managed:', finalAttached.AttachedPolicies.map(p => p.PolicyName));
  console.log('  Inline:', finalInline.PolicyNames);
  console.log('\n🎉 Done! Lambda role now has full Remotion permissions.\n');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

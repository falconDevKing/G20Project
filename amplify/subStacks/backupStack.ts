import { Duration, Stack, RemovalPolicy } from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

const backupDuration = +(process.env.GGP_BACKUP_DURATION || "24");

export const backUpBucketStack = ({
  stack,
  stackName,
  expirationDays,
  backUpDataLambda,
}: {
  stack: Stack;
  stackName: string;
  expirationDays: number;
  backUpDataLambda: NodejsFunction;
}) => {
  const backUpBucket = new s3.Bucket(stack, `BackupBucket-${stackName}`, {
    bucketName: "ggpbackupbucket-" + stackName,

    // Security best practices
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    encryption: s3.BucketEncryption.S3_MANAGED,
    enforceSSL: true,

    // Optional but common in non-prod: auto-delete + destroy  // For prod, usually keep RETAIN.
    removalPolicy: RemovalPolicy.RETAIN,

    lifecycleRules: [
      {
        enabled: true,
        expiration: Duration.days(expirationDays),

        // Optional: tidy up incomplete multipart uploads
        abortIncompleteMultipartUploadAfter: Duration.days(7),
      },
    ],
  });

  const createBackUpScheduleRule = new events.Rule(stack, `CreateBackUpScheduleRule-${stackName}`, {
    // Every day at 00:05 UTC. Adjust to local time as needed.
    ruleName: `DailyCreateBackUpRule-${stackName}`,
    schedule: events.Schedule.rate(Duration.hours(backupDuration)),
  });

  createBackUpScheduleRule.addTarget(
    new targets.LambdaFunction(backUpDataLambda, {
      event: events.RuleTargetInput.fromObject({}),
    }),
  );

  backUpBucket.grantPut(backUpDataLambda);
  backUpDataLambda.addEnvironment("BUCKET_NAME", backUpBucket.bucketName);

  return { backUpBucket, createBackUpScheduleRule };
};

import { Duration, Stack } from "aws-cdk-lib";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export const configureUserWeddingAnniversaryWorkflow = ({
  stack,
  stackName,
  userWeddingAnniversaryMailLambda,
}: {
  stack: Stack;
  stackName: string;
  userWeddingAnniversaryMailLambda: NodejsFunction;
}) => {
  const userWeddingAnniversaryProcessorTask = new tasks.LambdaInvoke(stack, `RunUserWeddingAnniversaryProcessor-${stackName}`, {
    lambdaFunction: userWeddingAnniversaryMailLambda,
    payload: sfn.TaskInput.fromJsonPathAt("$"),
    outputPath: "$.Payload",
  });

  const checkIfMoreWeddingAnniversaryUsers = new sfn.Choice(stack, `HasMoreWeddingAnniversaryUserBatches-${stackName}`)
    .when(sfn.Condition.booleanEquals("$.loop", true), userWeddingAnniversaryProcessorTask)
    .otherwise(new sfn.Succeed(stack, `AllWeddingAnniversaryUserBatchesProcessed-${stackName}`));

  const userWeddingAnniversaryStateMachine = new sfn.StateMachine(stack, `UserWeddingAnniversaryStateMachine-${stackName}`, {
    stateMachineName: `UserWeddingAnniversaryStateMachine-${stackName}`,
    definition: userWeddingAnniversaryProcessorTask.next(checkIfMoreWeddingAnniversaryUsers),
    timeout: Duration.hours(3),
  });

  const userWeddingAnniversaryScheduleRule = new events.Rule(stack, `UserWeddingAnniversaryScheduleRule-${stackName}`, {
    ruleName: `DailyUserWeddingAnniversaryRule-${stackName}`,
    schedule: events.Schedule.cron({
      minute: "0",
      hour: "9",
    }),
  });

  userWeddingAnniversaryScheduleRule.addTarget(
    new targets.SfnStateMachine(userWeddingAnniversaryStateMachine, {
      input: events.RuleTargetInput.fromObject({
        nextToken: null,
        loop: true,
      }),
    }),
  );

  return {
    userWeddingAnniversaryStateMachine,
    userWeddingAnniversaryScheduleRule,
  };
};

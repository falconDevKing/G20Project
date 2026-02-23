import { Duration, Stack } from "aws-cdk-lib";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
// import { IFunction } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export const configureAdminBirthdayWorkflow = ({
  stack,
  stackName,
  adminBirthdayMailLambda,
}: {
  stack: Stack;
  stackName: string;
  adminBirthdayMailLambda: NodejsFunction;
}) => {
  const adminBirthdayProcessorTask = new tasks.LambdaInvoke(stack, `RunAdminBirthdayProcessor-${stackName}`, {
    lambdaFunction: adminBirthdayMailLambda, // or your actual processor lambda
    // If you want to pass something in, add it here. For now we let the Lambda determine "today".
    payload: sfn.TaskInput.fromJsonPathAt("$"),
    //  sfn.TaskInput.fromObject({}),
    outputPath: "$.Payload",
    // resultPath: sfn.JsonPath.DISCARD, // we do not care about the Lambda result in the state machine
  });

  const checkIfMoreAdminsBirthday = new sfn.Choice(stack, "HasMoreAdminBatches?")
    .when(
      sfn.Condition.booleanEquals("$.loop", true),
      adminBirthdayProcessorTask, // loop back
    )
    .otherwise(new sfn.Succeed(stack, "AllAdminBatchesProcessed"));

  const adminBirthdayStateMachineDefinition = adminBirthdayProcessorTask.next(checkIfMoreAdminsBirthday);

  const adminBirthdayStateMachine = new sfn.StateMachine(stack, `AdminBirthdayStateMachine-${stackName}`, {
    stateMachineName: `AdminsBirthdayStateMachine-${stackName}`,
    definition: adminBirthdayStateMachineDefinition,
    timeout: Duration.hours(3), // adjust if your Lambda may run longer
  });

  const adminBirthdayScheduleRule = new events.Rule(stack, `AdminBirthdayScheduleRule-${stackName}`, {
    // Every day at 00:05 UTC. Adjust to local time as needed.
    ruleName: `WeeklyAdminBirthdayRule-${stackName}`,
    schedule: events.Schedule.cron({
      minute: "30",
      hour: "7",
      weekDay: "1",
      // day, month, year left as "*" for "every"
    }),
  });

  // Target: start the Step Function
  adminBirthdayScheduleRule.addTarget(
    new targets.SfnStateMachine(adminBirthdayStateMachine, {
      // If you need to pass dynamic input, you can use RuleTargetInput
      // For a simple "run with empty input", you can omit this.
      input: events.RuleTargetInput.fromObject({
        chapterFocusIndex: 0,
        nextToken: null,
        loop: true,
      }),
    }),
  );

  // Optional: return things if you ever want to reference them elsewhere
  return {
    adminBirthdayStateMachine,
    adminBirthdayScheduleRule,
  };
};

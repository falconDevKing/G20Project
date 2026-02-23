import { Duration, Stack } from "aws-cdk-lib";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
// import { IFunction } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export const configureUserBirthdayWorkflow = ({
  stack,
  stackName,
  userBirthdayMailLambda,
}: {
  stack: Stack;
  stackName: string;
  userBirthdayMailLambda: NodejsFunction;
}) => {
  const userBirthdayProcessorTask = new tasks.LambdaInvoke(stack, `RunUserBirthdayProcessor-${stackName}`, {
    lambdaFunction: userBirthdayMailLambda, // or your actual processor lambda
    // If you want to pass something in, add it here. For now we let the Lambda determine "today".
    payload: sfn.TaskInput.fromJsonPathAt("$"),
    //  sfn.TaskInput.fromObject({}),
    outputPath: "$.Payload",
    // resultPath: sfn.JsonPath.DISCARD, // we do not care about the Lambda result in the state machine
  });

  const checkIfMoreUsersBirthday = new sfn.Choice(stack, "HasMoreUserBatches?")
    .when(
      sfn.Condition.booleanEquals("$.loop", true),
      userBirthdayProcessorTask, // loop back
    )
    .otherwise(new sfn.Succeed(stack, "AllUserBatchesProcessed"));

  const userBirthdayStateMachineDefinition = userBirthdayProcessorTask.next(checkIfMoreUsersBirthday);

  const birthdayStateMachine = new sfn.StateMachine(stack, `UserBirthdayStateMachine-${stackName}`, {
    stateMachineName: `BirthdayStateMachine-${stackName}`,
    definition: userBirthdayStateMachineDefinition,
    timeout: Duration.hours(3), // adjust if your Lambda may run longer
  });

  const userBirthdayScheduleRule = new events.Rule(stack, `UserBirthdayScheduleRule-${stackName}`, {
    // Every day at 00:05 UTC. Adjust to local time as needed.
    ruleName: `DailyUserBirthdayRule-${stackName}`,
    schedule: events.Schedule.cron({
      minute: "0",
      hour: "9",
      // day, month, year left as "*" for "every"
    }),
  });

  // Target: start the Step Function
  userBirthdayScheduleRule.addTarget(
    new targets.SfnStateMachine(birthdayStateMachine, {
      // If you need to pass dynamic input, you can use RuleTargetInput
      // For a simple "run with empty input", you can omit this.
      input: events.RuleTargetInput.fromObject({
        nextToken: null,
        loop: true,
      }),
    }),
  );

  // Optional: return things if you ever want to reference them elsewhere
  return {
    birthdayStateMachine,
    userBirthdayScheduleRule,
  };
};

import { Duration, Stack } from "aws-cdk-lib";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
// import { IFunction } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export const configureUpdateUserStatusWorkflow = ({
  stack,
  stackName,
  updateUserStatusLambda,
}: {
  stack: Stack;
  stackName: string;
  updateUserStatusLambda: NodejsFunction;
}) => {
  const userStatusUpdateProcessorTask = new tasks.LambdaInvoke(stack, `RunUserStatusUpdateProcessor-${stackName}`, {
    lambdaFunction: updateUserStatusLambda, // or your actual processor lambda
    // If you want to pass something in, add it here. For now we let the Lambda determine "today".
    payload: sfn.TaskInput.fromJsonPathAt("$"),
    //  sfn.TaskInput.fromObject({}),
    outputPath: "$.Payload",
    // resultPath: sfn.JsonPath.DISCARD, // we do not care about the Lambda result in the state machine
  });

  const checkIfMoreUsersStatuses = new sfn.Choice(stack, "HasMoreUserStatuses?")
    .when(
      sfn.Condition.booleanEquals("$.loop", true),
      userStatusUpdateProcessorTask, // loop back
    )
    .otherwise(new sfn.Succeed(stack, "AllUserStatusesProcessed"));

  const userStatusUpdateStateMachineDefinition = userStatusUpdateProcessorTask.next(checkIfMoreUsersStatuses);

  const userStatusUpdateStateMachine = new sfn.StateMachine(stack, `UserStatusUpdateStateMachine-${stackName}`, {
    stateMachineName: `UserStatusStateMachine-${stackName}`,
    definition: userStatusUpdateStateMachineDefinition,
    timeout: Duration.hours(3), // adjust if your Lambda may run longer
  });

  const userStatusUpdateScheduleRule = new events.Rule(stack, `UserStatusUpdateScheduleRule-${stackName}`, {
    ruleName: `MonthlyUserStatusUpdateRule-${stackName}`,
    schedule: events.Schedule.cron({
      minute: "0",
      hour: "6",
      day: "1",
    }),
  });

  // Target: start the Step Function
  userStatusUpdateScheduleRule.addTarget(
    new targets.SfnStateMachine(userStatusUpdateStateMachine, {
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
    userStatusUpdateStateMachine,
    userStatusUpdateScheduleRule,
  };
};

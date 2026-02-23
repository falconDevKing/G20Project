import { Duration, Stack } from "aws-cdk-lib";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
// import { IFunction } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export const configureCreatePendingPaymentsWorkflow = ({
  stack,
  stackName,
  createPendingPaymentsLambda,
}: {
  stack: Stack;
  stackName: string;
  createPendingPaymentsLambda: NodejsFunction;
}) => {
  const createPendingPaymentsProcessorTask = new tasks.LambdaInvoke(stack, `RunCreatePendingPaymentsProcessor-${stackName}`, {
    lambdaFunction: createPendingPaymentsLambda, // or your actual processor lambda
    // If you want to pass something in, add it here. For now we let the Lambda determine "today".
    payload: sfn.TaskInput.fromJsonPathAt("$"),
    //  sfn.TaskInput.fromObject({}),
    outputPath: "$.Payload",
    // resultPath: sfn.JsonPath.DISCARD, // we do not care about the Lambda result in the state machine
  });

  const checkIfMoreCreatePendingPayments = new sfn.Choice(stack, "HasMoreCreatePendingPaymentsBatches?")
    .when(
      sfn.Condition.booleanEquals("$.loop", true),
      createPendingPaymentsProcessorTask, // loop back
    )
    .otherwise(new sfn.Succeed(stack, "AllPendingPaymentBatchesProcessed"));

  const createPendingPaymentsStateMachineDefinition = createPendingPaymentsProcessorTask.next(checkIfMoreCreatePendingPayments);

  const createPendingPaymentsStateMachine = new sfn.StateMachine(stack, `CreatePendingPaymentsStateMachine-${stackName}`, {
    stateMachineName: `CreatePendingPaymentsStateMachine-${stackName}`,
    definition: createPendingPaymentsStateMachineDefinition,
    timeout: Duration.hours(3), // adjust if your Lambda may run longer
  });

  const createPendingPaymentsScheduleRule = new events.Rule(stack, `CreatePendingPaymentsScheduleRule-${stackName}`, {
    // Every day at 00:05 UTC. Adjust to local time as needed.
    ruleName: `MonthlyCreatePendingPaymentsRule-${stackName}`,
    schedule: events.Schedule.cron({
      minute: "0",
      hour: "4",
      day: "1",
      // day, month, year left as "*" for "every"
    }),
  });

  // Target: start the Step Function
  createPendingPaymentsScheduleRule.addTarget(
    new targets.SfnStateMachine(createPendingPaymentsStateMachine, {
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
    createPendingPaymentsStateMachine,
    createPendingPaymentsScheduleRule,
  };
};

import { Duration, Stack } from "aws-cdk-lib";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
// import { IFunction } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export const configureProcessPendingPaymentsWorkflow = ({
  stack,
  stackName,
  processPendingPaymentsLambda,
}: {
  stack: Stack;
  stackName: string;
  processPendingPaymentsLambda: NodejsFunction;
}) => {
  const processPendingPaymentsProcessorTask = new tasks.LambdaInvoke(stack, `RunProcessPendingPaymentsProcessor-${stackName}`, {
    lambdaFunction: processPendingPaymentsLambda, // or your actual processor lambda
    // If you want to pass something in, add it here. For now we let the Lambda determine "today".
    payload: sfn.TaskInput.fromJsonPathAt("$"),
    //  sfn.TaskInput.fromObject({}),
    outputPath: "$.Payload",
    // resultPath: sfn.JsonPath.DISCARD, // we do not care about the Lambda result in the state machine
  });

  const checkIfMoreProcessPendingPayments = new sfn.Choice(stack, "HasMoreProcessPendingPaymentsBatches?")
    .when(
      sfn.Condition.booleanEquals("$.loop", true),
      processPendingPaymentsProcessorTask, // loop back
    )
    .otherwise(new sfn.Succeed(stack, "AllProcessPaymentBatchesProcessed"));

  const processPendingPaymentsStateMachineDefinition = processPendingPaymentsProcessorTask.next(checkIfMoreProcessPendingPayments);

  const processPendingPaymentsStateMachine = new sfn.StateMachine(stack, `ProcessPendingPaymentsStateMachine-${stackName}`, {
    stateMachineName: `ProcessPendingPaymentsStateMachine-${stackName}`,
    definition: processPendingPaymentsStateMachineDefinition,
    timeout: Duration.hours(3), // adjust if your Lambda may run longer
  });

  const processPendingPaymentsScheduleRule = new events.Rule(stack, `ProcessPendingPaymentsScheduleRule-${stackName}`, {
    // Every day at 00:05 UTC. Adjust to local time as needed.
    ruleName: `DailyProcessPendingPaymentsRule-${stackName}`,
    schedule: events.Schedule.cron({
      minute: "0",
      hour: "5",
      // day: "1",
      // day, month, year left as "*" for "every"
    }),
  });

  // Target: start the Step Function
  processPendingPaymentsScheduleRule.addTarget(
    new targets.SfnStateMachine(processPendingPaymentsStateMachine, {
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
    processPendingPaymentsStateMachine,
    processPendingPaymentsScheduleRule,
  };
};

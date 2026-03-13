import { Duration, Stack } from "aws-cdk-lib";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export const configureProposedPaymentRemindersWorkflow = ({
  stack,
  stackName,
  sendProposedPaymentRemindersLambda,
}: {
  stack: Stack;
  stackName: string;
  sendProposedPaymentRemindersLambda: NodejsFunction;
}) => {
  const proposedPaymentReminderTask = new tasks.LambdaInvoke(stack, `RunProposedPaymentReminderProcessor-${stackName}`, {
    lambdaFunction: sendProposedPaymentRemindersLambda,
    payload: sfn.TaskInput.fromJsonPathAt("$"),
    outputPath: "$.Payload",
  });

  const checkIfMoreReminderBatches = new sfn.Choice(stack, `HasMoreProposedPaymentReminderBatches-${stackName}`)
    .when(sfn.Condition.booleanEquals("$.loop", true), proposedPaymentReminderTask)
    .otherwise(new sfn.Succeed(stack, `AllProposedPaymentReminderBatchesProcessed-${stackName}`));

  const proposedPaymentReminderStateMachine = new sfn.StateMachine(stack, `ProposedPaymentReminderStateMachine-${stackName}`, {
    stateMachineName: `ProposedPaymentReminderStateMachine-${stackName}`,
    definition: proposedPaymentReminderTask.next(checkIfMoreReminderBatches),
    timeout: Duration.hours(3),
  });

  const proposedPaymentReminderScheduleRule = new events.Rule(stack, `ProposedPaymentReminderScheduleRule-${stackName}`, {
    ruleName: `DailyProposedPaymentReminderRule-${stackName}`,
    schedule: events.Schedule.cron({
      minute: "0",
      hour: "12",
    }),
  });

  proposedPaymentReminderScheduleRule.addTarget(
    new targets.SfnStateMachine(proposedPaymentReminderStateMachine, {
      input: events.RuleTargetInput.fromObject({
        nextToken: null,
        loop: true,
      }),
    }),
  );

  return {
    proposedPaymentReminderStateMachine,
    proposedPaymentReminderScheduleRule,
  };
};

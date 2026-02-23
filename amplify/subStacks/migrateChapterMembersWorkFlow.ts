import { Duration, Stack } from "aws-cdk-lib";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export const configureMigrateChapterMembersWorkflow = ({
  stack,
  stackName,
  migrateChapterMembersLambda,
}: {
  stack: Stack;
  stackName: string;
  migrateChapterMembersLambda: NodejsFunction;
}) => {
  const migrateChapterMembersProcessorTask = new tasks.LambdaInvoke(stack, `RunMigrateChapterMembersProcessor-${stackName}`, {
    lambdaFunction: migrateChapterMembersLambda, // or your actual processor lambda
    // If you want to pass something in, add it here. For now we let the Lambda determine "today".
    payload: sfn.TaskInput.fromJsonPathAt("$"),
    //  sfn.TaskInput.fromObject({}),
    outputPath: "$.Payload",
    // resultPath: sfn.JsonPath.DISCARD, // we do not care about the Lambda result in the state machine
  });

  const checkIfMoreUsersStatuses = new sfn.Choice(stack, "HasMoreChapterMembersToMigrated?")
    .when(
      sfn.Condition.booleanEquals("$.loop", true),
      migrateChapterMembersProcessorTask, // loop back
    )
    .otherwise(new sfn.Succeed(stack, "AllChapterMembersMigrated"));

  const migrateChapterMembersStateMachineDefinition = migrateChapterMembersProcessorTask.next(checkIfMoreUsersStatuses);

  const migrateChapterMembersStateMachine = new sfn.StateMachine(stack, `MigrateChapterMembersStateMachine-${stackName}`, {
    stateMachineName: `MigrateChapterMemberStateMachine-${stackName}`,
    definition: migrateChapterMembersStateMachineDefinition,
    timeout: Duration.hours(3), // adjust if your Lambda may run longer
  });

  // Optional: return things if you ever want to reference them elsewhere
  return {
    migrateChapterMembersStateMachine,
  };
};

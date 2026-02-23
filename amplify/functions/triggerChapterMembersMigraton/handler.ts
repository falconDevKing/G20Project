import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";
import type { Schema } from "../../data/resource";

import { env } from "$amplify/env/triggerChapterMembersMigraton";

const REGION = process.env.AWS_REGION || "";
const sfn = new SFNClient({});
const STATE_MACHINE_ARN = process.env.STATE_MACHINE_ARN!;

export const handler: Schema["triggerChapterMembersMigraton"]["functionHandler"] = async (event) => {
  try {
    console.log("event", event);
    console.log("envs", env);

    const { chapterId, newDivisionId, loop, nextToken } = event.arguments;

    const input = JSON.stringify({
      chapterId,
      newDivisionId,
      loop,
      nextToken,
    });

    const cmd = new StartExecutionCommand({
      stateMachineArn: STATE_MACHINE_ARN,
      input,
    });

    const response = await sfn.send(cmd);

    return {
      success: true,
      executionArn: response.executionArn,
    };
  } catch (error) {
    console.error("SFN Error:", error);
    throw new Error("Failed to start step function", {
      cause: error instanceof Error ? error : undefined,
    });
  }
};

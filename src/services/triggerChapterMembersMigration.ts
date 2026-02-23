import { generateClient } from "aws-amplify/api";
import type { Schema } from "../../amplify/data/resource"; // Path to your schema

const client = generateClient<Schema>();

interface TriggerChapterMembersMigratonParams {
  chapterId: string;
  newDivisionId: string;
  loop: boolean;
  nextToken: string | null;
}

export const triggerChapterMembersMigration = async ({ chapterId, newDivisionId, loop, nextToken }: TriggerChapterMembersMigratonParams) => {
  try {
    const { errors, data } = await client.queries.triggerChapterMembersMigraton({
      chapterId,
      newDivisionId,
      loop,
      nextToken,
    });

    if (errors) throw new Error(errors[0].message);
    return data;
  } catch (error) {
    console.error("Email failed:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

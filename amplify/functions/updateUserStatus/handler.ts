import { Amplify } from "aws-amplify";
import { env } from "$amplify/env/updateUserStatus";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";

import { fetchChapterUsers, updateUserStatus } from "./helpers";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);

Amplify.configure(resourceConfig, libraryOptions);

export const handler = async (event: any) => {
  console.log("event", event);

  const { nextToken, loop } = event;

  try {
    // fetch chapters users and update
    const from = loop ? nextToken || 0 : 0;
    const { users, next } = await fetchChapterUsers(from);

    console.log({ users: users.length, next });

    const updateUserStatuses = users.map(async ({ id, remission_start_date, status }) => {
      // RUN STATUS UPDATE FOR USERS
      await updateUserStatus(id, remission_start_date, status);
    });

    await Promise.all(updateUserStatuses);

    console.log({ nextToken: next, loop: !!next });
    return { nextToken: next, loop: !!next };
  } catch (error) {
    console.log("update status error", error);
    return { nextToken: null, loop: false };
  }
};

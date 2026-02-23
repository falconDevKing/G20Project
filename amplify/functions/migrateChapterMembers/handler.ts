// import { Amplify } from "aws-amplify";
// import { generateClient } from "aws-amplify/data";
// import { env } from "$amplify/env/userBirthdayMail";
// import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
// import type { Schema } from "../../data/resource";

import { fetchChapterUsers, updateChapterUsersDivision } from "./helper";

export const handler = async (event: any) => {
  console.log("event", event);

  const { nextToken, loop, chapterId, newDivisionId } = event;

  try {
    const from = loop ? +nextToken || 0 : 0;
    const { chapterUsers, next } = await fetchChapterUsers(chapterId, from);
    console.log({ chapterUsers, next });

    const chapterUsersIds = chapterUsers
      .flat()
      .map((user) => user.id || "")
      .filter((id) => !!id);

    await updateChapterUsersDivision(newDivisionId, chapterUsersIds);

    console.log({ nextToken: next, loop: !!next });
    return { chapterId, newDivisionId, nextToken: next, loop: !!next };
  } catch (error) {
    console.log("user birthday error", error);
    return { nextToken: null, loop: false };
  }
};

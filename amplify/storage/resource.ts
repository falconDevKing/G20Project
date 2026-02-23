import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "G20Demo",
  access: (allow) => ({
    "profile-pictures/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write"]),
      // allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    // 'picture-submissions/*': [
    //   allow.authenticated.to(['read','write']),
    //   allow.guest.to(['read', 'write'])
    // ],
  }),
});

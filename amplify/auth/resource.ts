import { referenceAuth } from "@aws-amplify/backend";

export const auth = referenceAuth({
  userPoolId: process.env.GGP_USER_POOL_ID!,
  userPoolClientId: process.env.GGP_USER_POOL_CLIENT_ID!,
  identityPoolId: process.env.GGP_IDENTITY_POOL_ID!,
  authRoleArn: process.env.GGP_AUTH_ROLE_ARN!,
  unauthRoleArn: process.env.GGP_UNAUTH_ROLE_ARN!,
});

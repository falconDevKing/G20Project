import { defineBackend } from "@aws-amplify/backend";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Tags, Stack } from "aws-cdk-lib";
import { FunctionUrlAuthType, HttpMethod } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

import { auth } from "./auth/resource";

import { data } from "./data/resource";

import { storage } from "./storage/resource";

import { sendEmail } from "./functions/sendEmail/resource";
import { userBirthdayMail } from "./functions/userBirthdayMail/resource";
import { adminBirthdayMail } from "./functions/adminBirthdayMail/resource";
import { updateUserStatus } from "./functions/updateUserStatus/resource";
import { sendUserMessages } from "./functions/sendUserMessages/resource";
import { createPendingPayments } from "./functions/createPendingPayments/resource";
import { processPendingPayments } from "./functions/processPendingPayments/resource";
import { handleChargedPayments } from "./functions/handleChargedPayments/resource";
import { migrateChapterMembers } from "./functions/migrateChapterMembers/resource";
import { triggerChapterMembersMigraton } from "./functions/triggerChapterMembersMigraton/resource";
import { postPaymentReceiver } from "./functions/postPaymentReceiver/resource";
import { postPaymentProcessor } from "./functions/postPaymentProcessor/resource";
import { backUpData } from "./functions/backUpData/resource";

import { backUpBucketStack } from "./subStacks/backupStack";
import { configureUserBirthdayWorkflow } from "./subStacks/userBirthdayWorkFlow";
import { configureUpdateUserStatusWorkflow } from "./subStacks/updateUserStatusWorkFlow";
import { configureAdminBirthdayWorkflow } from "./subStacks/adminBirthdayWorkFlow";
import { configureCreatePendingPaymentsWorkflow } from "./subStacks/createPendingPaymentsWorkFlow";
import { configureProcessPendingPaymentsWorkflow } from "./subStacks/processPendingPaymentsWorkFlow";
import { configureMigrateChapterMembersWorkflow } from "./subStacks/migrateChapterMembersWorkFlow";
import { sendWhatsapp } from "./functions/sendWhatsapp/resource";
import { handleStripeWebhook } from "./functions/handleStripeWebhook/resource";
import { handlePaymentsBE } from "./functions/handlePaymentsBE/resource";

const projectName = process.env.GGP_PROJECT_NAME || "g20-local";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,

  data,
  storage,

  sendEmail,
  sendWhatsapp,
  userBirthdayMail,
  adminBirthdayMail,
  updateUserStatus,
  sendUserMessages,
  createPendingPayments,
  processPendingPayments,
  handleChargedPayments,
  migrateChapterMembers,
  postPaymentProcessor,
  backUpData,

  handleStripeWebhook,
  handlePaymentsBE,

  triggerChapterMembersMigraton,
  postPaymentReceiver,
});

type BackendResourcesType = typeof backend;
type lambdaResourcesKeys = keyof Omit<BackendResourcesType, "auth" | "data" | "storage">;
const lambdaNames: lambdaResourcesKeys[] = [
  "sendEmail",
  "sendWhatsapp",
  "userBirthdayMail",
  "adminBirthdayMail",
  "updateUserStatus",
  "sendUserMessages",
  "createPendingPayments",
  "processPendingPayments",
  "handleChargedPayments",
  "migrateChapterMembers",
  "postPaymentProcessor",
  "backUpData",

  "handleStripeWebhook",
  "handlePaymentsBE",

  "triggerChapterMembersMigraton",
  "postPaymentReceiver",
];

backend.auth.stack;

const handleChargedPaymentsLambda = backend.handleChargedPayments.resources.lambda as NodejsFunction;
const handleStripeWebhookLambda = backend.handleStripeWebhook.resources.lambda as NodejsFunction;
const handlePaymentsBELambda = backend.handlePaymentsBE.resources.lambda as NodejsFunction;
handleChargedPaymentsLambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE, // or AWS_IAM for secured access
  cors: {
    allowedOrigins: ["*"],
    allowedMethods: [HttpMethod.GET, HttpMethod.POST],
  },
});
handleStripeWebhookLambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE, // or AWS_IAM for secured access
  cors: {
    allowedOrigins: ["*"],
    allowedMethods: [HttpMethod.GET, HttpMethod.POST],
  },
});
handlePaymentsBELambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE, // or AWS_IAM for secured access
});

const userBirthdayMailLambda = backend.userBirthdayMail.resources.lambda as NodejsFunction;
const adminBirthdayMailLambda = backend.adminBirthdayMail.resources.lambda as NodejsFunction;
const updateUserStatusLambda = backend.updateUserStatus.resources.lambda as NodejsFunction;
const createPendingPaymentsLambda = backend.createPendingPayments.resources.lambda as NodejsFunction;
const processPendingPaymentsLambda = backend.processPendingPayments.resources.lambda as NodejsFunction;
const migrateChapterMembersLambda = backend.migrateChapterMembers.resources.lambda as NodejsFunction;
const triggerChapterMembersMigratonLambda = backend.triggerChapterMembersMigraton.resources.lambda as NodejsFunction;
const postPaymentReceiverLambda = backend.postPaymentReceiver.resources.lambda as NodejsFunction;
const postPaymentProcessorLambda = backend.postPaymentProcessor.resources.lambda as NodejsFunction;
const backUpDataLambda = backend.backUpData.resources.lambda as NodejsFunction;
const sendUserMessagesLambda = backend.sendUserMessages.resources.lambda as NodejsFunction;

const stackName = backend.stack.stackName;

const customResourceStack = Stack.of(userBirthdayMailLambda);

configureUserBirthdayWorkflow({
  stack: customResourceStack,
  stackName: projectName,
  userBirthdayMailLambda,
});

configureUpdateUserStatusWorkflow({
  stack: customResourceStack,
  stackName: projectName,
  updateUserStatusLambda,
});

configureAdminBirthdayWorkflow({
  stack: customResourceStack,
  stackName: projectName,
  adminBirthdayMailLambda,
});

configureCreatePendingPaymentsWorkflow({
  stack: customResourceStack,
  stackName: projectName,
  createPendingPaymentsLambda,
});

configureProcessPendingPaymentsWorkflow({
  stack: customResourceStack,
  stackName: projectName,
  processPendingPaymentsLambda,
});

const { migrateChapterMembersStateMachine } = configureMigrateChapterMembersWorkflow({
  stack: customResourceStack,
  stackName: projectName,
  migrateChapterMembersLambda,
});

backUpBucketStack({ stack: customResourceStack, stackName: projectName, expirationDays: 21, backUpDataLambda });

migrateChapterMembersStateMachine.grantStartExecution(triggerChapterMembersMigratonLambda);
triggerChapterMembersMigratonLambda.addEnvironment("STATE_MACHINE_ARN", migrateChapterMembersStateMachine.stateMachineArn);

postPaymentProcessorLambda.grantInvoke(postPaymentReceiverLambda);
sendUserMessagesLambda.grantInvoke(postPaymentReceiverLambda);
postPaymentReceiverLambda.addEnvironment("POST_PAYMENT_PROCESSOR_LAMBDA", postPaymentProcessorLambda.functionName);
postPaymentReceiverLambda.addEnvironment("SEND_MESSAGE_LAMBDA", sendUserMessagesLambda.functionName);

const sesStatement = new PolicyStatement({
  actions: ["ses:SendEmail", "ses:SendRawEmail"],
  resources: ["*"], // or your SES identity ARN(s)
});

lambdaNames.forEach((lambdaName) => {
  const resource = backend[lambdaName];
  if (resource && typeof resource === "object" && "resources" in resource) {
    const lambdaFunction = (resource as any).resources.lambda as NodejsFunction;
    lambdaFunction.addToRolePolicy(sesStatement);

    lambdaFunction.addEnvironment("GGP_ORG_ID", process.env.GGP_ORG_ID as string);
    lambdaFunction.addEnvironment("BASE_URL", process.env.BASE_URL as string);
    lambdaFunction.addEnvironment("GGP_BASE_URL", process.env.GGP_BASE_URL as string);
    lambdaFunction.addEnvironment("GGP_GUEST_USER_ID", process.env.GGP_GUEST_USER_ID as string);
    lambdaFunction.addEnvironment("GGP_SENDER_MAIL", process.env.GGP_SENDER_MAIL as string);
    lambdaFunction.addEnvironment("GGP_SUPABASE_URL", process.env.GGP_SUPABASE_URL as string);
    lambdaFunction.addEnvironment("GGP_SUPABASE_ANON_KEY", process.env.GGP_SUPABASE_ANON_KEY as string);
    lambdaFunction.addEnvironment("GGP_TWILIO_ACCOUNT_SID", process.env.GGP_TWILIO_ACCOUNT_SID as string);
    lambdaFunction.addEnvironment("GGP_TWILIO_AUTH_TOKEN", process.env.GGP_TWILIO_AUTH_TOKEN as string);
    lambdaFunction.addEnvironment("GGP_TWILIO_PHONE_NUMBER", process.env.GGP_TWILIO_PHONE_NUMBER as string);
    lambdaFunction.addEnvironment("GGP_RESEND_KEY", process.env.GGP_RESEND_KEY as string);
    lambdaFunction.addEnvironment("GGP_ALLOW_RESEND", process.env.GGP_ALLOW_RESEND as string);
    lambdaFunction.addEnvironment("GGP_RESTRICT_TWILIO", process.env.GGP_RESTRICT_TWILIO as string);
  }
});

const tags = Tags.of(backend.stack);
tags.add("project", projectName);

import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { sendEmail } from "../functions/sendEmail/resource";
import { sendUserMessages } from "../functions/sendUserMessages/resource";
import { userBirthdayMail } from "../functions/userBirthdayMail/resource";
import { adminBirthdayMail } from "../functions/adminBirthdayMail/resource";
import { updateUserStatus } from "../functions/updateUserStatus/resource";
import { processPendingPayments } from "../functions/processPendingPayments/resource";
import { createPendingPayments } from "../functions/createPendingPayments/resource";
import { handleChargedPayments } from "../functions/handleChargedPayments/resource";
import { triggerChapterMembersMigraton } from "../functions/triggerChapterMembersMigraton/resource";
import { postPaymentReceiver } from "../functions/postPaymentReceiver/resource";
import { postPaymentProcessor } from "../functions/postPaymentProcessor/resource";
import { backUpData } from "../functions/backUpData/resource";
import { sendWhatsapp } from "../functions/sendWhatsapp/resource";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any unauthenticated user can "create", "read", "update",
and "delete" any "Todo" records.
=========================================================================*/

const schema = a
  .schema({
    repsType: a.customType({ id: a.string(), name: a.string(), email: a.string() }),
    emailResult: a.customType({
      success: a.boolean().required(),
      messageId: a.string(),
    }),
    whatsappResult: a.customType({
      success: a.boolean().required(),
      status: a.string().required(),
      messageId: a.string(),
    }),
    triggerChapterMembersMigratonResult: a.customType({
      success: a.boolean().required(),
      executionArn: a.string(),
    }),
    dateObjectType: a.customType({ from: a.string() || a.datetime(), to: a.string() || a.datetime() }),
    sendUserMessageFilter: a.customType({
      field: a.string(),
      operator: a.string(),
      value: a.string() || a.ref("dateObjectType"),
    }),
    // TODO: Delete dummy tables
    // Organisation: a.model({
    //   name: a.string(),
    //   reps: a.ref("repsType").array(),

    //   // divisions: a.hasMany("Division", "organisationId"),
    //   // regions: a.hasMany("Region", "organisationId"),
    //   // chapters: a.hasMany("Chapter", "organisationId"),
    //   // users: a.hasMany("User", "organisationId"),
    //   // payments: a.hasMany("Payment", "organisationId"),
    // }),
    // Division: a.model({
    //   name: a.string(),
    //   reps: a.ref("repsType").array(),

    //   organisationId: a.id(),
    //   // organisation: a.belongsTo("Organisation", "organisationId"),
    //   // regions: a.hasMany("Region", "divisionId"),
    //   // chapters: a.hasMany("Chapter", "divisionId"),
    //   // users: a.hasMany("User", "divisionId"),
    //   // payments: a.hasMany("Payment", "divisionId"),
    // }),
    // Region: a.model({
    //   name: a.string(),
    //   reps: a.ref("repsType").array(),

    //   organisationId: a.id(),
    //   divisionId: a.id(),
    //   // organisation: a.belongsTo("Organisation", "organisationId"),
    //   // division: a.belongsTo("Division", "divisionId"),
    //   // chapters: a.hasMany("Chapter", "regionId"),
    //   // users: a.hasMany("User", "regionId"),
    //   // payments: a.hasMany("Payment", "regionId"),
    // }),
    // Chapter: a.model({
    //   name: a.string(),
    //   country: a.string(),
    //   baseCurrency: a.string(),
    //   reps: a.ref("repsType").array(),

    //   organisationId: a.id(),
    //   divisionId: a.id(),
    //   regionId: a.id(),
    //   // organisation: a.belongsTo("Organisation", "organisationId"),
    //   // division: a.belongsTo("Division", "divisionId"),
    //   // region: a.belongsTo("Region", "regionId"),
    //   // users: a.hasMany("User", "chapterId"),
    //   // payments: a.hasMany("Payment", "chapterId"),
    // }),

    // User: a
    //   .model({
    //     uniqueCode: a.string(),
    //     verified: a.boolean().required(),
    //     firstName: a.string().required(),
    //     middleName: a.string(),
    //     lastName: a.string().required(),
    //     email: a.email().required(),
    //     gender: a.string(),
    //     hipCategory: a.string().required(), // to be replaced with an enum once categories are confirmed
    //     phoneNumber: a.string(),
    //     address: a.string(),
    //     dateofBirth: a.string(),
    //     occupation: a.string(),
    //     nationality: a.string(),
    //     imageUrl: a.string(),
    //     cognitoUserId: a.string(),
    //     partnerType: a.string(),
    //     permissionType: a.enum(["individual", "chapter", "region", "division", "organisation"]),
    //     permissionAccess: a.string().array(),

    //     status: a.string(),
    //     remissionStartDate: a.string(),

    //     organisationId: a.id(),
    //     divisionId: a.id(),
    //     regionId: a.id(),
    //     chapterId: a.id(),
    //     // organisation: a.belongsTo("Organisation", "organisationId"),
    //     // division: a.belongsTo("Division", "divisionId"),
    //     // region: a.belongsTo("Region", "regionId"),
    //     // chapter: a.belongsTo("Chapter", "chapterId"),
    //     // payments: a.hasMany("Payment", "userId"),

    //     createdAt: a.datetime(),
    //   })
    //   .secondaryIndexes((index) => [
    //     index("email").sortKeys(["firstName"]).queryField("listUsersByEmail"),
    //     index("uniqueCode").sortKeys(["firstName"]).queryField("listUsersByUniqueCode"),
    //     index("chapterId").sortKeys(["firstName"]).queryField("listUsersByChapterWithName"),
    //     index("regionId").sortKeys(["firstName"]).queryField("listUsersByRegionWithName"),
    //     index("divisionId").sortKeys(["firstName"]).queryField("listUsersByDivisionWithName"),
    //     index("organisationId").sortKeys(["firstName"]).queryField("listUsersByOrganisationWithName"),
    //     index("chapterId").sortKeys(["dateofBirth"]).queryField("listUsersByChapterWithBirthday"),
    //     index("divisionId").sortKeys(["dateofBirth"]).queryField("listUsersByDivisionWithBirthday"),
    //     index("organisationId").sortKeys(["dateofBirth"]).queryField("listUsersByOrganisationWithBirthday"),
    //     index("chapterId").sortKeys(["createdAt"]).queryField("listUsersByChapter"),
    //     index("regionId").sortKeys(["createdAt"]).queryField("listUsersByRegion"),
    //     index("divisionId").sortKeys(["createdAt"]).queryField("listUsersByDivision"),
    //     index("organisationId").sortKeys(["createdAt"]).queryField("listUsersByOrganisation"),
    //   ]),

    // Payment: a
    //   .model({
    //     currency: a.string(),
    //     amount: a.float(),
    //     paymentDate: a.string(),
    //     remissionMonth: a.string(),
    //     remissionYear: a.string(),
    //     remissionPeriod: a.string(),
    //     status: a.string(),
    //     description: a.string(),
    //     approvedBy: a.string(), //know who recorded the payment
    //     approvedById: a.string(),
    //     userName: a.string(),

    //     isConverted: a.boolean(), // incase payment is made in another currecny,
    //     conversionAmount: a.float(), //we can note the conversion details
    //     conversionRate: a.float(),
    //     conversionCurrency: a.string(),
    //     conversionTime: a.string(),
    //     conversionDescription: a.string(),

    //     gbpEquivalent: a.float(),

    //     organisationId: a.id(),
    //     divisionId: a.id(),
    //     regionId: a.id(),
    //     chapterId: a.id(),
    //     userId: a.id(),
    //     userCode: a.string(),
    //     // organisation: a.belongsTo("Organisation", "organisationId"),
    //     // division: a.belongsTo("Division", "divisionId"),
    //     // region: a.belongsTo("Region", "regionId"),
    //     // chapter: a.belongsTo("Chapter", "chapterId"),
    //     // user: a.belongsTo("User", "userId"),
    //   })
    //   .secondaryIndexes((index) => [
    //     index("userId").sortKeys(["paymentDate"]).queryField("listPaymentsByUser"),
    //     index("chapterId").sortKeys(["paymentDate"]).queryField("listPaymentsByChapter"),
    //     index("regionId").sortKeys(["paymentDate"]).queryField("listPaymentsByRegion"),
    //     index("divisionId").sortKeys(["paymentDate"]).queryField("listPaymentsByDivision"),
    //     index("organisationId").sortKeys(["paymentDate"]).queryField("listPaymentsByOrganisation"),
    //   ]),
    sendEmail: a
      .query()
      .arguments({
        to: a.string().required().array(),
        subject: a.string().required(),
        body: a.string().required(),
        from: a.string(),
        ccMails: a.string().array(),
        bccMails: a.string().array(),
      })
      .handler(a.handler.function(sendEmail))
      .returns(a.ref("emailResult"))
      .authorization((allow) => [
        // allow.resource(sendEmail), // Grants the function execution rights
        allow.publicApiKey(), // Optional: Allow authenticated users
      ]),
    sendWhatsapp: a
      .query()
      .arguments({
        contentSid: a.string().required(),
        contentVariables: a.string().required(),
        from: a.string().required(),
        to: a.string().required(),
      })
      .handler(a.handler.function(sendWhatsapp))
      .returns(a.ref("whatsappResult"))
      .authorization((allow) => [
        // allow.resource(sendWhatsapp), // Grants the function execution rights
        allow.publicApiKey(), // Optional: Allow authenticated users
      ]),
    postPaymentReceiver: a
      .query()
      .arguments({
        processingCase: a.string().required(),
        processingPayload: a.json().required(),
      })
      .handler(a.handler.function(postPaymentReceiver))
      .returns(a.json())
      .authorization((allow) => [
        // allow.resource(sendEmail), // Grants the function execution rights
        allow.publicApiKey(), // Optional: Allow authenticated users
      ]),
    triggerChapterMembersMigraton: a
      .query()
      .arguments({
        chapterId: a.string().required(),
        newDivisionId: a.string().required(),
        loop: a.boolean().required(),
        nextToken: a.string(),
      })
      .handler(a.handler.function(triggerChapterMembersMigraton))
      .returns(a.ref("triggerChapterMembersMigratonResult"))
      .authorization((allow) => [
        // allow.resource(sendEmail), // Grants the function execution rights
        allow.publicApiKey(), // Optional: Allow authenticated users
      ]),
    sendUserEmailRequests: a
      .query()
      .arguments({
        subject: a.string().required(),
        body: a.string().required(),
        selectedUsersIds: a.string().array().required(),
        filterData: a.ref("sendUserMessageFilter").array().required(),
      })
      .handler(a.handler.function(sendUserMessages))
      .returns(a.ref("emailResult"))
      .authorization((allow) => [
        // allow.resource(sendEmail), // Grants the function execution rights
        allow.publicApiKey(), // Optional: Allow authenticated users
      ]),
  })
  .authorization((allow) => [
    allow.publicApiKey(),
    allow.resource(userBirthdayMail),
    allow.resource(adminBirthdayMail),
    allow.resource(updateUserStatus),
    allow.resource(createPendingPayments),
    allow.resource(handleChargedPayments),
    allow.resource(processPendingPayments),
    allow.resource(postPaymentReceiver),
    allow.resource(postPaymentProcessor),
    allow.resource(backUpData),
  ]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  name: "OHIPDemo",
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: { expiresInDays: 364 },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)y

Using JavaScript or Next.js React Server Components, Middleware, Server
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>

/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getChapter = /* GraphQL */ `query GetChapter($id: ID!) {
  getChapter(id: $id) {
    baseCurrency
    country
    createdAt
    divisionId
    id
    name
    organisationId
    regionId
    reps {
      email
      id
      name
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetChapterQueryVariables,
  APITypes.GetChapterQuery
>;
export const getDivision = /* GraphQL */ `query GetDivision($id: ID!) {
  getDivision(id: $id) {
    createdAt
    id
    name
    organisationId
    reps {
      email
      id
      name
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetDivisionQueryVariables,
  APITypes.GetDivisionQuery
>;
export const getOrganisation = /* GraphQL */ `query GetOrganisation($id: ID!) {
  getOrganisation(id: $id) {
    createdAt
    id
    name
    reps {
      email
      id
      name
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetOrganisationQueryVariables,
  APITypes.GetOrganisationQuery
>;
export const getPayment = /* GraphQL */ `query GetPayment($id: ID!) {
  getPayment(id: $id) {
    amount
    approvedBy
    approvedById
    chapterId
    conversionAmount
    conversionCurrency
    conversionDescription
    conversionRate
    conversionTime
    createdAt
    currency
    description
    divisionId
    gbpEquivalent
    id
    isConverted
    organisationId
    paymentDate
    regionId
    remissionMonth
    remissionPeriod
    remissionYear
    status
    updatedAt
    userCode
    userId
    userName
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPaymentQueryVariables,
  APITypes.GetPaymentQuery
>;
export const getRegion = /* GraphQL */ `query GetRegion($id: ID!) {
  getRegion(id: $id) {
    createdAt
    divisionId
    id
    name
    organisationId
    reps {
      email
      id
      name
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetRegionQueryVariables, APITypes.GetRegionQuery>;
export const getUser = /* GraphQL */ `query GetUser($id: ID!) {
  getUser(id: $id) {
    address
    chapterId
    cognitoUserId
    createdAt
    dateofBirth
    divisionId
    email
    firstName
    gender
    hipCategory
    id
    imageUrl
    lastName
    middleName
    nationality
    occupation
    organisationId
    partnerType
    permissionAccess
    permissionType
    phoneNumber
    regionId
    remissionStartDate
    status
    uniqueCode
    updatedAt
    verified
    __typename
  }
}
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const listChapters = /* GraphQL */ `query ListChapters(
  $filter: ModelChapterFilterInput
  $limit: Int
  $nextToken: String
) {
  listChapters(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      baseCurrency
      country
      createdAt
      divisionId
      id
      name
      organisationId
      regionId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListChaptersQueryVariables,
  APITypes.ListChaptersQuery
>;
export const listDivisions = /* GraphQL */ `query ListDivisions(
  $filter: ModelDivisionFilterInput
  $limit: Int
  $nextToken: String
) {
  listDivisions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      id
      name
      organisationId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDivisionsQueryVariables,
  APITypes.ListDivisionsQuery
>;
export const listOrganisations = /* GraphQL */ `query ListOrganisations(
  $filter: ModelOrganisationFilterInput
  $limit: Int
  $nextToken: String
) {
  listOrganisations(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      id
      name
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListOrganisationsQueryVariables,
  APITypes.ListOrganisationsQuery
>;
export const listPayments = /* GraphQL */ `query ListPayments(
  $filter: ModelPaymentFilterInput
  $limit: Int
  $nextToken: String
) {
  listPayments(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      amount
      approvedBy
      approvedById
      chapterId
      conversionAmount
      conversionCurrency
      conversionDescription
      conversionRate
      conversionTime
      createdAt
      currency
      description
      divisionId
      gbpEquivalent
      id
      isConverted
      organisationId
      paymentDate
      regionId
      remissionMonth
      remissionPeriod
      remissionYear
      status
      updatedAt
      userCode
      userId
      userName
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPaymentsQueryVariables,
  APITypes.ListPaymentsQuery
>;
export const listPaymentsByChapter = /* GraphQL */ `query ListPaymentsByChapter(
  $chapterId: ID!
  $filter: ModelPaymentFilterInput
  $limit: Int
  $nextToken: String
  $paymentDate: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
) {
  listPaymentsByChapter(
    chapterId: $chapterId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    paymentDate: $paymentDate
    sortDirection: $sortDirection
  ) {
    items {
      amount
      approvedBy
      approvedById
      chapterId
      conversionAmount
      conversionCurrency
      conversionDescription
      conversionRate
      conversionTime
      createdAt
      currency
      description
      divisionId
      gbpEquivalent
      id
      isConverted
      organisationId
      paymentDate
      regionId
      remissionMonth
      remissionPeriod
      remissionYear
      status
      updatedAt
      userCode
      userId
      userName
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPaymentsByChapterQueryVariables,
  APITypes.ListPaymentsByChapterQuery
>;
export const listPaymentsByDivision = /* GraphQL */ `query ListPaymentsByDivision(
  $divisionId: ID!
  $filter: ModelPaymentFilterInput
  $limit: Int
  $nextToken: String
  $paymentDate: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
) {
  listPaymentsByDivision(
    divisionId: $divisionId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    paymentDate: $paymentDate
    sortDirection: $sortDirection
  ) {
    items {
      amount
      approvedBy
      approvedById
      chapterId
      conversionAmount
      conversionCurrency
      conversionDescription
      conversionRate
      conversionTime
      createdAt
      currency
      description
      divisionId
      gbpEquivalent
      id
      isConverted
      organisationId
      paymentDate
      regionId
      remissionMonth
      remissionPeriod
      remissionYear
      status
      updatedAt
      userCode
      userId
      userName
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPaymentsByDivisionQueryVariables,
  APITypes.ListPaymentsByDivisionQuery
>;
export const listPaymentsByOrganisation = /* GraphQL */ `query ListPaymentsByOrganisation(
  $filter: ModelPaymentFilterInput
  $limit: Int
  $nextToken: String
  $organisationId: ID!
  $paymentDate: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
) {
  listPaymentsByOrganisation(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organisationId: $organisationId
    paymentDate: $paymentDate
    sortDirection: $sortDirection
  ) {
    items {
      amount
      approvedBy
      approvedById
      chapterId
      conversionAmount
      conversionCurrency
      conversionDescription
      conversionRate
      conversionTime
      createdAt
      currency
      description
      divisionId
      gbpEquivalent
      id
      isConverted
      organisationId
      paymentDate
      regionId
      remissionMonth
      remissionPeriod
      remissionYear
      status
      updatedAt
      userCode
      userId
      userName
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPaymentsByOrganisationQueryVariables,
  APITypes.ListPaymentsByOrganisationQuery
>;
export const listPaymentsByRegion = /* GraphQL */ `query ListPaymentsByRegion(
  $filter: ModelPaymentFilterInput
  $limit: Int
  $nextToken: String
  $paymentDate: ModelStringKeyConditionInput
  $regionId: ID!
  $sortDirection: ModelSortDirection
) {
  listPaymentsByRegion(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    paymentDate: $paymentDate
    regionId: $regionId
    sortDirection: $sortDirection
  ) {
    items {
      amount
      approvedBy
      approvedById
      chapterId
      conversionAmount
      conversionCurrency
      conversionDescription
      conversionRate
      conversionTime
      createdAt
      currency
      description
      divisionId
      gbpEquivalent
      id
      isConverted
      organisationId
      paymentDate
      regionId
      remissionMonth
      remissionPeriod
      remissionYear
      status
      updatedAt
      userCode
      userId
      userName
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPaymentsByRegionQueryVariables,
  APITypes.ListPaymentsByRegionQuery
>;
export const listPaymentsByUser = /* GraphQL */ `query ListPaymentsByUser(
  $filter: ModelPaymentFilterInput
  $limit: Int
  $nextToken: String
  $paymentDate: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $userId: ID!
) {
  listPaymentsByUser(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    paymentDate: $paymentDate
    sortDirection: $sortDirection
    userId: $userId
  ) {
    items {
      amount
      approvedBy
      approvedById
      chapterId
      conversionAmount
      conversionCurrency
      conversionDescription
      conversionRate
      conversionTime
      createdAt
      currency
      description
      divisionId
      gbpEquivalent
      id
      isConverted
      organisationId
      paymentDate
      regionId
      remissionMonth
      remissionPeriod
      remissionYear
      status
      updatedAt
      userCode
      userId
      userName
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPaymentsByUserQueryVariables,
  APITypes.ListPaymentsByUserQuery
>;
export const listRegions = /* GraphQL */ `query ListRegions(
  $filter: ModelRegionFilterInput
  $limit: Int
  $nextToken: String
) {
  listRegions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      divisionId
      id
      name
      organisationId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListRegionsQueryVariables,
  APITypes.ListRegionsQuery
>;
export const listUsers = /* GraphQL */ `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      address
      chapterId
      cognitoUserId
      createdAt
      dateofBirth
      divisionId
      email
      firstName
      gender
      hipCategory
      id
      imageUrl
      lastName
      middleName
      nationality
      occupation
      organisationId
      partnerType
      permissionAccess
      permissionType
      phoneNumber
      regionId
      remissionStartDate
      status
      uniqueCode
      updatedAt
      verified
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
export const listUsersByChapter = /* GraphQL */ `query ListUsersByChapter(
  $chapterId: ID!
  $createdAt: ModelStringKeyConditionInput
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listUsersByChapter(
    chapterId: $chapterId
    createdAt: $createdAt
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      address
      chapterId
      cognitoUserId
      createdAt
      dateofBirth
      divisionId
      email
      firstName
      gender
      hipCategory
      id
      imageUrl
      lastName
      middleName
      nationality
      occupation
      organisationId
      partnerType
      permissionAccess
      permissionType
      phoneNumber
      regionId
      remissionStartDate
      status
      uniqueCode
      updatedAt
      verified
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUsersByChapterQueryVariables,
  APITypes.ListUsersByChapterQuery
>;
export const listUsersByChapterWithBirthday = /* GraphQL */ `query ListUsersByChapterWithBirthday(
  $chapterId: ID!
  $dateofBirth: ModelStringKeyConditionInput
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listUsersByChapterWithBirthday(
    chapterId: $chapterId
    dateofBirth: $dateofBirth
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      address
      chapterId
      cognitoUserId
      createdAt
      dateofBirth
      divisionId
      email
      firstName
      gender
      hipCategory
      id
      imageUrl
      lastName
      middleName
      nationality
      occupation
      organisationId
      partnerType
      permissionAccess
      permissionType
      phoneNumber
      regionId
      remissionStartDate
      status
      uniqueCode
      updatedAt
      verified
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUsersByChapterWithBirthdayQueryVariables,
  APITypes.ListUsersByChapterWithBirthdayQuery
>;
export const listUsersByChapterWithName = /* GraphQL */ `query ListUsersByChapterWithName(
  $chapterId: ID!
  $filter: ModelUserFilterInput
  $firstName: ModelStringKeyConditionInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listUsersByChapterWithName(
    chapterId: $chapterId
    filter: $filter
    firstName: $firstName
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      address
      chapterId
      cognitoUserId
      createdAt
      dateofBirth
      divisionId
      email
      firstName
      gender
      hipCategory
      id
      imageUrl
      lastName
      middleName
      nationality
      occupation
      organisationId
      partnerType
      permissionAccess
      permissionType
      phoneNumber
      regionId
      remissionStartDate
      status
      uniqueCode
      updatedAt
      verified
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUsersByChapterWithNameQueryVariables,
  APITypes.ListUsersByChapterWithNameQuery
>;
export const listUsersByDivision = /* GraphQL */ `query ListUsersByDivision(
  $createdAt: ModelStringKeyConditionInput
  $divisionId: ID!
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listUsersByDivision(
    createdAt: $createdAt
    divisionId: $divisionId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      address
      chapterId
      cognitoUserId
      createdAt
      dateofBirth
      divisionId
      email
      firstName
      gender
      hipCategory
      id
      imageUrl
      lastName
      middleName
      nationality
      occupation
      organisationId
      partnerType
      permissionAccess
      permissionType
      phoneNumber
      regionId
      remissionStartDate
      status
      uniqueCode
      updatedAt
      verified
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUsersByDivisionQueryVariables,
  APITypes.ListUsersByDivisionQuery
>;
export const listUsersByDivisionWithBirthday = /* GraphQL */ `query ListUsersByDivisionWithBirthday(
  $dateofBirth: ModelStringKeyConditionInput
  $divisionId: ID!
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listUsersByDivisionWithBirthday(
    dateofBirth: $dateofBirth
    divisionId: $divisionId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      address
      chapterId
      cognitoUserId
      createdAt
      dateofBirth
      divisionId
      email
      firstName
      gender
      hipCategory
      id
      imageUrl
      lastName
      middleName
      nationality
      occupation
      organisationId
      partnerType
      permissionAccess
      permissionType
      phoneNumber
      regionId
      remissionStartDate
      status
      uniqueCode
      updatedAt
      verified
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUsersByDivisionWithBirthdayQueryVariables,
  APITypes.ListUsersByDivisionWithBirthdayQuery
>;
export const listUsersByDivisionWithName = /* GraphQL */ `query ListUsersByDivisionWithName(
  $divisionId: ID!
  $filter: ModelUserFilterInput
  $firstName: ModelStringKeyConditionInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listUsersByDivisionWithName(
    divisionId: $divisionId
    filter: $filter
    firstName: $firstName
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      address
      chapterId
      cognitoUserId
      createdAt
      dateofBirth
      divisionId
      email
      firstName
      gender
      hipCategory
      id
      imageUrl
      lastName
      middleName
      nationality
      occupation
      organisationId
      partnerType
      permissionAccess
      permissionType
      phoneNumber
      regionId
      remissionStartDate
      status
      uniqueCode
      updatedAt
      verified
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUsersByDivisionWithNameQueryVariables,
  APITypes.ListUsersByDivisionWithNameQuery
>;
export const listUsersByEmail = /* GraphQL */ `query ListUsersByEmail(
  $email: AWSEmail!
  $filter: ModelUserFilterInput
  $firstName: ModelStringKeyConditionInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listUsersByEmail(
    email: $email
    filter: $filter
    firstName: $firstName
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      address
      chapterId
      cognitoUserId
      createdAt
      dateofBirth
      divisionId
      email
      firstName
      gender
      hipCategory
      id
      imageUrl
      lastName
      middleName
      nationality
      occupation
      organisationId
      partnerType
      permissionAccess
      permissionType
      phoneNumber
      regionId
      remissionStartDate
      status
      uniqueCode
      updatedAt
      verified
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUsersByEmailQueryVariables,
  APITypes.ListUsersByEmailQuery
>;
export const listUsersByOrganisation = /* GraphQL */ `query ListUsersByOrganisation(
  $createdAt: ModelStringKeyConditionInput
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
  $organisationId: ID!
  $sortDirection: ModelSortDirection
) {
  listUsersByOrganisation(
    createdAt: $createdAt
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organisationId: $organisationId
    sortDirection: $sortDirection
  ) {
    items {
      address
      chapterId
      cognitoUserId
      createdAt
      dateofBirth
      divisionId
      email
      firstName
      gender
      hipCategory
      id
      imageUrl
      lastName
      middleName
      nationality
      occupation
      organisationId
      partnerType
      permissionAccess
      permissionType
      phoneNumber
      regionId
      remissionStartDate
      status
      uniqueCode
      updatedAt
      verified
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUsersByOrganisationQueryVariables,
  APITypes.ListUsersByOrganisationQuery
>;
export const listUsersByOrganisationWithBirthday = /* GraphQL */ `query ListUsersByOrganisationWithBirthday(
  $dateofBirth: ModelStringKeyConditionInput
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
  $organisationId: ID!
  $sortDirection: ModelSortDirection
) {
  listUsersByOrganisationWithBirthday(
    dateofBirth: $dateofBirth
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organisationId: $organisationId
    sortDirection: $sortDirection
  ) {
    items {
      address
      chapterId
      cognitoUserId
      createdAt
      dateofBirth
      divisionId
      email
      firstName
      gender
      hipCategory
      id
      imageUrl
      lastName
      middleName
      nationality
      occupation
      organisationId
      partnerType
      permissionAccess
      permissionType
      phoneNumber
      regionId
      remissionStartDate
      status
      uniqueCode
      updatedAt
      verified
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUsersByOrganisationWithBirthdayQueryVariables,
  APITypes.ListUsersByOrganisationWithBirthdayQuery
>;
export const listUsersByOrganisationWithName = /* GraphQL */ `query ListUsersByOrganisationWithName(
  $filter: ModelUserFilterInput
  $firstName: ModelStringKeyConditionInput
  $limit: Int
  $nextToken: String
  $organisationId: ID!
  $sortDirection: ModelSortDirection
) {
  listUsersByOrganisationWithName(
    filter: $filter
    firstName: $firstName
    limit: $limit
    nextToken: $nextToken
    organisationId: $organisationId
    sortDirection: $sortDirection
  ) {
    items {
      address
      chapterId
      cognitoUserId
      createdAt
      dateofBirth
      divisionId
      email
      firstName
      gender
      hipCategory
      id
      imageUrl
      lastName
      middleName
      nationality
      occupation
      organisationId
      partnerType
      permissionAccess
      permissionType
      phoneNumber
      regionId
      remissionStartDate
      status
      uniqueCode
      updatedAt
      verified
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUsersByOrganisationWithNameQueryVariables,
  APITypes.ListUsersByOrganisationWithNameQuery
>;
export const listUsersByRegion = /* GraphQL */ `query ListUsersByRegion(
  $createdAt: ModelStringKeyConditionInput
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
  $regionId: ID!
  $sortDirection: ModelSortDirection
) {
  listUsersByRegion(
    createdAt: $createdAt
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    regionId: $regionId
    sortDirection: $sortDirection
  ) {
    items {
      address
      chapterId
      cognitoUserId
      createdAt
      dateofBirth
      divisionId
      email
      firstName
      gender
      hipCategory
      id
      imageUrl
      lastName
      middleName
      nationality
      occupation
      organisationId
      partnerType
      permissionAccess
      permissionType
      phoneNumber
      regionId
      remissionStartDate
      status
      uniqueCode
      updatedAt
      verified
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUsersByRegionQueryVariables,
  APITypes.ListUsersByRegionQuery
>;
export const listUsersByRegionWithName = /* GraphQL */ `query ListUsersByRegionWithName(
  $filter: ModelUserFilterInput
  $firstName: ModelStringKeyConditionInput
  $limit: Int
  $nextToken: String
  $regionId: ID!
  $sortDirection: ModelSortDirection
) {
  listUsersByRegionWithName(
    filter: $filter
    firstName: $firstName
    limit: $limit
    nextToken: $nextToken
    regionId: $regionId
    sortDirection: $sortDirection
  ) {
    items {
      address
      chapterId
      cognitoUserId
      createdAt
      dateofBirth
      divisionId
      email
      firstName
      gender
      hipCategory
      id
      imageUrl
      lastName
      middleName
      nationality
      occupation
      organisationId
      partnerType
      permissionAccess
      permissionType
      phoneNumber
      regionId
      remissionStartDate
      status
      uniqueCode
      updatedAt
      verified
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUsersByRegionWithNameQueryVariables,
  APITypes.ListUsersByRegionWithNameQuery
>;
export const listUsersByUniqueCode = /* GraphQL */ `query ListUsersByUniqueCode(
  $filter: ModelUserFilterInput
  $firstName: ModelStringKeyConditionInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $uniqueCode: String!
) {
  listUsersByUniqueCode(
    filter: $filter
    firstName: $firstName
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    uniqueCode: $uniqueCode
  ) {
    items {
      address
      chapterId
      cognitoUserId
      createdAt
      dateofBirth
      divisionId
      email
      firstName
      gender
      hipCategory
      id
      imageUrl
      lastName
      middleName
      nationality
      occupation
      organisationId
      partnerType
      permissionAccess
      permissionType
      phoneNumber
      regionId
      remissionStartDate
      status
      uniqueCode
      updatedAt
      verified
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUsersByUniqueCodeQueryVariables,
  APITypes.ListUsersByUniqueCodeQuery
>;
export const sendEmail = /* GraphQL */ `query SendEmail(
  $bccMails: [String]
  $body: String!
  $ccMails: [String]
  $from: String
  $subject: String!
  $to: [String!]
) {
  sendEmail(
    bccMails: $bccMails
    body: $body
    ccMails: $ccMails
    from: $from
    subject: $subject
    to: $to
  ) {
    messageId
    success
    __typename
  }
}
` as GeneratedQuery<APITypes.SendEmailQueryVariables, APITypes.SendEmailQuery>;
export const sendUserEmailRequests = /* GraphQL */ `query SendUserEmailRequests(
  $body: String!
  $filterData: [sendUserMessageFilterInput]!
  $selectedUsersIds: [String]!
  $subject: String!
) {
  sendUserEmailRequests(
    body: $body
    filterData: $filterData
    selectedUsersIds: $selectedUsersIds
    subject: $subject
  ) {
    messageId
    success
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SendUserEmailRequestsQueryVariables,
  APITypes.SendUserEmailRequestsQuery
>;
export const triggerChapterMembersMigraton = /* GraphQL */ `query TriggerChapterMembersMigraton(
  $chapterId: String!
  $loop: Boolean!
  $newDivisionId: String!
  $nextToken: String
) {
  triggerChapterMembersMigraton(
    chapterId: $chapterId
    loop: $loop
    newDivisionId: $newDivisionId
    nextToken: $nextToken
  ) {
    executionArn
    success
    __typename
  }
}
` as GeneratedQuery<
  APITypes.TriggerChapterMembersMigratonQueryVariables,
  APITypes.TriggerChapterMembersMigratonQuery
>;

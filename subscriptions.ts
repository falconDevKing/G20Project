/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateChapter = /* GraphQL */ `subscription OnCreateChapter($filter: ModelSubscriptionChapterFilterInput) {
  onCreateChapter(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateChapterSubscriptionVariables,
  APITypes.OnCreateChapterSubscription
>;
export const onCreateDivision = /* GraphQL */ `subscription OnCreateDivision($filter: ModelSubscriptionDivisionFilterInput) {
  onCreateDivision(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateDivisionSubscriptionVariables,
  APITypes.OnCreateDivisionSubscription
>;
export const onCreateOrganisation = /* GraphQL */ `subscription OnCreateOrganisation(
  $filter: ModelSubscriptionOrganisationFilterInput
) {
  onCreateOrganisation(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateOrganisationSubscriptionVariables,
  APITypes.OnCreateOrganisationSubscription
>;
export const onCreatePayment = /* GraphQL */ `subscription OnCreatePayment($filter: ModelSubscriptionPaymentFilterInput) {
  onCreatePayment(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreatePaymentSubscriptionVariables,
  APITypes.OnCreatePaymentSubscription
>;
export const onCreateRegion = /* GraphQL */ `subscription OnCreateRegion($filter: ModelSubscriptionRegionFilterInput) {
  onCreateRegion(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateRegionSubscriptionVariables,
  APITypes.OnCreateRegionSubscription
>;
export const onCreateUser = /* GraphQL */ `subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
  onCreateUser(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateUserSubscriptionVariables,
  APITypes.OnCreateUserSubscription
>;
export const onDeleteChapter = /* GraphQL */ `subscription OnDeleteChapter($filter: ModelSubscriptionChapterFilterInput) {
  onDeleteChapter(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteChapterSubscriptionVariables,
  APITypes.OnDeleteChapterSubscription
>;
export const onDeleteDivision = /* GraphQL */ `subscription OnDeleteDivision($filter: ModelSubscriptionDivisionFilterInput) {
  onDeleteDivision(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteDivisionSubscriptionVariables,
  APITypes.OnDeleteDivisionSubscription
>;
export const onDeleteOrganisation = /* GraphQL */ `subscription OnDeleteOrganisation(
  $filter: ModelSubscriptionOrganisationFilterInput
) {
  onDeleteOrganisation(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteOrganisationSubscriptionVariables,
  APITypes.OnDeleteOrganisationSubscription
>;
export const onDeletePayment = /* GraphQL */ `subscription OnDeletePayment($filter: ModelSubscriptionPaymentFilterInput) {
  onDeletePayment(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeletePaymentSubscriptionVariables,
  APITypes.OnDeletePaymentSubscription
>;
export const onDeleteRegion = /* GraphQL */ `subscription OnDeleteRegion($filter: ModelSubscriptionRegionFilterInput) {
  onDeleteRegion(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteRegionSubscriptionVariables,
  APITypes.OnDeleteRegionSubscription
>;
export const onDeleteUser = /* GraphQL */ `subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
  onDeleteUser(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserSubscriptionVariables,
  APITypes.OnDeleteUserSubscription
>;
export const onUpdateChapter = /* GraphQL */ `subscription OnUpdateChapter($filter: ModelSubscriptionChapterFilterInput) {
  onUpdateChapter(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateChapterSubscriptionVariables,
  APITypes.OnUpdateChapterSubscription
>;
export const onUpdateDivision = /* GraphQL */ `subscription OnUpdateDivision($filter: ModelSubscriptionDivisionFilterInput) {
  onUpdateDivision(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateDivisionSubscriptionVariables,
  APITypes.OnUpdateDivisionSubscription
>;
export const onUpdateOrganisation = /* GraphQL */ `subscription OnUpdateOrganisation(
  $filter: ModelSubscriptionOrganisationFilterInput
) {
  onUpdateOrganisation(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateOrganisationSubscriptionVariables,
  APITypes.OnUpdateOrganisationSubscription
>;
export const onUpdatePayment = /* GraphQL */ `subscription OnUpdatePayment($filter: ModelSubscriptionPaymentFilterInput) {
  onUpdatePayment(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdatePaymentSubscriptionVariables,
  APITypes.OnUpdatePaymentSubscription
>;
export const onUpdateRegion = /* GraphQL */ `subscription OnUpdateRegion($filter: ModelSubscriptionRegionFilterInput) {
  onUpdateRegion(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateRegionSubscriptionVariables,
  APITypes.OnUpdateRegionSubscription
>;
export const onUpdateUser = /* GraphQL */ `subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
  onUpdateUser(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateUserSubscriptionVariables,
  APITypes.OnUpdateUserSubscription
>;

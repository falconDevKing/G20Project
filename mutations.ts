/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createChapter = /* GraphQL */ `mutation CreateChapter(
  $condition: ModelChapterConditionInput
  $input: CreateChapterInput!
) {
  createChapter(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateChapterMutationVariables,
  APITypes.CreateChapterMutation
>;
export const createDivision = /* GraphQL */ `mutation CreateDivision(
  $condition: ModelDivisionConditionInput
  $input: CreateDivisionInput!
) {
  createDivision(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateDivisionMutationVariables,
  APITypes.CreateDivisionMutation
>;
export const createOrganisation = /* GraphQL */ `mutation CreateOrganisation(
  $condition: ModelOrganisationConditionInput
  $input: CreateOrganisationInput!
) {
  createOrganisation(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateOrganisationMutationVariables,
  APITypes.CreateOrganisationMutation
>;
export const createPayment = /* GraphQL */ `mutation CreatePayment(
  $condition: ModelPaymentConditionInput
  $input: CreatePaymentInput!
) {
  createPayment(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreatePaymentMutationVariables,
  APITypes.CreatePaymentMutation
>;
export const createRegion = /* GraphQL */ `mutation CreateRegion(
  $condition: ModelRegionConditionInput
  $input: CreateRegionInput!
) {
  createRegion(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateRegionMutationVariables,
  APITypes.CreateRegionMutation
>;
export const createUser = /* GraphQL */ `mutation CreateUser(
  $condition: ModelUserConditionInput
  $input: CreateUserInput!
) {
  createUser(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateUserMutationVariables,
  APITypes.CreateUserMutation
>;
export const deleteChapter = /* GraphQL */ `mutation DeleteChapter(
  $condition: ModelChapterConditionInput
  $input: DeleteChapterInput!
) {
  deleteChapter(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteChapterMutationVariables,
  APITypes.DeleteChapterMutation
>;
export const deleteDivision = /* GraphQL */ `mutation DeleteDivision(
  $condition: ModelDivisionConditionInput
  $input: DeleteDivisionInput!
) {
  deleteDivision(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteDivisionMutationVariables,
  APITypes.DeleteDivisionMutation
>;
export const deleteOrganisation = /* GraphQL */ `mutation DeleteOrganisation(
  $condition: ModelOrganisationConditionInput
  $input: DeleteOrganisationInput!
) {
  deleteOrganisation(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteOrganisationMutationVariables,
  APITypes.DeleteOrganisationMutation
>;
export const deletePayment = /* GraphQL */ `mutation DeletePayment(
  $condition: ModelPaymentConditionInput
  $input: DeletePaymentInput!
) {
  deletePayment(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeletePaymentMutationVariables,
  APITypes.DeletePaymentMutation
>;
export const deleteRegion = /* GraphQL */ `mutation DeleteRegion(
  $condition: ModelRegionConditionInput
  $input: DeleteRegionInput!
) {
  deleteRegion(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteRegionMutationVariables,
  APITypes.DeleteRegionMutation
>;
export const deleteUser = /* GraphQL */ `mutation DeleteUser(
  $condition: ModelUserConditionInput
  $input: DeleteUserInput!
) {
  deleteUser(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteUserMutationVariables,
  APITypes.DeleteUserMutation
>;
export const updateChapter = /* GraphQL */ `mutation UpdateChapter(
  $condition: ModelChapterConditionInput
  $input: UpdateChapterInput!
) {
  updateChapter(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateChapterMutationVariables,
  APITypes.UpdateChapterMutation
>;
export const updateDivision = /* GraphQL */ `mutation UpdateDivision(
  $condition: ModelDivisionConditionInput
  $input: UpdateDivisionInput!
) {
  updateDivision(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateDivisionMutationVariables,
  APITypes.UpdateDivisionMutation
>;
export const updateOrganisation = /* GraphQL */ `mutation UpdateOrganisation(
  $condition: ModelOrganisationConditionInput
  $input: UpdateOrganisationInput!
) {
  updateOrganisation(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateOrganisationMutationVariables,
  APITypes.UpdateOrganisationMutation
>;
export const updatePayment = /* GraphQL */ `mutation UpdatePayment(
  $condition: ModelPaymentConditionInput
  $input: UpdatePaymentInput!
) {
  updatePayment(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdatePaymentMutationVariables,
  APITypes.UpdatePaymentMutation
>;
export const updateRegion = /* GraphQL */ `mutation UpdateRegion(
  $condition: ModelRegionConditionInput
  $input: UpdateRegionInput!
) {
  updateRegion(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateRegionMutationVariables,
  APITypes.UpdateRegionMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser(
  $condition: ModelUserConditionInput
  $input: UpdateUserInput!
) {
  updateUser(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateUserMutationVariables,
  APITypes.UpdateUserMutation
>;

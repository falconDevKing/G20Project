/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Chapter = {
  __typename: "Chapter",
  baseCurrency?: string | null,
  country?: string | null,
  createdAt: string,
  divisionId?: string | null,
  id: string,
  name?: string | null,
  organisationId?: string | null,
  regionId?: string | null,
  reps?:  Array<repsType | null > | null,
  updatedAt: string,
};

export type repsType = {
  __typename: "repsType",
  email?: string | null,
  id?: string | null,
  name?: string | null,
};

export type Division = {
  __typename: "Division",
  createdAt: string,
  id: string,
  name?: string | null,
  organisationId?: string | null,
  reps?:  Array<repsType | null > | null,
  updatedAt: string,
};

export type Organisation = {
  __typename: "Organisation",
  createdAt: string,
  id: string,
  name?: string | null,
  reps?:  Array<repsType | null > | null,
  updatedAt: string,
};

export type Payment = {
  __typename: "Payment",
  amount?: number | null,
  approvedBy?: string | null,
  approvedById?: string | null,
  chapterId?: string | null,
  conversionAmount?: number | null,
  conversionCurrency?: string | null,
  conversionDescription?: string | null,
  conversionRate?: number | null,
  conversionTime?: string | null,
  createdAt: string,
  currency?: string | null,
  description?: string | null,
  divisionId?: string | null,
  gbpEquivalent?: number | null,
  id: string,
  isConverted?: boolean | null,
  organisationId?: string | null,
  paymentDate?: string | null,
  regionId?: string | null,
  remissionMonth?: string | null,
  remissionPeriod?: string | null,
  remissionYear?: string | null,
  status?: string | null,
  updatedAt: string,
  userCode?: string | null,
  userId?: string | null,
  userName?: string | null,
};

export type Region = {
  __typename: "Region",
  createdAt: string,
  divisionId?: string | null,
  id: string,
  name?: string | null,
  organisationId?: string | null,
  reps?:  Array<repsType | null > | null,
  updatedAt: string,
};

export type User = {
  __typename: "User",
  address?: string | null,
  chapterId?: string | null,
  cognitoUserId?: string | null,
  createdAt?: string | null,
  dateofBirth?: string | null,
  divisionId?: string | null,
  email: string,
  firstName: string,
  gender?: string | null,
  hipCategory: string,
  id: string,
  imageUrl?: string | null,
  lastName: string,
  middleName?: string | null,
  nationality?: string | null,
  occupation?: string | null,
  organisationId?: string | null,
  partnerType?: string | null,
  permissionAccess?: Array< string | null > | null,
  permissionType?: UserPermissionType | null,
  phoneNumber?: string | null,
  regionId?: string | null,
  remissionStartDate?: string | null,
  status?: string | null,
  uniqueCode?: string | null,
  updatedAt: string,
  verified: boolean,
};

export enum UserPermissionType {
  chapter = "chapter",
  division = "division",
  individual = "individual",
  organisation = "organisation",
  region = "region",
}


export type ModelChapterFilterInput = {
  and?: Array< ModelChapterFilterInput | null > | null,
  baseCurrency?: ModelStringInput | null,
  country?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  divisionId?: ModelIDInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelChapterFilterInput | null,
  or?: Array< ModelChapterFilterInput | null > | null,
  organisationId?: ModelIDInput | null,
  regionId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelChapterConnection = {
  __typename: "ModelChapterConnection",
  items:  Array<Chapter | null >,
  nextToken?: string | null,
};

export type ModelDivisionFilterInput = {
  and?: Array< ModelDivisionFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelDivisionFilterInput | null,
  or?: Array< ModelDivisionFilterInput | null > | null,
  organisationId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelDivisionConnection = {
  __typename: "ModelDivisionConnection",
  items:  Array<Division | null >,
  nextToken?: string | null,
};

export type ModelOrganisationFilterInput = {
  and?: Array< ModelOrganisationFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelOrganisationFilterInput | null,
  or?: Array< ModelOrganisationFilterInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelOrganisationConnection = {
  __typename: "ModelOrganisationConnection",
  items:  Array<Organisation | null >,
  nextToken?: string | null,
};

export type ModelPaymentFilterInput = {
  amount?: ModelFloatInput | null,
  and?: Array< ModelPaymentFilterInput | null > | null,
  approvedBy?: ModelStringInput | null,
  approvedById?: ModelStringInput | null,
  chapterId?: ModelIDInput | null,
  conversionAmount?: ModelFloatInput | null,
  conversionCurrency?: ModelStringInput | null,
  conversionDescription?: ModelStringInput | null,
  conversionRate?: ModelFloatInput | null,
  conversionTime?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  currency?: ModelStringInput | null,
  description?: ModelStringInput | null,
  divisionId?: ModelIDInput | null,
  gbpEquivalent?: ModelFloatInput | null,
  id?: ModelIDInput | null,
  isConverted?: ModelBooleanInput | null,
  not?: ModelPaymentFilterInput | null,
  or?: Array< ModelPaymentFilterInput | null > | null,
  organisationId?: ModelIDInput | null,
  paymentDate?: ModelStringInput | null,
  regionId?: ModelIDInput | null,
  remissionMonth?: ModelStringInput | null,
  remissionPeriod?: ModelStringInput | null,
  remissionYear?: ModelStringInput | null,
  status?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  userCode?: ModelStringInput | null,
  userId?: ModelIDInput | null,
  userName?: ModelStringInput | null,
};

export type ModelFloatInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelBooleanInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelPaymentConnection = {
  __typename: "ModelPaymentConnection",
  items:  Array<Payment | null >,
  nextToken?: string | null,
};

export type ModelStringKeyConditionInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelRegionFilterInput = {
  and?: Array< ModelRegionFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  divisionId?: ModelIDInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelRegionFilterInput | null,
  or?: Array< ModelRegionFilterInput | null > | null,
  organisationId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelRegionConnection = {
  __typename: "ModelRegionConnection",
  items:  Array<Region | null >,
  nextToken?: string | null,
};

export type ModelUserFilterInput = {
  address?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  chapterId?: ModelIDInput | null,
  cognitoUserId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  dateofBirth?: ModelStringInput | null,
  divisionId?: ModelIDInput | null,
  email?: ModelStringInput | null,
  firstName?: ModelStringInput | null,
  gender?: ModelStringInput | null,
  hipCategory?: ModelStringInput | null,
  id?: ModelIDInput | null,
  imageUrl?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  middleName?: ModelStringInput | null,
  nationality?: ModelStringInput | null,
  not?: ModelUserFilterInput | null,
  occupation?: ModelStringInput | null,
  or?: Array< ModelUserFilterInput | null > | null,
  organisationId?: ModelIDInput | null,
  partnerType?: ModelStringInput | null,
  permissionAccess?: ModelStringInput | null,
  permissionType?: ModelUserPermissionTypeInput | null,
  phoneNumber?: ModelStringInput | null,
  regionId?: ModelIDInput | null,
  remissionStartDate?: ModelStringInput | null,
  status?: ModelStringInput | null,
  uniqueCode?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  verified?: ModelBooleanInput | null,
};

export type ModelUserPermissionTypeInput = {
  eq?: UserPermissionType | null,
  ne?: UserPermissionType | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export type emailResult = {
  __typename: "emailResult",
  messageId?: string | null,
  success: boolean,
};

export type sendUserMessageFilterInput = {
  field?: string | null,
  operator?: string | null,
  value?: string | null,
};

export type triggerChapterMembersMigratonResult = {
  __typename: "triggerChapterMembersMigratonResult",
  executionArn?: string | null,
  success: boolean,
};

export type ModelChapterConditionInput = {
  and?: Array< ModelChapterConditionInput | null > | null,
  baseCurrency?: ModelStringInput | null,
  country?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  divisionId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelChapterConditionInput | null,
  or?: Array< ModelChapterConditionInput | null > | null,
  organisationId?: ModelIDInput | null,
  regionId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateChapterInput = {
  baseCurrency?: string | null,
  country?: string | null,
  divisionId?: string | null,
  id?: string | null,
  name?: string | null,
  organisationId?: string | null,
  regionId?: string | null,
  reps?: Array< RepsTypeInput | null > | null,
};

export type RepsTypeInput = {
  email?: string | null,
  id?: string | null,
  name?: string | null,
};

export type ModelDivisionConditionInput = {
  and?: Array< ModelDivisionConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelDivisionConditionInput | null,
  or?: Array< ModelDivisionConditionInput | null > | null,
  organisationId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateDivisionInput = {
  id?: string | null,
  name?: string | null,
  organisationId?: string | null,
  reps?: Array< RepsTypeInput | null > | null,
};

export type ModelOrganisationConditionInput = {
  and?: Array< ModelOrganisationConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelOrganisationConditionInput | null,
  or?: Array< ModelOrganisationConditionInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateOrganisationInput = {
  id?: string | null,
  name?: string | null,
  reps?: Array< RepsTypeInput | null > | null,
};

export type ModelPaymentConditionInput = {
  amount?: ModelFloatInput | null,
  and?: Array< ModelPaymentConditionInput | null > | null,
  approvedBy?: ModelStringInput | null,
  approvedById?: ModelStringInput | null,
  chapterId?: ModelIDInput | null,
  conversionAmount?: ModelFloatInput | null,
  conversionCurrency?: ModelStringInput | null,
  conversionDescription?: ModelStringInput | null,
  conversionRate?: ModelFloatInput | null,
  conversionTime?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  currency?: ModelStringInput | null,
  description?: ModelStringInput | null,
  divisionId?: ModelIDInput | null,
  gbpEquivalent?: ModelFloatInput | null,
  isConverted?: ModelBooleanInput | null,
  not?: ModelPaymentConditionInput | null,
  or?: Array< ModelPaymentConditionInput | null > | null,
  organisationId?: ModelIDInput | null,
  paymentDate?: ModelStringInput | null,
  regionId?: ModelIDInput | null,
  remissionMonth?: ModelStringInput | null,
  remissionPeriod?: ModelStringInput | null,
  remissionYear?: ModelStringInput | null,
  status?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  userCode?: ModelStringInput | null,
  userId?: ModelIDInput | null,
  userName?: ModelStringInput | null,
};

export type CreatePaymentInput = {
  amount?: number | null,
  approvedBy?: string | null,
  approvedById?: string | null,
  chapterId?: string | null,
  conversionAmount?: number | null,
  conversionCurrency?: string | null,
  conversionDescription?: string | null,
  conversionRate?: number | null,
  conversionTime?: string | null,
  currency?: string | null,
  description?: string | null,
  divisionId?: string | null,
  gbpEquivalent?: number | null,
  id?: string | null,
  isConverted?: boolean | null,
  organisationId?: string | null,
  paymentDate?: string | null,
  regionId?: string | null,
  remissionMonth?: string | null,
  remissionPeriod?: string | null,
  remissionYear?: string | null,
  status?: string | null,
  userCode?: string | null,
  userId?: string | null,
  userName?: string | null,
};

export type ModelRegionConditionInput = {
  and?: Array< ModelRegionConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  divisionId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelRegionConditionInput | null,
  or?: Array< ModelRegionConditionInput | null > | null,
  organisationId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateRegionInput = {
  divisionId?: string | null,
  id?: string | null,
  name?: string | null,
  organisationId?: string | null,
  reps?: Array< RepsTypeInput | null > | null,
};

export type ModelUserConditionInput = {
  address?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  chapterId?: ModelIDInput | null,
  cognitoUserId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  dateofBirth?: ModelStringInput | null,
  divisionId?: ModelIDInput | null,
  email?: ModelStringInput | null,
  firstName?: ModelStringInput | null,
  gender?: ModelStringInput | null,
  hipCategory?: ModelStringInput | null,
  imageUrl?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  middleName?: ModelStringInput | null,
  nationality?: ModelStringInput | null,
  not?: ModelUserConditionInput | null,
  occupation?: ModelStringInput | null,
  or?: Array< ModelUserConditionInput | null > | null,
  organisationId?: ModelIDInput | null,
  partnerType?: ModelStringInput | null,
  permissionAccess?: ModelStringInput | null,
  permissionType?: ModelUserPermissionTypeInput | null,
  phoneNumber?: ModelStringInput | null,
  regionId?: ModelIDInput | null,
  remissionStartDate?: ModelStringInput | null,
  status?: ModelStringInput | null,
  uniqueCode?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  verified?: ModelBooleanInput | null,
};

export type CreateUserInput = {
  address?: string | null,
  chapterId?: string | null,
  cognitoUserId?: string | null,
  createdAt?: string | null,
  dateofBirth?: string | null,
  divisionId?: string | null,
  email: string,
  firstName: string,
  gender?: string | null,
  hipCategory: string,
  id?: string | null,
  imageUrl?: string | null,
  lastName: string,
  middleName?: string | null,
  nationality?: string | null,
  occupation?: string | null,
  organisationId?: string | null,
  partnerType?: string | null,
  permissionAccess?: Array< string | null > | null,
  permissionType?: UserPermissionType | null,
  phoneNumber?: string | null,
  regionId?: string | null,
  remissionStartDate?: string | null,
  status?: string | null,
  uniqueCode?: string | null,
  verified: boolean,
};

export type DeleteChapterInput = {
  id: string,
};

export type DeleteDivisionInput = {
  id: string,
};

export type DeleteOrganisationInput = {
  id: string,
};

export type DeletePaymentInput = {
  id: string,
};

export type DeleteRegionInput = {
  id: string,
};

export type DeleteUserInput = {
  id: string,
};

export type UpdateChapterInput = {
  baseCurrency?: string | null,
  country?: string | null,
  divisionId?: string | null,
  id: string,
  name?: string | null,
  organisationId?: string | null,
  regionId?: string | null,
  reps?: Array< RepsTypeInput | null > | null,
};

export type UpdateDivisionInput = {
  id: string,
  name?: string | null,
  organisationId?: string | null,
  reps?: Array< RepsTypeInput | null > | null,
};

export type UpdateOrganisationInput = {
  id: string,
  name?: string | null,
  reps?: Array< RepsTypeInput | null > | null,
};

export type UpdatePaymentInput = {
  amount?: number | null,
  approvedBy?: string | null,
  approvedById?: string | null,
  chapterId?: string | null,
  conversionAmount?: number | null,
  conversionCurrency?: string | null,
  conversionDescription?: string | null,
  conversionRate?: number | null,
  conversionTime?: string | null,
  currency?: string | null,
  description?: string | null,
  divisionId?: string | null,
  gbpEquivalent?: number | null,
  id: string,
  isConverted?: boolean | null,
  organisationId?: string | null,
  paymentDate?: string | null,
  regionId?: string | null,
  remissionMonth?: string | null,
  remissionPeriod?: string | null,
  remissionYear?: string | null,
  status?: string | null,
  userCode?: string | null,
  userId?: string | null,
  userName?: string | null,
};

export type UpdateRegionInput = {
  divisionId?: string | null,
  id: string,
  name?: string | null,
  organisationId?: string | null,
  reps?: Array< RepsTypeInput | null > | null,
};

export type UpdateUserInput = {
  address?: string | null,
  chapterId?: string | null,
  cognitoUserId?: string | null,
  createdAt?: string | null,
  dateofBirth?: string | null,
  divisionId?: string | null,
  email?: string | null,
  firstName?: string | null,
  gender?: string | null,
  hipCategory?: string | null,
  id: string,
  imageUrl?: string | null,
  lastName?: string | null,
  middleName?: string | null,
  nationality?: string | null,
  occupation?: string | null,
  organisationId?: string | null,
  partnerType?: string | null,
  permissionAccess?: Array< string | null > | null,
  permissionType?: UserPermissionType | null,
  phoneNumber?: string | null,
  regionId?: string | null,
  remissionStartDate?: string | null,
  status?: string | null,
  uniqueCode?: string | null,
  verified?: boolean | null,
};

export type ModelSubscriptionChapterFilterInput = {
  and?: Array< ModelSubscriptionChapterFilterInput | null > | null,
  baseCurrency?: ModelSubscriptionStringInput | null,
  country?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  divisionId?: ModelSubscriptionIDInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionChapterFilterInput | null > | null,
  organisationId?: ModelSubscriptionIDInput | null,
  regionId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionDivisionFilterInput = {
  and?: Array< ModelSubscriptionDivisionFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionDivisionFilterInput | null > | null,
  organisationId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionOrganisationFilterInput = {
  and?: Array< ModelSubscriptionOrganisationFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionOrganisationFilterInput | null > | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionPaymentFilterInput = {
  amount?: ModelSubscriptionFloatInput | null,
  and?: Array< ModelSubscriptionPaymentFilterInput | null > | null,
  approvedBy?: ModelSubscriptionStringInput | null,
  approvedById?: ModelSubscriptionStringInput | null,
  chapterId?: ModelSubscriptionIDInput | null,
  conversionAmount?: ModelSubscriptionFloatInput | null,
  conversionCurrency?: ModelSubscriptionStringInput | null,
  conversionDescription?: ModelSubscriptionStringInput | null,
  conversionRate?: ModelSubscriptionFloatInput | null,
  conversionTime?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  currency?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  divisionId?: ModelSubscriptionIDInput | null,
  gbpEquivalent?: ModelSubscriptionFloatInput | null,
  id?: ModelSubscriptionIDInput | null,
  isConverted?: ModelSubscriptionBooleanInput | null,
  or?: Array< ModelSubscriptionPaymentFilterInput | null > | null,
  organisationId?: ModelSubscriptionIDInput | null,
  paymentDate?: ModelSubscriptionStringInput | null,
  regionId?: ModelSubscriptionIDInput | null,
  remissionMonth?: ModelSubscriptionStringInput | null,
  remissionPeriod?: ModelSubscriptionStringInput | null,
  remissionYear?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  userCode?: ModelSubscriptionStringInput | null,
  userId?: ModelSubscriptionIDInput | null,
  userName?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionFloatInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelSubscriptionRegionFilterInput = {
  and?: Array< ModelSubscriptionRegionFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  divisionId?: ModelSubscriptionIDInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionRegionFilterInput | null > | null,
  organisationId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionUserFilterInput = {
  address?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  chapterId?: ModelSubscriptionIDInput | null,
  cognitoUserId?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  dateofBirth?: ModelSubscriptionStringInput | null,
  divisionId?: ModelSubscriptionIDInput | null,
  email?: ModelSubscriptionStringInput | null,
  firstName?: ModelSubscriptionStringInput | null,
  gender?: ModelSubscriptionStringInput | null,
  hipCategory?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  imageUrl?: ModelSubscriptionStringInput | null,
  lastName?: ModelSubscriptionStringInput | null,
  middleName?: ModelSubscriptionStringInput | null,
  nationality?: ModelSubscriptionStringInput | null,
  occupation?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
  organisationId?: ModelSubscriptionIDInput | null,
  partnerType?: ModelSubscriptionStringInput | null,
  permissionAccess?: ModelSubscriptionStringInput | null,
  permissionType?: ModelSubscriptionStringInput | null,
  phoneNumber?: ModelSubscriptionStringInput | null,
  regionId?: ModelSubscriptionIDInput | null,
  remissionStartDate?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  uniqueCode?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  verified?: ModelSubscriptionBooleanInput | null,
};

export type GetChapterQueryVariables = {
  id: string,
};

export type GetChapterQuery = {
  getChapter?:  {
    __typename: "Chapter",
    baseCurrency?: string | null,
    country?: string | null,
    createdAt: string,
    divisionId?: string | null,
    id: string,
    name?: string | null,
    organisationId?: string | null,
    regionId?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type GetDivisionQueryVariables = {
  id: string,
};

export type GetDivisionQuery = {
  getDivision?:  {
    __typename: "Division",
    createdAt: string,
    id: string,
    name?: string | null,
    organisationId?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type GetOrganisationQueryVariables = {
  id: string,
};

export type GetOrganisationQuery = {
  getOrganisation?:  {
    __typename: "Organisation",
    createdAt: string,
    id: string,
    name?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type GetPaymentQueryVariables = {
  id: string,
};

export type GetPaymentQuery = {
  getPayment?:  {
    __typename: "Payment",
    amount?: number | null,
    approvedBy?: string | null,
    approvedById?: string | null,
    chapterId?: string | null,
    conversionAmount?: number | null,
    conversionCurrency?: string | null,
    conversionDescription?: string | null,
    conversionRate?: number | null,
    conversionTime?: string | null,
    createdAt: string,
    currency?: string | null,
    description?: string | null,
    divisionId?: string | null,
    gbpEquivalent?: number | null,
    id: string,
    isConverted?: boolean | null,
    organisationId?: string | null,
    paymentDate?: string | null,
    regionId?: string | null,
    remissionMonth?: string | null,
    remissionPeriod?: string | null,
    remissionYear?: string | null,
    status?: string | null,
    updatedAt: string,
    userCode?: string | null,
    userId?: string | null,
    userName?: string | null,
  } | null,
};

export type GetRegionQueryVariables = {
  id: string,
};

export type GetRegionQuery = {
  getRegion?:  {
    __typename: "Region",
    createdAt: string,
    divisionId?: string | null,
    id: string,
    name?: string | null,
    organisationId?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    address?: string | null,
    chapterId?: string | null,
    cognitoUserId?: string | null,
    createdAt?: string | null,
    dateofBirth?: string | null,
    divisionId?: string | null,
    email: string,
    firstName: string,
    gender?: string | null,
    hipCategory: string,
    id: string,
    imageUrl?: string | null,
    lastName: string,
    middleName?: string | null,
    nationality?: string | null,
    occupation?: string | null,
    organisationId?: string | null,
    partnerType?: string | null,
    permissionAccess?: Array< string | null > | null,
    permissionType?: UserPermissionType | null,
    phoneNumber?: string | null,
    regionId?: string | null,
    remissionStartDate?: string | null,
    status?: string | null,
    uniqueCode?: string | null,
    updatedAt: string,
    verified: boolean,
  } | null,
};

export type ListChaptersQueryVariables = {
  filter?: ModelChapterFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListChaptersQuery = {
  listChapters?:  {
    __typename: "ModelChapterConnection",
    items:  Array< {
      __typename: "Chapter",
      baseCurrency?: string | null,
      country?: string | null,
      createdAt: string,
      divisionId?: string | null,
      id: string,
      name?: string | null,
      organisationId?: string | null,
      regionId?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListDivisionsQueryVariables = {
  filter?: ModelDivisionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListDivisionsQuery = {
  listDivisions?:  {
    __typename: "ModelDivisionConnection",
    items:  Array< {
      __typename: "Division",
      createdAt: string,
      id: string,
      name?: string | null,
      organisationId?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListOrganisationsQueryVariables = {
  filter?: ModelOrganisationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListOrganisationsQuery = {
  listOrganisations?:  {
    __typename: "ModelOrganisationConnection",
    items:  Array< {
      __typename: "Organisation",
      createdAt: string,
      id: string,
      name?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPaymentsQueryVariables = {
  filter?: ModelPaymentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPaymentsQuery = {
  listPayments?:  {
    __typename: "ModelPaymentConnection",
    items:  Array< {
      __typename: "Payment",
      amount?: number | null,
      approvedBy?: string | null,
      approvedById?: string | null,
      chapterId?: string | null,
      conversionAmount?: number | null,
      conversionCurrency?: string | null,
      conversionDescription?: string | null,
      conversionRate?: number | null,
      conversionTime?: string | null,
      createdAt: string,
      currency?: string | null,
      description?: string | null,
      divisionId?: string | null,
      gbpEquivalent?: number | null,
      id: string,
      isConverted?: boolean | null,
      organisationId?: string | null,
      paymentDate?: string | null,
      regionId?: string | null,
      remissionMonth?: string | null,
      remissionPeriod?: string | null,
      remissionYear?: string | null,
      status?: string | null,
      updatedAt: string,
      userCode?: string | null,
      userId?: string | null,
      userName?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPaymentsByChapterQueryVariables = {
  chapterId: string,
  filter?: ModelPaymentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  paymentDate?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListPaymentsByChapterQuery = {
  listPaymentsByChapter?:  {
    __typename: "ModelPaymentConnection",
    items:  Array< {
      __typename: "Payment",
      amount?: number | null,
      approvedBy?: string | null,
      approvedById?: string | null,
      chapterId?: string | null,
      conversionAmount?: number | null,
      conversionCurrency?: string | null,
      conversionDescription?: string | null,
      conversionRate?: number | null,
      conversionTime?: string | null,
      createdAt: string,
      currency?: string | null,
      description?: string | null,
      divisionId?: string | null,
      gbpEquivalent?: number | null,
      id: string,
      isConverted?: boolean | null,
      organisationId?: string | null,
      paymentDate?: string | null,
      regionId?: string | null,
      remissionMonth?: string | null,
      remissionPeriod?: string | null,
      remissionYear?: string | null,
      status?: string | null,
      updatedAt: string,
      userCode?: string | null,
      userId?: string | null,
      userName?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPaymentsByDivisionQueryVariables = {
  divisionId: string,
  filter?: ModelPaymentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  paymentDate?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListPaymentsByDivisionQuery = {
  listPaymentsByDivision?:  {
    __typename: "ModelPaymentConnection",
    items:  Array< {
      __typename: "Payment",
      amount?: number | null,
      approvedBy?: string | null,
      approvedById?: string | null,
      chapterId?: string | null,
      conversionAmount?: number | null,
      conversionCurrency?: string | null,
      conversionDescription?: string | null,
      conversionRate?: number | null,
      conversionTime?: string | null,
      createdAt: string,
      currency?: string | null,
      description?: string | null,
      divisionId?: string | null,
      gbpEquivalent?: number | null,
      id: string,
      isConverted?: boolean | null,
      organisationId?: string | null,
      paymentDate?: string | null,
      regionId?: string | null,
      remissionMonth?: string | null,
      remissionPeriod?: string | null,
      remissionYear?: string | null,
      status?: string | null,
      updatedAt: string,
      userCode?: string | null,
      userId?: string | null,
      userName?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPaymentsByOrganisationQueryVariables = {
  filter?: ModelPaymentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  organisationId: string,
  paymentDate?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListPaymentsByOrganisationQuery = {
  listPaymentsByOrganisation?:  {
    __typename: "ModelPaymentConnection",
    items:  Array< {
      __typename: "Payment",
      amount?: number | null,
      approvedBy?: string | null,
      approvedById?: string | null,
      chapterId?: string | null,
      conversionAmount?: number | null,
      conversionCurrency?: string | null,
      conversionDescription?: string | null,
      conversionRate?: number | null,
      conversionTime?: string | null,
      createdAt: string,
      currency?: string | null,
      description?: string | null,
      divisionId?: string | null,
      gbpEquivalent?: number | null,
      id: string,
      isConverted?: boolean | null,
      organisationId?: string | null,
      paymentDate?: string | null,
      regionId?: string | null,
      remissionMonth?: string | null,
      remissionPeriod?: string | null,
      remissionYear?: string | null,
      status?: string | null,
      updatedAt: string,
      userCode?: string | null,
      userId?: string | null,
      userName?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPaymentsByRegionQueryVariables = {
  filter?: ModelPaymentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  paymentDate?: ModelStringKeyConditionInput | null,
  regionId: string,
  sortDirection?: ModelSortDirection | null,
};

export type ListPaymentsByRegionQuery = {
  listPaymentsByRegion?:  {
    __typename: "ModelPaymentConnection",
    items:  Array< {
      __typename: "Payment",
      amount?: number | null,
      approvedBy?: string | null,
      approvedById?: string | null,
      chapterId?: string | null,
      conversionAmount?: number | null,
      conversionCurrency?: string | null,
      conversionDescription?: string | null,
      conversionRate?: number | null,
      conversionTime?: string | null,
      createdAt: string,
      currency?: string | null,
      description?: string | null,
      divisionId?: string | null,
      gbpEquivalent?: number | null,
      id: string,
      isConverted?: boolean | null,
      organisationId?: string | null,
      paymentDate?: string | null,
      regionId?: string | null,
      remissionMonth?: string | null,
      remissionPeriod?: string | null,
      remissionYear?: string | null,
      status?: string | null,
      updatedAt: string,
      userCode?: string | null,
      userId?: string | null,
      userName?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPaymentsByUserQueryVariables = {
  filter?: ModelPaymentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  paymentDate?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  userId: string,
};

export type ListPaymentsByUserQuery = {
  listPaymentsByUser?:  {
    __typename: "ModelPaymentConnection",
    items:  Array< {
      __typename: "Payment",
      amount?: number | null,
      approvedBy?: string | null,
      approvedById?: string | null,
      chapterId?: string | null,
      conversionAmount?: number | null,
      conversionCurrency?: string | null,
      conversionDescription?: string | null,
      conversionRate?: number | null,
      conversionTime?: string | null,
      createdAt: string,
      currency?: string | null,
      description?: string | null,
      divisionId?: string | null,
      gbpEquivalent?: number | null,
      id: string,
      isConverted?: boolean | null,
      organisationId?: string | null,
      paymentDate?: string | null,
      regionId?: string | null,
      remissionMonth?: string | null,
      remissionPeriod?: string | null,
      remissionYear?: string | null,
      status?: string | null,
      updatedAt: string,
      userCode?: string | null,
      userId?: string | null,
      userName?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListRegionsQueryVariables = {
  filter?: ModelRegionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListRegionsQuery = {
  listRegions?:  {
    __typename: "ModelRegionConnection",
    items:  Array< {
      __typename: "Region",
      createdAt: string,
      divisionId?: string | null,
      id: string,
      name?: string | null,
      organisationId?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      address?: string | null,
      chapterId?: string | null,
      cognitoUserId?: string | null,
      createdAt?: string | null,
      dateofBirth?: string | null,
      divisionId?: string | null,
      email: string,
      firstName: string,
      gender?: string | null,
      hipCategory: string,
      id: string,
      imageUrl?: string | null,
      lastName: string,
      middleName?: string | null,
      nationality?: string | null,
      occupation?: string | null,
      organisationId?: string | null,
      partnerType?: string | null,
      permissionAccess?: Array< string | null > | null,
      permissionType?: UserPermissionType | null,
      phoneNumber?: string | null,
      regionId?: string | null,
      remissionStartDate?: string | null,
      status?: string | null,
      uniqueCode?: string | null,
      updatedAt: string,
      verified: boolean,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUsersByChapterQueryVariables = {
  chapterId: string,
  createdAt?: ModelStringKeyConditionInput | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListUsersByChapterQuery = {
  listUsersByChapter?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      address?: string | null,
      chapterId?: string | null,
      cognitoUserId?: string | null,
      createdAt?: string | null,
      dateofBirth?: string | null,
      divisionId?: string | null,
      email: string,
      firstName: string,
      gender?: string | null,
      hipCategory: string,
      id: string,
      imageUrl?: string | null,
      lastName: string,
      middleName?: string | null,
      nationality?: string | null,
      occupation?: string | null,
      organisationId?: string | null,
      partnerType?: string | null,
      permissionAccess?: Array< string | null > | null,
      permissionType?: UserPermissionType | null,
      phoneNumber?: string | null,
      regionId?: string | null,
      remissionStartDate?: string | null,
      status?: string | null,
      uniqueCode?: string | null,
      updatedAt: string,
      verified: boolean,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUsersByChapterWithBirthdayQueryVariables = {
  chapterId: string,
  dateofBirth?: ModelStringKeyConditionInput | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListUsersByChapterWithBirthdayQuery = {
  listUsersByChapterWithBirthday?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      address?: string | null,
      chapterId?: string | null,
      cognitoUserId?: string | null,
      createdAt?: string | null,
      dateofBirth?: string | null,
      divisionId?: string | null,
      email: string,
      firstName: string,
      gender?: string | null,
      hipCategory: string,
      id: string,
      imageUrl?: string | null,
      lastName: string,
      middleName?: string | null,
      nationality?: string | null,
      occupation?: string | null,
      organisationId?: string | null,
      partnerType?: string | null,
      permissionAccess?: Array< string | null > | null,
      permissionType?: UserPermissionType | null,
      phoneNumber?: string | null,
      regionId?: string | null,
      remissionStartDate?: string | null,
      status?: string | null,
      uniqueCode?: string | null,
      updatedAt: string,
      verified: boolean,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUsersByChapterWithNameQueryVariables = {
  chapterId: string,
  filter?: ModelUserFilterInput | null,
  firstName?: ModelStringKeyConditionInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListUsersByChapterWithNameQuery = {
  listUsersByChapterWithName?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      address?: string | null,
      chapterId?: string | null,
      cognitoUserId?: string | null,
      createdAt?: string | null,
      dateofBirth?: string | null,
      divisionId?: string | null,
      email: string,
      firstName: string,
      gender?: string | null,
      hipCategory: string,
      id: string,
      imageUrl?: string | null,
      lastName: string,
      middleName?: string | null,
      nationality?: string | null,
      occupation?: string | null,
      organisationId?: string | null,
      partnerType?: string | null,
      permissionAccess?: Array< string | null > | null,
      permissionType?: UserPermissionType | null,
      phoneNumber?: string | null,
      regionId?: string | null,
      remissionStartDate?: string | null,
      status?: string | null,
      uniqueCode?: string | null,
      updatedAt: string,
      verified: boolean,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUsersByDivisionQueryVariables = {
  createdAt?: ModelStringKeyConditionInput | null,
  divisionId: string,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListUsersByDivisionQuery = {
  listUsersByDivision?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      address?: string | null,
      chapterId?: string | null,
      cognitoUserId?: string | null,
      createdAt?: string | null,
      dateofBirth?: string | null,
      divisionId?: string | null,
      email: string,
      firstName: string,
      gender?: string | null,
      hipCategory: string,
      id: string,
      imageUrl?: string | null,
      lastName: string,
      middleName?: string | null,
      nationality?: string | null,
      occupation?: string | null,
      organisationId?: string | null,
      partnerType?: string | null,
      permissionAccess?: Array< string | null > | null,
      permissionType?: UserPermissionType | null,
      phoneNumber?: string | null,
      regionId?: string | null,
      remissionStartDate?: string | null,
      status?: string | null,
      uniqueCode?: string | null,
      updatedAt: string,
      verified: boolean,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUsersByDivisionWithBirthdayQueryVariables = {
  dateofBirth?: ModelStringKeyConditionInput | null,
  divisionId: string,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListUsersByDivisionWithBirthdayQuery = {
  listUsersByDivisionWithBirthday?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      address?: string | null,
      chapterId?: string | null,
      cognitoUserId?: string | null,
      createdAt?: string | null,
      dateofBirth?: string | null,
      divisionId?: string | null,
      email: string,
      firstName: string,
      gender?: string | null,
      hipCategory: string,
      id: string,
      imageUrl?: string | null,
      lastName: string,
      middleName?: string | null,
      nationality?: string | null,
      occupation?: string | null,
      organisationId?: string | null,
      partnerType?: string | null,
      permissionAccess?: Array< string | null > | null,
      permissionType?: UserPermissionType | null,
      phoneNumber?: string | null,
      regionId?: string | null,
      remissionStartDate?: string | null,
      status?: string | null,
      uniqueCode?: string | null,
      updatedAt: string,
      verified: boolean,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUsersByDivisionWithNameQueryVariables = {
  divisionId: string,
  filter?: ModelUserFilterInput | null,
  firstName?: ModelStringKeyConditionInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListUsersByDivisionWithNameQuery = {
  listUsersByDivisionWithName?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      address?: string | null,
      chapterId?: string | null,
      cognitoUserId?: string | null,
      createdAt?: string | null,
      dateofBirth?: string | null,
      divisionId?: string | null,
      email: string,
      firstName: string,
      gender?: string | null,
      hipCategory: string,
      id: string,
      imageUrl?: string | null,
      lastName: string,
      middleName?: string | null,
      nationality?: string | null,
      occupation?: string | null,
      organisationId?: string | null,
      partnerType?: string | null,
      permissionAccess?: Array< string | null > | null,
      permissionType?: UserPermissionType | null,
      phoneNumber?: string | null,
      regionId?: string | null,
      remissionStartDate?: string | null,
      status?: string | null,
      uniqueCode?: string | null,
      updatedAt: string,
      verified: boolean,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUsersByEmailQueryVariables = {
  email: string,
  filter?: ModelUserFilterInput | null,
  firstName?: ModelStringKeyConditionInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListUsersByEmailQuery = {
  listUsersByEmail?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      address?: string | null,
      chapterId?: string | null,
      cognitoUserId?: string | null,
      createdAt?: string | null,
      dateofBirth?: string | null,
      divisionId?: string | null,
      email: string,
      firstName: string,
      gender?: string | null,
      hipCategory: string,
      id: string,
      imageUrl?: string | null,
      lastName: string,
      middleName?: string | null,
      nationality?: string | null,
      occupation?: string | null,
      organisationId?: string | null,
      partnerType?: string | null,
      permissionAccess?: Array< string | null > | null,
      permissionType?: UserPermissionType | null,
      phoneNumber?: string | null,
      regionId?: string | null,
      remissionStartDate?: string | null,
      status?: string | null,
      uniqueCode?: string | null,
      updatedAt: string,
      verified: boolean,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUsersByOrganisationQueryVariables = {
  createdAt?: ModelStringKeyConditionInput | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  organisationId: string,
  sortDirection?: ModelSortDirection | null,
};

export type ListUsersByOrganisationQuery = {
  listUsersByOrganisation?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      address?: string | null,
      chapterId?: string | null,
      cognitoUserId?: string | null,
      createdAt?: string | null,
      dateofBirth?: string | null,
      divisionId?: string | null,
      email: string,
      firstName: string,
      gender?: string | null,
      hipCategory: string,
      id: string,
      imageUrl?: string | null,
      lastName: string,
      middleName?: string | null,
      nationality?: string | null,
      occupation?: string | null,
      organisationId?: string | null,
      partnerType?: string | null,
      permissionAccess?: Array< string | null > | null,
      permissionType?: UserPermissionType | null,
      phoneNumber?: string | null,
      regionId?: string | null,
      remissionStartDate?: string | null,
      status?: string | null,
      uniqueCode?: string | null,
      updatedAt: string,
      verified: boolean,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUsersByOrganisationWithBirthdayQueryVariables = {
  dateofBirth?: ModelStringKeyConditionInput | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  organisationId: string,
  sortDirection?: ModelSortDirection | null,
};

export type ListUsersByOrganisationWithBirthdayQuery = {
  listUsersByOrganisationWithBirthday?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      address?: string | null,
      chapterId?: string | null,
      cognitoUserId?: string | null,
      createdAt?: string | null,
      dateofBirth?: string | null,
      divisionId?: string | null,
      email: string,
      firstName: string,
      gender?: string | null,
      hipCategory: string,
      id: string,
      imageUrl?: string | null,
      lastName: string,
      middleName?: string | null,
      nationality?: string | null,
      occupation?: string | null,
      organisationId?: string | null,
      partnerType?: string | null,
      permissionAccess?: Array< string | null > | null,
      permissionType?: UserPermissionType | null,
      phoneNumber?: string | null,
      regionId?: string | null,
      remissionStartDate?: string | null,
      status?: string | null,
      uniqueCode?: string | null,
      updatedAt: string,
      verified: boolean,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUsersByOrganisationWithNameQueryVariables = {
  filter?: ModelUserFilterInput | null,
  firstName?: ModelStringKeyConditionInput | null,
  limit?: number | null,
  nextToken?: string | null,
  organisationId: string,
  sortDirection?: ModelSortDirection | null,
};

export type ListUsersByOrganisationWithNameQuery = {
  listUsersByOrganisationWithName?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      address?: string | null,
      chapterId?: string | null,
      cognitoUserId?: string | null,
      createdAt?: string | null,
      dateofBirth?: string | null,
      divisionId?: string | null,
      email: string,
      firstName: string,
      gender?: string | null,
      hipCategory: string,
      id: string,
      imageUrl?: string | null,
      lastName: string,
      middleName?: string | null,
      nationality?: string | null,
      occupation?: string | null,
      organisationId?: string | null,
      partnerType?: string | null,
      permissionAccess?: Array< string | null > | null,
      permissionType?: UserPermissionType | null,
      phoneNumber?: string | null,
      regionId?: string | null,
      remissionStartDate?: string | null,
      status?: string | null,
      uniqueCode?: string | null,
      updatedAt: string,
      verified: boolean,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUsersByRegionQueryVariables = {
  createdAt?: ModelStringKeyConditionInput | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  regionId: string,
  sortDirection?: ModelSortDirection | null,
};

export type ListUsersByRegionQuery = {
  listUsersByRegion?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      address?: string | null,
      chapterId?: string | null,
      cognitoUserId?: string | null,
      createdAt?: string | null,
      dateofBirth?: string | null,
      divisionId?: string | null,
      email: string,
      firstName: string,
      gender?: string | null,
      hipCategory: string,
      id: string,
      imageUrl?: string | null,
      lastName: string,
      middleName?: string | null,
      nationality?: string | null,
      occupation?: string | null,
      organisationId?: string | null,
      partnerType?: string | null,
      permissionAccess?: Array< string | null > | null,
      permissionType?: UserPermissionType | null,
      phoneNumber?: string | null,
      regionId?: string | null,
      remissionStartDate?: string | null,
      status?: string | null,
      uniqueCode?: string | null,
      updatedAt: string,
      verified: boolean,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUsersByRegionWithNameQueryVariables = {
  filter?: ModelUserFilterInput | null,
  firstName?: ModelStringKeyConditionInput | null,
  limit?: number | null,
  nextToken?: string | null,
  regionId: string,
  sortDirection?: ModelSortDirection | null,
};

export type ListUsersByRegionWithNameQuery = {
  listUsersByRegionWithName?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      address?: string | null,
      chapterId?: string | null,
      cognitoUserId?: string | null,
      createdAt?: string | null,
      dateofBirth?: string | null,
      divisionId?: string | null,
      email: string,
      firstName: string,
      gender?: string | null,
      hipCategory: string,
      id: string,
      imageUrl?: string | null,
      lastName: string,
      middleName?: string | null,
      nationality?: string | null,
      occupation?: string | null,
      organisationId?: string | null,
      partnerType?: string | null,
      permissionAccess?: Array< string | null > | null,
      permissionType?: UserPermissionType | null,
      phoneNumber?: string | null,
      regionId?: string | null,
      remissionStartDate?: string | null,
      status?: string | null,
      uniqueCode?: string | null,
      updatedAt: string,
      verified: boolean,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUsersByUniqueCodeQueryVariables = {
  filter?: ModelUserFilterInput | null,
  firstName?: ModelStringKeyConditionInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  uniqueCode: string,
};

export type ListUsersByUniqueCodeQuery = {
  listUsersByUniqueCode?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      address?: string | null,
      chapterId?: string | null,
      cognitoUserId?: string | null,
      createdAt?: string | null,
      dateofBirth?: string | null,
      divisionId?: string | null,
      email: string,
      firstName: string,
      gender?: string | null,
      hipCategory: string,
      id: string,
      imageUrl?: string | null,
      lastName: string,
      middleName?: string | null,
      nationality?: string | null,
      occupation?: string | null,
      organisationId?: string | null,
      partnerType?: string | null,
      permissionAccess?: Array< string | null > | null,
      permissionType?: UserPermissionType | null,
      phoneNumber?: string | null,
      regionId?: string | null,
      remissionStartDate?: string | null,
      status?: string | null,
      uniqueCode?: string | null,
      updatedAt: string,
      verified: boolean,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type SendEmailQueryVariables = {
  bccMails?: Array< string | null > | null,
  body: string,
  ccMails?: Array< string | null > | null,
  from?: string | null,
  subject: string,
  to?: Array< string > | null,
};

export type SendEmailQuery = {
  sendEmail?:  {
    __typename: "emailResult",
    messageId?: string | null,
    success: boolean,
  } | null,
};

export type SendUserEmailRequestsQueryVariables = {
  body: string,
  filterData: Array< sendUserMessageFilterInput | null >,
  selectedUsersIds: Array< string | null >,
  subject: string,
};

export type SendUserEmailRequestsQuery = {
  sendUserEmailRequests?:  {
    __typename: "emailResult",
    messageId?: string | null,
    success: boolean,
  } | null,
};

export type TriggerChapterMembersMigratonQueryVariables = {
  chapterId: string,
  loop: boolean,
  newDivisionId: string,
  nextToken?: string | null,
};

export type TriggerChapterMembersMigratonQuery = {
  triggerChapterMembersMigraton?:  {
    __typename: "triggerChapterMembersMigratonResult",
    executionArn?: string | null,
    success: boolean,
  } | null,
};

export type CreateChapterMutationVariables = {
  condition?: ModelChapterConditionInput | null,
  input: CreateChapterInput,
};

export type CreateChapterMutation = {
  createChapter?:  {
    __typename: "Chapter",
    baseCurrency?: string | null,
    country?: string | null,
    createdAt: string,
    divisionId?: string | null,
    id: string,
    name?: string | null,
    organisationId?: string | null,
    regionId?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type CreateDivisionMutationVariables = {
  condition?: ModelDivisionConditionInput | null,
  input: CreateDivisionInput,
};

export type CreateDivisionMutation = {
  createDivision?:  {
    __typename: "Division",
    createdAt: string,
    id: string,
    name?: string | null,
    organisationId?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type CreateOrganisationMutationVariables = {
  condition?: ModelOrganisationConditionInput | null,
  input: CreateOrganisationInput,
};

export type CreateOrganisationMutation = {
  createOrganisation?:  {
    __typename: "Organisation",
    createdAt: string,
    id: string,
    name?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type CreatePaymentMutationVariables = {
  condition?: ModelPaymentConditionInput | null,
  input: CreatePaymentInput,
};

export type CreatePaymentMutation = {
  createPayment?:  {
    __typename: "Payment",
    amount?: number | null,
    approvedBy?: string | null,
    approvedById?: string | null,
    chapterId?: string | null,
    conversionAmount?: number | null,
    conversionCurrency?: string | null,
    conversionDescription?: string | null,
    conversionRate?: number | null,
    conversionTime?: string | null,
    createdAt: string,
    currency?: string | null,
    description?: string | null,
    divisionId?: string | null,
    gbpEquivalent?: number | null,
    id: string,
    isConverted?: boolean | null,
    organisationId?: string | null,
    paymentDate?: string | null,
    regionId?: string | null,
    remissionMonth?: string | null,
    remissionPeriod?: string | null,
    remissionYear?: string | null,
    status?: string | null,
    updatedAt: string,
    userCode?: string | null,
    userId?: string | null,
    userName?: string | null,
  } | null,
};

export type CreateRegionMutationVariables = {
  condition?: ModelRegionConditionInput | null,
  input: CreateRegionInput,
};

export type CreateRegionMutation = {
  createRegion?:  {
    __typename: "Region",
    createdAt: string,
    divisionId?: string | null,
    id: string,
    name?: string | null,
    organisationId?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type CreateUserMutationVariables = {
  condition?: ModelUserConditionInput | null,
  input: CreateUserInput,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    address?: string | null,
    chapterId?: string | null,
    cognitoUserId?: string | null,
    createdAt?: string | null,
    dateofBirth?: string | null,
    divisionId?: string | null,
    email: string,
    firstName: string,
    gender?: string | null,
    hipCategory: string,
    id: string,
    imageUrl?: string | null,
    lastName: string,
    middleName?: string | null,
    nationality?: string | null,
    occupation?: string | null,
    organisationId?: string | null,
    partnerType?: string | null,
    permissionAccess?: Array< string | null > | null,
    permissionType?: UserPermissionType | null,
    phoneNumber?: string | null,
    regionId?: string | null,
    remissionStartDate?: string | null,
    status?: string | null,
    uniqueCode?: string | null,
    updatedAt: string,
    verified: boolean,
  } | null,
};

export type DeleteChapterMutationVariables = {
  condition?: ModelChapterConditionInput | null,
  input: DeleteChapterInput,
};

export type DeleteChapterMutation = {
  deleteChapter?:  {
    __typename: "Chapter",
    baseCurrency?: string | null,
    country?: string | null,
    createdAt: string,
    divisionId?: string | null,
    id: string,
    name?: string | null,
    organisationId?: string | null,
    regionId?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type DeleteDivisionMutationVariables = {
  condition?: ModelDivisionConditionInput | null,
  input: DeleteDivisionInput,
};

export type DeleteDivisionMutation = {
  deleteDivision?:  {
    __typename: "Division",
    createdAt: string,
    id: string,
    name?: string | null,
    organisationId?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type DeleteOrganisationMutationVariables = {
  condition?: ModelOrganisationConditionInput | null,
  input: DeleteOrganisationInput,
};

export type DeleteOrganisationMutation = {
  deleteOrganisation?:  {
    __typename: "Organisation",
    createdAt: string,
    id: string,
    name?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type DeletePaymentMutationVariables = {
  condition?: ModelPaymentConditionInput | null,
  input: DeletePaymentInput,
};

export type DeletePaymentMutation = {
  deletePayment?:  {
    __typename: "Payment",
    amount?: number | null,
    approvedBy?: string | null,
    approvedById?: string | null,
    chapterId?: string | null,
    conversionAmount?: number | null,
    conversionCurrency?: string | null,
    conversionDescription?: string | null,
    conversionRate?: number | null,
    conversionTime?: string | null,
    createdAt: string,
    currency?: string | null,
    description?: string | null,
    divisionId?: string | null,
    gbpEquivalent?: number | null,
    id: string,
    isConverted?: boolean | null,
    organisationId?: string | null,
    paymentDate?: string | null,
    regionId?: string | null,
    remissionMonth?: string | null,
    remissionPeriod?: string | null,
    remissionYear?: string | null,
    status?: string | null,
    updatedAt: string,
    userCode?: string | null,
    userId?: string | null,
    userName?: string | null,
  } | null,
};

export type DeleteRegionMutationVariables = {
  condition?: ModelRegionConditionInput | null,
  input: DeleteRegionInput,
};

export type DeleteRegionMutation = {
  deleteRegion?:  {
    __typename: "Region",
    createdAt: string,
    divisionId?: string | null,
    id: string,
    name?: string | null,
    organisationId?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type DeleteUserMutationVariables = {
  condition?: ModelUserConditionInput | null,
  input: DeleteUserInput,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    address?: string | null,
    chapterId?: string | null,
    cognitoUserId?: string | null,
    createdAt?: string | null,
    dateofBirth?: string | null,
    divisionId?: string | null,
    email: string,
    firstName: string,
    gender?: string | null,
    hipCategory: string,
    id: string,
    imageUrl?: string | null,
    lastName: string,
    middleName?: string | null,
    nationality?: string | null,
    occupation?: string | null,
    organisationId?: string | null,
    partnerType?: string | null,
    permissionAccess?: Array< string | null > | null,
    permissionType?: UserPermissionType | null,
    phoneNumber?: string | null,
    regionId?: string | null,
    remissionStartDate?: string | null,
    status?: string | null,
    uniqueCode?: string | null,
    updatedAt: string,
    verified: boolean,
  } | null,
};

export type UpdateChapterMutationVariables = {
  condition?: ModelChapterConditionInput | null,
  input: UpdateChapterInput,
};

export type UpdateChapterMutation = {
  updateChapter?:  {
    __typename: "Chapter",
    baseCurrency?: string | null,
    country?: string | null,
    createdAt: string,
    divisionId?: string | null,
    id: string,
    name?: string | null,
    organisationId?: string | null,
    regionId?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type UpdateDivisionMutationVariables = {
  condition?: ModelDivisionConditionInput | null,
  input: UpdateDivisionInput,
};

export type UpdateDivisionMutation = {
  updateDivision?:  {
    __typename: "Division",
    createdAt: string,
    id: string,
    name?: string | null,
    organisationId?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type UpdateOrganisationMutationVariables = {
  condition?: ModelOrganisationConditionInput | null,
  input: UpdateOrganisationInput,
};

export type UpdateOrganisationMutation = {
  updateOrganisation?:  {
    __typename: "Organisation",
    createdAt: string,
    id: string,
    name?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type UpdatePaymentMutationVariables = {
  condition?: ModelPaymentConditionInput | null,
  input: UpdatePaymentInput,
};

export type UpdatePaymentMutation = {
  updatePayment?:  {
    __typename: "Payment",
    amount?: number | null,
    approvedBy?: string | null,
    approvedById?: string | null,
    chapterId?: string | null,
    conversionAmount?: number | null,
    conversionCurrency?: string | null,
    conversionDescription?: string | null,
    conversionRate?: number | null,
    conversionTime?: string | null,
    createdAt: string,
    currency?: string | null,
    description?: string | null,
    divisionId?: string | null,
    gbpEquivalent?: number | null,
    id: string,
    isConverted?: boolean | null,
    organisationId?: string | null,
    paymentDate?: string | null,
    regionId?: string | null,
    remissionMonth?: string | null,
    remissionPeriod?: string | null,
    remissionYear?: string | null,
    status?: string | null,
    updatedAt: string,
    userCode?: string | null,
    userId?: string | null,
    userName?: string | null,
  } | null,
};

export type UpdateRegionMutationVariables = {
  condition?: ModelRegionConditionInput | null,
  input: UpdateRegionInput,
};

export type UpdateRegionMutation = {
  updateRegion?:  {
    __typename: "Region",
    createdAt: string,
    divisionId?: string | null,
    id: string,
    name?: string | null,
    organisationId?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type UpdateUserMutationVariables = {
  condition?: ModelUserConditionInput | null,
  input: UpdateUserInput,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    address?: string | null,
    chapterId?: string | null,
    cognitoUserId?: string | null,
    createdAt?: string | null,
    dateofBirth?: string | null,
    divisionId?: string | null,
    email: string,
    firstName: string,
    gender?: string | null,
    hipCategory: string,
    id: string,
    imageUrl?: string | null,
    lastName: string,
    middleName?: string | null,
    nationality?: string | null,
    occupation?: string | null,
    organisationId?: string | null,
    partnerType?: string | null,
    permissionAccess?: Array< string | null > | null,
    permissionType?: UserPermissionType | null,
    phoneNumber?: string | null,
    regionId?: string | null,
    remissionStartDate?: string | null,
    status?: string | null,
    uniqueCode?: string | null,
    updatedAt: string,
    verified: boolean,
  } | null,
};

export type OnCreateChapterSubscriptionVariables = {
  filter?: ModelSubscriptionChapterFilterInput | null,
};

export type OnCreateChapterSubscription = {
  onCreateChapter?:  {
    __typename: "Chapter",
    baseCurrency?: string | null,
    country?: string | null,
    createdAt: string,
    divisionId?: string | null,
    id: string,
    name?: string | null,
    organisationId?: string | null,
    regionId?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type OnCreateDivisionSubscriptionVariables = {
  filter?: ModelSubscriptionDivisionFilterInput | null,
};

export type OnCreateDivisionSubscription = {
  onCreateDivision?:  {
    __typename: "Division",
    createdAt: string,
    id: string,
    name?: string | null,
    organisationId?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type OnCreateOrganisationSubscriptionVariables = {
  filter?: ModelSubscriptionOrganisationFilterInput | null,
};

export type OnCreateOrganisationSubscription = {
  onCreateOrganisation?:  {
    __typename: "Organisation",
    createdAt: string,
    id: string,
    name?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type OnCreatePaymentSubscriptionVariables = {
  filter?: ModelSubscriptionPaymentFilterInput | null,
};

export type OnCreatePaymentSubscription = {
  onCreatePayment?:  {
    __typename: "Payment",
    amount?: number | null,
    approvedBy?: string | null,
    approvedById?: string | null,
    chapterId?: string | null,
    conversionAmount?: number | null,
    conversionCurrency?: string | null,
    conversionDescription?: string | null,
    conversionRate?: number | null,
    conversionTime?: string | null,
    createdAt: string,
    currency?: string | null,
    description?: string | null,
    divisionId?: string | null,
    gbpEquivalent?: number | null,
    id: string,
    isConverted?: boolean | null,
    organisationId?: string | null,
    paymentDate?: string | null,
    regionId?: string | null,
    remissionMonth?: string | null,
    remissionPeriod?: string | null,
    remissionYear?: string | null,
    status?: string | null,
    updatedAt: string,
    userCode?: string | null,
    userId?: string | null,
    userName?: string | null,
  } | null,
};

export type OnCreateRegionSubscriptionVariables = {
  filter?: ModelSubscriptionRegionFilterInput | null,
};

export type OnCreateRegionSubscription = {
  onCreateRegion?:  {
    __typename: "Region",
    createdAt: string,
    divisionId?: string | null,
    id: string,
    name?: string | null,
    organisationId?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    address?: string | null,
    chapterId?: string | null,
    cognitoUserId?: string | null,
    createdAt?: string | null,
    dateofBirth?: string | null,
    divisionId?: string | null,
    email: string,
    firstName: string,
    gender?: string | null,
    hipCategory: string,
    id: string,
    imageUrl?: string | null,
    lastName: string,
    middleName?: string | null,
    nationality?: string | null,
    occupation?: string | null,
    organisationId?: string | null,
    partnerType?: string | null,
    permissionAccess?: Array< string | null > | null,
    permissionType?: UserPermissionType | null,
    phoneNumber?: string | null,
    regionId?: string | null,
    remissionStartDate?: string | null,
    status?: string | null,
    uniqueCode?: string | null,
    updatedAt: string,
    verified: boolean,
  } | null,
};

export type OnDeleteChapterSubscriptionVariables = {
  filter?: ModelSubscriptionChapterFilterInput | null,
};

export type OnDeleteChapterSubscription = {
  onDeleteChapter?:  {
    __typename: "Chapter",
    baseCurrency?: string | null,
    country?: string | null,
    createdAt: string,
    divisionId?: string | null,
    id: string,
    name?: string | null,
    organisationId?: string | null,
    regionId?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteDivisionSubscriptionVariables = {
  filter?: ModelSubscriptionDivisionFilterInput | null,
};

export type OnDeleteDivisionSubscription = {
  onDeleteDivision?:  {
    __typename: "Division",
    createdAt: string,
    id: string,
    name?: string | null,
    organisationId?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteOrganisationSubscriptionVariables = {
  filter?: ModelSubscriptionOrganisationFilterInput | null,
};

export type OnDeleteOrganisationSubscription = {
  onDeleteOrganisation?:  {
    __typename: "Organisation",
    createdAt: string,
    id: string,
    name?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type OnDeletePaymentSubscriptionVariables = {
  filter?: ModelSubscriptionPaymentFilterInput | null,
};

export type OnDeletePaymentSubscription = {
  onDeletePayment?:  {
    __typename: "Payment",
    amount?: number | null,
    approvedBy?: string | null,
    approvedById?: string | null,
    chapterId?: string | null,
    conversionAmount?: number | null,
    conversionCurrency?: string | null,
    conversionDescription?: string | null,
    conversionRate?: number | null,
    conversionTime?: string | null,
    createdAt: string,
    currency?: string | null,
    description?: string | null,
    divisionId?: string | null,
    gbpEquivalent?: number | null,
    id: string,
    isConverted?: boolean | null,
    organisationId?: string | null,
    paymentDate?: string | null,
    regionId?: string | null,
    remissionMonth?: string | null,
    remissionPeriod?: string | null,
    remissionYear?: string | null,
    status?: string | null,
    updatedAt: string,
    userCode?: string | null,
    userId?: string | null,
    userName?: string | null,
  } | null,
};

export type OnDeleteRegionSubscriptionVariables = {
  filter?: ModelSubscriptionRegionFilterInput | null,
};

export type OnDeleteRegionSubscription = {
  onDeleteRegion?:  {
    __typename: "Region",
    createdAt: string,
    divisionId?: string | null,
    id: string,
    name?: string | null,
    organisationId?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    address?: string | null,
    chapterId?: string | null,
    cognitoUserId?: string | null,
    createdAt?: string | null,
    dateofBirth?: string | null,
    divisionId?: string | null,
    email: string,
    firstName: string,
    gender?: string | null,
    hipCategory: string,
    id: string,
    imageUrl?: string | null,
    lastName: string,
    middleName?: string | null,
    nationality?: string | null,
    occupation?: string | null,
    organisationId?: string | null,
    partnerType?: string | null,
    permissionAccess?: Array< string | null > | null,
    permissionType?: UserPermissionType | null,
    phoneNumber?: string | null,
    regionId?: string | null,
    remissionStartDate?: string | null,
    status?: string | null,
    uniqueCode?: string | null,
    updatedAt: string,
    verified: boolean,
  } | null,
};

export type OnUpdateChapterSubscriptionVariables = {
  filter?: ModelSubscriptionChapterFilterInput | null,
};

export type OnUpdateChapterSubscription = {
  onUpdateChapter?:  {
    __typename: "Chapter",
    baseCurrency?: string | null,
    country?: string | null,
    createdAt: string,
    divisionId?: string | null,
    id: string,
    name?: string | null,
    organisationId?: string | null,
    regionId?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateDivisionSubscriptionVariables = {
  filter?: ModelSubscriptionDivisionFilterInput | null,
};

export type OnUpdateDivisionSubscription = {
  onUpdateDivision?:  {
    __typename: "Division",
    createdAt: string,
    id: string,
    name?: string | null,
    organisationId?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateOrganisationSubscriptionVariables = {
  filter?: ModelSubscriptionOrganisationFilterInput | null,
};

export type OnUpdateOrganisationSubscription = {
  onUpdateOrganisation?:  {
    __typename: "Organisation",
    createdAt: string,
    id: string,
    name?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type OnUpdatePaymentSubscriptionVariables = {
  filter?: ModelSubscriptionPaymentFilterInput | null,
};

export type OnUpdatePaymentSubscription = {
  onUpdatePayment?:  {
    __typename: "Payment",
    amount?: number | null,
    approvedBy?: string | null,
    approvedById?: string | null,
    chapterId?: string | null,
    conversionAmount?: number | null,
    conversionCurrency?: string | null,
    conversionDescription?: string | null,
    conversionRate?: number | null,
    conversionTime?: string | null,
    createdAt: string,
    currency?: string | null,
    description?: string | null,
    divisionId?: string | null,
    gbpEquivalent?: number | null,
    id: string,
    isConverted?: boolean | null,
    organisationId?: string | null,
    paymentDate?: string | null,
    regionId?: string | null,
    remissionMonth?: string | null,
    remissionPeriod?: string | null,
    remissionYear?: string | null,
    status?: string | null,
    updatedAt: string,
    userCode?: string | null,
    userId?: string | null,
    userName?: string | null,
  } | null,
};

export type OnUpdateRegionSubscriptionVariables = {
  filter?: ModelSubscriptionRegionFilterInput | null,
};

export type OnUpdateRegionSubscription = {
  onUpdateRegion?:  {
    __typename: "Region",
    createdAt: string,
    divisionId?: string | null,
    id: string,
    name?: string | null,
    organisationId?: string | null,
    reps?:  Array< {
      __typename: "repsType",
      email?: string | null,
      id?: string | null,
      name?: string | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    address?: string | null,
    chapterId?: string | null,
    cognitoUserId?: string | null,
    createdAt?: string | null,
    dateofBirth?: string | null,
    divisionId?: string | null,
    email: string,
    firstName: string,
    gender?: string | null,
    hipCategory: string,
    id: string,
    imageUrl?: string | null,
    lastName: string,
    middleName?: string | null,
    nationality?: string | null,
    occupation?: string | null,
    organisationId?: string | null,
    partnerType?: string | null,
    permissionAccess?: Array< string | null > | null,
    permissionType?: UserPermissionType | null,
    phoneNumber?: string | null,
    regionId?: string | null,
    remissionStartDate?: string | null,
    status?: string | null,
    uniqueCode?: string | null,
    updatedAt: string,
    verified: boolean,
  } | null,
};

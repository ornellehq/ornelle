import {
  type GetApplications200ResponseInner,
  type GetApplications200ResponseInnerCandidate,
  type GetAttributes200ResponseInner,
  GetAttributesEntityTypesEnum,
  type GetOpenings200ResponseInner,
  type GetRoles200ResponseInner,
} from "sdks/src/server-sdk"

export interface Role extends GetRoles200ResponseInner {}
export interface Opening extends NonNullable<GetOpenings200ResponseInner> {}
export interface Candidate
  extends NonNullable<GetApplications200ResponseInnerCandidate> {}
export interface Attribute extends NonNullable<GetAttributes200ResponseInner> {}
export interface Application
  extends NonNullable<GetApplications200ResponseInner> {}
export const EntityTypes = GetAttributesEntityTypesEnum

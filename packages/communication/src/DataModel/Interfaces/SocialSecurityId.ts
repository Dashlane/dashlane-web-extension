import * as Common from "./Common";
export interface SocialSecurityId extends Common.DataModelObject {
  LinkedIdentity: string;
  SocialSecurityFullname: string;
  Sex: string;
  DateOfBirth: string;
  SocialSecurityNumber: string;
}
export function isSocialSecurityId(
  o: Common.BaseDataModelObject
): o is SocialSecurityId {
  return Boolean(o) && o.kwType === "KWSocialSecurityStatement";
}

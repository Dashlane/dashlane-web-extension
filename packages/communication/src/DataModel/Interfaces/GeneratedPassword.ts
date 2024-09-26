import * as Common from "./Common";
export interface GeneratedPassword extends Common.BaseDataModelObject {
  AuthId?: string;
  Domain: string;
  GeneratedDate: number;
  Password: string;
  SpaceId?: string;
  Platform: string;
}
export function isGeneratedPassword(
  o: Common.BaseDataModelObject
): o is GeneratedPassword {
  return Boolean(o) && o.kwType === "KWGeneratedPassword";
}

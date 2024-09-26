import * as Common from "./Common";
export type IdentityTitle =
  | ""
  | "MR"
  | "MME"
  | "MLLE"
  | "MS"
  | "MX"
  | "NONE_OF_THESE";
export interface Identity extends Common.DataModelObject {
  FirstName: string;
  MiddleName: string;
  LastName: string;
  LastName2: string;
  Pseudo: string;
  BirthDate: string;
  BirthPlace: string;
  Title: IdentityTitle;
}
export function isIdentity(o: Common.BaseDataModelObject): o is Identity {
  return Boolean(o) && o.kwType === "KWIdentity";
}

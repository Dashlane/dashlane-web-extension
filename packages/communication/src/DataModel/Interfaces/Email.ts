import * as Common from "./Common";
export type EmailType = "PERSO" | "PRO" | "NO_TYPE";
export interface Email extends Common.DataModelObject {
  Type: EmailType;
  EmailName: string;
  Email: string;
}
export function isEmail(o: Common.BaseDataModelObject): o is Email {
  return Boolean(o) && o.kwType === "KWEmail";
}

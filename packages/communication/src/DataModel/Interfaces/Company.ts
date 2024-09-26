import * as Common from "./Common";
export interface Company extends Common.DataModelObject {
  Name: string;
  JobTitle: string;
  PersonalNote: string;
}
export function isCompany(o: Common.BaseDataModelObject): o is Company {
  return Boolean(o) && o.kwType === "KWCompany";
}

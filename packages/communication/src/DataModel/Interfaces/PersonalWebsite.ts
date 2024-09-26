import * as Common from "./Common";
export interface PersonalWebsite extends Common.DataModelObject {
  Name: string;
  Website: string;
  PersonalNote?: string;
}
export function isPersonalWebsite(
  o: Common.BaseDataModelObject
): o is PersonalWebsite {
  return Boolean(o) && o.kwType === "KWPersonalWebsite";
}

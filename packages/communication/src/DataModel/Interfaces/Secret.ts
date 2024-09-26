import * as Common from "./Common";
export interface Secret extends Common.DataModelObject {
  Title: string;
  Content: string;
  Secured: boolean;
}
export function isSecret(o: Common.BaseDataModelObject): o is Secret {
  return Boolean(o) && o.kwType === "KWSecret";
}

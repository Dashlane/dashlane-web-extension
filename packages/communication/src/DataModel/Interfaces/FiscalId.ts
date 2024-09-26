import * as Common from "./Common";
export interface FiscalId extends Common.DataModelObject {
  FiscalNumber: string;
  TeledeclarantNumber: string;
}
export function isFiscalId(o: Common.BaseDataModelObject): o is FiscalId {
  return Boolean(o) && o.kwType === "KWFiscalStatement";
}

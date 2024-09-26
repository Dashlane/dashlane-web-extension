import * as Common from "./Common";
export enum BreachStatus {
  PENDING = "PENDING",
  VIEWED = "VIEWED",
  ACKNOWLEDGED = "ACKNOWLEDGED",
}
export interface VersionedBreaches {
  revision: number;
  breaches: Breach[];
}
export interface Breach extends Common.BaseDataModelObject {
  BreachId: string;
  Content: string;
  ContentRevision: number;
  LeakedPasswords: string;
  Status: BreachStatus;
}
export function isBreach(o: Common.BaseDataModelObject): o is Breach {
  return Boolean(o) && o.kwType === "KWSecurityBreach";
}

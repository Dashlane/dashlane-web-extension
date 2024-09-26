import * as Common from "./Common";
export interface Passport extends Common.DataModelObject {
  LinkedIdentity: string;
  Fullname: string;
  Sex: string;
  DateOfBirth: string;
  Number: string;
  DeliveryDate: string;
  ExpireDate: string;
  DeliveryPlace: string;
}
export function isPassport(o: Common.BaseDataModelObject): o is Passport {
  return Boolean(o) && o.kwType === "KWPassport";
}

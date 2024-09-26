import * as Common from "./Common";
export interface IdCard extends Common.DataModelObject {
  LinkedIdentity: string;
  Fullname: string;
  Sex: string;
  DateOfBirth: string;
  Number: string;
  ExpireDate: string;
  DeliveryDate: string;
}
export function isIdCard(o: Common.BaseDataModelObject): o is IdCard {
  return Boolean(o) && o.kwType === "KWIDCard";
}

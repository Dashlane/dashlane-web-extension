import { Enum } from "typescript-string-enums";
import * as Common from "./Common";
export const PhoneType = Enum(
  "PHONE_TYPE_ANY",
  "PHONE_TYPE_MOBILE",
  "PHONE_TYPE_LANDLINE",
  "PHONE_TYPE_FAX",
  "PHONE_TYPE_WORK_MOBILE",
  "PHONE_TYPE_WORK_LANDLINE",
  "PHONE_TYPE_WORK_FAX"
);
export type PhoneType = Enum<typeof PhoneType>;
export interface Phone extends Common.DataModelObject {
  Type: PhoneType;
  Number: string;
  NumberNational: string;
  NumberInternational: string;
  PhoneName: string;
  PersonalNote: string;
}
export function isPhone(o: Common.BaseDataModelObject): o is Phone {
  return Boolean(o) && o.kwType === "KWPhone";
}

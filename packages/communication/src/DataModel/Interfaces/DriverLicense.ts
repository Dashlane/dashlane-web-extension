import * as Common from "./Common";
export interface DriverLicense extends Common.DataModelObject {
  LinkedIdentity: string;
  Fullname: string;
  DateOfBirth: string;
  Sex: string;
  Number: string;
  DeliveryDate: string;
  ExpireDate: string;
  State: string;
}
export function isDriverLicense(
  o: Common.BaseDataModelObject
): o is DriverLicense {
  return Boolean(o) && o.kwType === "KWDriverLicence";
}

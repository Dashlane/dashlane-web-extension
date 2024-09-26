import { GeographicStateValue } from "../..";
import * as Common from "./Common";
export interface Address extends Common.DataModelObject {
  AddressName: string;
  Receiver: string;
  AddressFull: string;
  City: string;
  ZipCode: string;
  State: GeographicStateValue;
  Country: string;
  StreetNumber: string;
  StreetTitle: string;
  StreetName: string;
  StateNumber: string;
  StateLevel2: string;
  Building: string;
  Stairs: string;
  Floor: string;
  Door: string;
  DigitCode: string;
  LinkedPhone: string;
  PersonalNote: string;
}
export function isAddress(o: Common.BaseDataModelObject): o is Address {
  return Boolean(o) && o.kwType === "KWAddress";
}

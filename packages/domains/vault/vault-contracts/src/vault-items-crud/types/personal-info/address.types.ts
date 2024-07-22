import { BaseItem, Country } from "../common";
export interface Address extends BaseItem {
  building: string;
  city: string;
  country: Country;
  digitCode: string;
  door: string;
  floor: string;
  itemName: string;
  linkedPhoneId: string;
  receiver: string;
  stairs: string;
  state: string;
  stateNumber: string;
  streetName: string;
  streetNumber: string;
  zipCode: string;
}

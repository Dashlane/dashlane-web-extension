import {
  Company,
  Email,
  PersonalWebsite,
  Phone,
  Address,
  Identity,
} from "./Interfaces";
export type PersonalInfoItem =
  | Company
  | Email
  | PersonalWebsite
  | Phone
  | Address
  | Identity;

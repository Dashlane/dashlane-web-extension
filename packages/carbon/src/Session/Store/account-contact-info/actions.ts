import { Action } from "Store";
import { ContactInfo } from "Session/Store/account-contact-info/types";
export const SAVE_ACCOUNT_CONTACT_INFO = "SAVE_ACCOUNT_CONTACT_INFO";
export const ACCOUNT_CONTACT_INFO_REFRESHED = "ACCOUNT_CONTACT_INFO_REFRESHED";
export const saveAccountContactInfo = (
  accountContactInfo: ContactInfo
): Action => {
  return {
    type: SAVE_ACCOUNT_CONTACT_INFO,
    accountContactInfo,
  };
};
export const accountContactInfoRefreshed = (
  accountContactInfo: ContactInfo
): Action => {
  return {
    type: ACCOUNT_CONTACT_INFO_REFRESHED,
    accountContactInfo,
  };
};

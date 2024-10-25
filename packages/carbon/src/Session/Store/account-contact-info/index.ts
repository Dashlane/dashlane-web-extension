import { ContactInfo } from "Session/Store/account-contact-info/types";
import {
  ACCOUNT_CONTACT_INFO_REFRESHED,
  SAVE_ACCOUNT_CONTACT_INFO,
} from "Session/Store/account-contact-info/actions";
import { Action } from "Store";
export default (state: ContactInfo = {}, action: Action) => {
  switch (action.type) {
    case SAVE_ACCOUNT_CONTACT_INFO:
      return {
        ...state,
        ...action.accountContactInfo,
      };
    case ACCOUNT_CONTACT_INFO_REFRESHED:
      return {
        ...state,
        ...action.accountContactInfo,
      };
    default:
      return state;
  }
};

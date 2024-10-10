import { State } from "Store";
import { ContactInfo } from "@dashlane/communication";
export const contactInfoSelector = (state: State): ContactInfo =>
  state.userSession.accountContactInfo;

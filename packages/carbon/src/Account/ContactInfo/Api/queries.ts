import { ContactInfo } from "@dashlane/communication";
import { Query } from "Shared/Api";
export type ContactInfoQueries = {
  getContactInfo: Query<void, ContactInfo>;
};

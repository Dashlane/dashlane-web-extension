import { ContactInfo } from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type ContactInfoLiveQueries = {
  liveContactInfo: LiveQuery<void, ContactInfo>;
};

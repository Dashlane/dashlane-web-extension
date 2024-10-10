import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { ContactInfoCommands } from "Account/ContactInfo/Api/commands";
import { ContactInfoQueries } from "Account/ContactInfo/Api/queries";
import { ContactInfoLiveQueries } from "Account/ContactInfo/Api/live-queries";
import {
  editContactInfoHandler,
  refreshContactInfoHandler,
} from "Account/ContactInfo/handlers";
import { contactInfoSelector } from "Account/ContactInfo/selectors";
import { contactInfo$ } from "Account/ContactInfo/live";
export const config: CommandQueryBusConfig<
  ContactInfoCommands,
  ContactInfoQueries,
  ContactInfoLiveQueries
> = {
  commands: {
    editContactInfo: { handler: editContactInfoHandler },
    refreshContactInfo: { handler: refreshContactInfoHandler },
  },
  queries: {
    getContactInfo: {
      selector: contactInfoSelector,
    },
  },
  liveQueries: {
    liveContactInfo: {
      operator: contactInfo$,
    },
  },
};

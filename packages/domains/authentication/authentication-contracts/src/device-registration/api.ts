import { defineModuleApi } from "@dashlane/framework-contracts";
import {
  CleanRemotelyRemovedProfilesCommand,
  RegisterDeviceCommand,
} from "./commands";
import { LocalAccountsQuery } from "./queries";
export const deviceRegistrationApi = defineModuleApi({
  name: "deviceRegistration" as const,
  commands: {
    cleanRemotelyRemovedProfiles: CleanRemotelyRemovedProfilesCommand,
    registerDevice: RegisterDeviceCommand,
  },
  events: {},
  queries: {
    localAccounts: LocalAccountsQuery,
  },
});

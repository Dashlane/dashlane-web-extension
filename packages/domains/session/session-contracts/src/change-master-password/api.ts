import { defineModuleApi } from "@dashlane/framework-contracts";
import { MasterPasswordChangedEvent } from "./events";
import { TemporarySendMasterPasswordChangedEventCommand } from "./commands";
export const changeMasterPasswordApi = defineModuleApi({
  name: "changeMasterPassword" as const,
  commands: {
    temporarySendMasterPasswordChangedEvent:
      TemporarySendMasterPasswordChangedEventCommand,
  },
  events: {
    masterPasswordChanged: MasterPasswordChangedEvent,
  },
  queries: {},
});

import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { SettingsCommands } from "DataManagement/Settings/Api/commands";
import { SettingsQueries } from "DataManagement/Settings/Api/queries";
import {
  anonymousUserIdSelector,
  getIsUrlBanishedSelector,
} from "DataManagement/Settings/selectors";
import {
  protectPasswordsSettingSelector,
  richIconsSettingSelector,
} from "Session/selectors";
import { protectPasswordsSetting$, richIconsSetting$ } from "./live";
import { SettingsLiveQueries } from "./live-queries";
import {
  toggleDashlaneHandler,
  updateAutofillSettingsHandler,
  updateProtectPasswordsSettingHandler,
  updateRichIconsSettingHandler,
} from "./handlers";
export const config: CommandQueryBusConfig<
  SettingsCommands,
  SettingsQueries,
  SettingsLiveQueries
> = {
  commands: {
    updateProtectPasswordsSetting: {
      handler: updateProtectPasswordsSettingHandler,
    },
    toggleDashlane: { handler: toggleDashlaneHandler },
    updateAutofillSettings: { handler: updateAutofillSettingsHandler },
    updateRichIconsSetting: {
      handler: updateRichIconsSettingHandler,
    },
  },
  queries: {
    getAnonymousUserId: { selector: anonymousUserIdSelector },
    getIsUrlBanished: {
      selector: getIsUrlBanishedSelector,
    },
    arePasswordsProtected: { selector: protectPasswordsSettingSelector },
    areRichIconsEnabled: { selector: richIconsSettingSelector },
  },
  liveQueries: {
    liveArePasswordsProtected: { operator: protectPasswordsSetting$ },
    liveAreRichIconsEnabled: { operator: richIconsSetting$ },
  },
};

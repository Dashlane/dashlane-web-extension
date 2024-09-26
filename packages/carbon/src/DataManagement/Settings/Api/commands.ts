import {
  ToggleDashlaneRequest,
  UpdateAutofillSettingsRequest,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type SettingsCommands = {
  toggleDashlane: Command<ToggleDashlaneRequest, void>;
  updateProtectPasswordsSetting: Command<boolean, void>;
  updateAutofillSettings: Command<UpdateAutofillSettingsRequest, void>;
  updateRichIconsSetting: Command<boolean, void>;
};

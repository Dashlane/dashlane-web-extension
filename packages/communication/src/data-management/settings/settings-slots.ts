import { slot } from "ts-event-bus";
import { liveSlot } from "../../CarbonApi";
import { ToggleDashlaneRequest, UpdateAutofillSettingsRequest } from "./types";
export const settingsQueriesSlots = {
  getAnonymousUserId: slot<void, string>(),
  getIsUrlBanished: slot<string, boolean>(),
  arePasswordsProtected: slot<void, boolean>(),
  areRichIconsEnabled: slot<void, boolean>(),
};
export const settingsLiveQueriesSlots = {
  liveArePasswordsProtected: liveSlot<boolean>(),
  liveAreRichIconsEnabled: liveSlot<boolean>(),
};
export const settingsCommandsSlots = {
  toggleDashlane: slot<ToggleDashlaneRequest>(),
  updateProtectPasswordsSetting: slot<boolean>(),
  updateAutofillSettings: slot<UpdateAutofillSettingsRequest>(),
  updateRichIconsSetting: slot<boolean>(),
};

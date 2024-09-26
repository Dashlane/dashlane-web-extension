import { uniq, without } from "ramda";
import {
  PersonalSettings,
  ToggleDashlaneRequest,
} from "@dashlane/communication";
import { ParsedURL } from "@dashlane/url-parser";
export function toggleDashlaneOnSiteToPersonalSettingsPartial(
  personalSettings: PersonalSettings,
  options: ToggleDashlaneRequest
): Partial<PersonalSettings> {
  const domain = new ParsedURL(options.url).getRootDomain();
  let autofillSettings = personalSettings.AutofillSettings;
  autofillSettings = {
    ...autofillSettings,
    disabledDomains: options.autofill
      ? without([domain], personalSettings.AutofillSettings.disabledDomains)
      : uniq(personalSettings.AutofillSettings.disabledDomains.concat(domain)),
  };
  return {
    AutofillSettings: autofillSettings,
  };
}

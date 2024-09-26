import { DomainInfo, PersonalSettings } from "@dashlane/communication";
import { ParsedURL } from "@dashlane/url-parser";
import Debugger from "Logs/Debugger";
import { difference, identity, mergeAll, pick, unapply } from "ramda";
import { StoreService } from "Store";
import { SessionService } from "User/Services/types";
import { editPersonalSettings } from "Session/Store/personalSettings/actions";
export function updatePersonalSettings(
  storeService: StoreService,
  sessionService: SessionService,
  personalSettingsUpdated: Partial<PersonalSettings>
): void {
  if (!storeService.isAuthenticated()) {
    Debugger.log("No session available to updatePersonalSettings");
    return;
  }
  const newPersonalSettings = pickUpdatedPersonalSettings(
    storeService.getPersonalSettings(),
    personalSettingsUpdated
  );
  storeService.dispatch(editPersonalSettings(newPersonalSettings));
  sessionService.getInstance().user.persistPersonalSettings();
}
export function signalSaveCredentialDisabled(
  storeService: StoreService,
  sessionService: SessionService,
  domainInfo: DomainInfo
): void {
  if (!storeService.isAuthenticated()) {
    Debugger.log("No session available, in theory this should not be called");
    return;
  }
  const banishedUrls = Array.isArray(
    storeService.getPersonalSettings().BanishedUrlsList
  )
    ? storeService.getPersonalSettings().BanishedUrlsList
    : [];
  if (banishedUrls.indexOf(domainInfo.fullDomain) > 0) {
    return;
  }
  storeService.dispatch(
    editPersonalSettings({
      BanishedUrlsList: [...banishedUrls, domainInfo.fullDomain],
    })
  );
  sessionService.getInstance().user.persistPersonalSettings();
}
export function isSaveCredentialDisabledOnDomain(
  storeService: StoreService,
  domainInfo: DomainInfo
): boolean {
  if (!storeService.isAuthenticated()) {
    Debugger.log("No session available, save credential is enabled by default");
    return false;
  }
  const banishedUrls = Array.isArray(
    storeService.getPersonalSettings().BanishedUrlsList
  )
    ? storeService.getPersonalSettings().BanishedUrlsList
    : [];
  return banishedUrls
    .map((url) => new ParsedURL(url))
    .some((parsedUrl) => parsedUrl.getHostname() === domainInfo.fullDomain);
}
export const pickUpdatedPersonalSettings = (
  personalSettings: PersonalSettings,
  personalSettingsUpdated: Partial<PersonalSettings>
): Partial<PersonalSettings> => {
  const personalSettingsPicked = pick(Object.keys(personalSettingsUpdated))(
    personalSettings
  );
  const list = unapply(identity);
  const personalSettingsReallyUpdated = mergeAll(
    difference(list(personalSettingsUpdated), list(personalSettingsPicked))
  );
  return personalSettingsReallyUpdated;
};

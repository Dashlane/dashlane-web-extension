import { contains, mergeDeepRight } from "ramda";
import { PersonalSettings, WebsiteOptions } from "@dashlane/communication";
import { ParsedURL } from "@dashlane/url-parser";
import {
  PersonalSettingsAction,
  PersonalSettingsActionType,
} from "Session/Store/personalSettings/actions";
import { fixPersonalSettingTypes } from "Session/Store/personalSettings/fixTypes";
import { StoreService } from "Store/index";
import { spaceDisabledDomainsListSelector } from "Session/selectors";
export const makeBasePersonalSettings = (): PersonalSettings => {
  return {
    RealLogin: null,
    SecurityEmail: null,
    accountCreationDatetime: null,
    Format: null,
    Language: null,
    AnonymousUserId: null,
    UsagelogToken: null,
    SyncBackup: null,
    AutofillSettings: {
      isAutofillDisabled: false,
      isAutologinDisabled: false,
      disabledSourceTypes: [],
      disabledDomains: [],
      isFollowUpNotificationEnabled: true,
    },
    SecuredDataAutofillCreditcard: true,
    SecuredDataShowCreditcard: true,
    SecuredDataShowIDs: true,
    SecuredDataShowPassword: false,
    SecuredDataShowScreenshots: true,
    ProtectPasswords: false,
    ProtectPayments: true,
    ProtectIDs: false,
    RichIcons: true,
    kwType: "KWSettingsManagerApp",
    Id: "SETTINGS_userId",
    LastBackupTime: null,
  };
};
export function getEmptyPersonalSettings(): PersonalSettings {
  return {
    AccountRecoveryKey: null,
    AccountRecoveryKeyId: null,
    DisabledDomainsList: [],
    DisabledUrlsList: [],
    DisabledDomainsAutologinList: [],
    DisabledUrlsAutologinList: [],
    SyncBackupCreditCardsCCV: null,
    SyncBackupCreditCardsNumber: null,
    SyncBackupPasswords: null,
    SyncBackupPersonaldata: null,
    SyncBackupPurchase: null,
    SecuredDataAutofillCreditcard: true,
    SecuredDataShowCreditcard: true,
    SecuredDataShowIDs: true,
    SecuredDataShowPassword: false,
    SecuredDataShowScreenshots: true,
    ProtectPasswords: false,
    ProtectPayments: true,
    RichIcons: true,
    ProtectIDs: false,
    CryptoUserPayload: null,
    ...makeBasePersonalSettings(),
  };
}
export default (
  state = getEmptyPersonalSettings(),
  action: PersonalSettingsAction
): any => {
  switch (action.type) {
    case PersonalSettingsActionType.LoadFromStorage:
      return mergeDeepRight(
        state,
        fixPersonalSettingTypes.fromTransaction(action.data)
      );
    case PersonalSettingsActionType.EditFromTransaction:
      return mergeDeepRight(
        state,
        fixPersonalSettingTypes.fromTransaction(action.content)
      );
    case PersonalSettingsActionType.Edit:
      return mergeDeepRight(state, action.content);
    default:
      return state;
  }
};
export function getUpdatedPersonalSettings(
  currentSettings: PersonalSettings,
  newSettings: Partial<PersonalSettings>
): PersonalSettings {
  const emptyPersonalSettings = getEmptyPersonalSettings();
  const keys = Object.keys(emptyPersonalSettings);
  for (const key of keys) {
    if (!newSettings[key] && newSettings[key] !== undefined) {
      newSettings[key] = emptyPersonalSettings[key];
    }
  }
  return {
    ...currentSettings,
    ...newSettings,
  };
}
export function getWebsiteInfo(
  storeService: StoreService,
  url: string
): WebsiteOptions {
  const domain = new ParsedURL(url).getRootDomain();
  const settings = storeService.getPersonalSettings();
  const spaceDisabledDomainsList = spaceDisabledDomainsListSelector(
    storeService.getState()
  );
  return {
    disabledAutofillOnDomain: contains(domain, settings.DisabledDomainsList),
    disabledAutofillOnPage: contains(url, settings.DisabledUrlsList),
    disabledAutologinOnDomain: contains(domain, [
      ...settings.DisabledDomainsAutologinList,
      ...spaceDisabledDomainsList,
    ]),
    disabledAutologinOnPage: contains(url, settings.DisabledUrlsAutologinList),
    disabledFromSpaces: false,
  };
}

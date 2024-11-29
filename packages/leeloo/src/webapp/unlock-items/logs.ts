import {
  Action,
  AnonymousUpdateCredentialEvent,
  DomainType,
  Field,
  FlowStep,
  FlowType,
  hashDomain,
  ItemType,
  Mode,
  Reason,
  SettingLevel,
  Space,
  UserAskAuthenticationEvent,
  UserChangeProtectWithMasterPasswordSettingEvent,
  UserUpdateVaultItemEvent,
} from "@dashlane/hermes";
import { ParsedURL } from "@dashlane/url-parser";
import { logEvent } from "../../libs/logs/logEvent";
const logUserEventUpdateVaultItem = (
  enabled: boolean,
  credentialId: string,
  space: Space
) => {
  logEvent(
    new UserUpdateVaultItemEvent({
      action: Action.Edit,
      fieldsEdited: [enabled ? Field.MpProtectedOn : Field.MpProtectedOff],
      itemId: credentialId,
      itemType: ItemType.Credential,
      space,
    })
  );
};
const logAnonymousEventUpdateCredential = (
  enable: boolean,
  source: DomainType,
  domain: string,
  space: Space
) => {
  logEvent(
    new AnonymousUpdateCredentialEvent({
      action: Action.Edit,
      fieldList: [enable ? Field.MpProtectedOn : Field.MpProtectedOff],
      domain: {
        type: source,
        id: domain,
      },
      space,
    })
  );
};
export const logCredentialProtectionChange = async (
  enabled: boolean,
  credentialId: string,
  credentialUrl: string,
  space?: string
) => {
  const credentialURLRootDomain = new ParsedURL(credentialUrl).getRootDomain();
  const domain = await hashDomain(credentialURLRootDomain);
  logAnonymousEventUpdateCredential(
    enabled,
    APP_PACKAGED_IN_EXTENSION ? DomainType.App : DomainType.Web,
    domain,
    space ? Space.Professional : Space.Personal
  );
  logUserEventUpdateVaultItem(
    true,
    credentialId,
    space ? Space.Professional : Space.Personal
  );
};
const logUserEventChangeMasterPasswordProtectSetting = (activated: boolean) => {
  logEvent(
    new UserChangeProtectWithMasterPasswordSettingEvent({
      flowStep: FlowStep.Complete,
      flowType: activated ? FlowType.Activation : FlowType.Deactivation,
      settingLevel: SettingLevel.Credentials,
    })
  );
};
export const logUserEventAskAuthentication = () => {
  logEvent(
    new UserAskAuthenticationEvent({
      mode: Mode.MasterPassword,
      reason: Reason.EditSettings,
    })
  );
};
export const logChangeMasterPasswordProtectSetting = (enable: boolean) =>
  logUserEventChangeMasterPasswordProtectSetting(enable);
export const logUnlockMasterPasswordProtectSetting = () =>
  logUserEventAskAuthentication();

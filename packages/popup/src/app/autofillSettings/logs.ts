import { DataModelType } from '@dashlane/communication';
import { AutofillableDataModel } from '@dashlane/autofill-contracts';
import { AnonymousAutofillSettingEvent, AutofillConfiguration, AutofillDurationSetting, AutofillScope, Button, ClickOrigin, DisableSetting, DomainType, hashDomain, ItemType, UserAutofillSettingEvent, UserClickEvent, } from '@dashlane/hermes';
import { logEvent } from 'src/libs/logs/logEvent';
export async function logAutofillToggledForUrl(domain: string, action: 'enabled' | 'disabled') {
    const disableSetting: DisableSetting = {
        scope: AutofillScope.Site,
        configuration: action === 'enabled'
            ? AutofillConfiguration.AutofillEnabled
            : AutofillConfiguration.AutofillDisabled,
        duration_setting: action === 'enabled'
            ? AutofillDurationSetting.UntilTurnedBackOff
            : AutofillDurationSetting.UntilTurnedBackOn,
    };
    void logEvent(new UserAutofillSettingEvent({
        disableSetting,
        isBulk: false,
    }));
    void logEvent(new AnonymousAutofillSettingEvent({
        isNativeApp: false,
        domain: {
            type: DomainType.Web,
            id: await hashDomain(domain),
        },
        disableSetting,
    }));
}
const dataModelTypeToItemType: Partial<Record<AutofillableDataModel, ItemType>> = {
    [DataModelType.KWAddress]: ItemType.Address,
    [DataModelType.KWAuthentifiant]: ItemType.Credential,
    [DataModelType.KWBankStatement]: ItemType.BankStatement,
    [DataModelType.KWCompany]: ItemType.Company,
    [DataModelType.KWDriverLicence]: ItemType.DriverLicence,
    [DataModelType.KWEmail]: ItemType.Email,
    [DataModelType.KWFiscalStatement]: ItemType.FiscalStatement,
    [DataModelType.KWGeneratedPassword]: ItemType.GeneratedPassword,
    [DataModelType.KWIDCard]: ItemType.IdCard,
    [DataModelType.KWIdentity]: ItemType.Identity,
    [DataModelType.KWPasskey]: ItemType.Passkey,
    [DataModelType.KWPassport]: ItemType.Passport,
    [DataModelType.KWPaymentMean_creditCard]: ItemType.CreditCard,
    [DataModelType.KWPaymentMean_paypal]: ItemType.Paypal,
    [DataModelType.KWPersonalWebsite]: ItemType.Website,
    [DataModelType.KWPhone]: ItemType.Phone,
    [DataModelType.KWSecureNote]: ItemType.SecureNote,
    [DataModelType.KWSocialSecurityStatement]: ItemType.SocialSecurity,
};
export function logAutofillToggledForSourceTypes(sourceTypes: AutofillableDataModel[], action: 'enabled' | 'disabled') {
    const itemTypes: ItemType[] = [];
    sourceTypes.forEach((sourceType) => {
        const itemType = dataModelTypeToItemType[sourceType];
        if (itemType) {
            itemTypes.push(itemType);
        }
    });
    const disableSetting: DisableSetting = {
        scope: AutofillScope.Global,
        configuration: action === 'enabled'
            ? AutofillConfiguration.AutofillEnabled
            : AutofillConfiguration.AutofillDisabled,
        duration_setting: action === 'enabled'
            ? AutofillDurationSetting.UntilTurnedBackOff
            : AutofillDurationSetting.UntilTurnedBackOn,
    };
    void logEvent(new UserAutofillSettingEvent({
        disableSetting,
        isBulk: itemTypes.length > 1,
        itemTypeList: itemTypes,
    }));
    void logEvent(new AnonymousAutofillSettingEvent({
        isNativeApp: false,
        disableSetting,
        itemTypeList: itemTypes,
    }));
}
export function logAutologinToggled(enabled: boolean) {
    const disableSetting: DisableSetting = {
        scope: AutofillScope.Global,
        configuration: enabled
            ? AutofillConfiguration.AutologinEnabled
            : AutofillConfiguration.AutologinDisabled,
        duration_setting: enabled
            ? AutofillDurationSetting.UntilTurnedBackOff
            : AutofillDurationSetting.UntilTurnedBackOn,
    };
    void logEvent(new UserAutofillSettingEvent({
        disableSetting,
        isBulk: false,
    }));
}
export const logBuyDashlane = () => {
    void logEvent(new UserClickEvent({
        button: Button.BuyDashlane,
        clickOrigin: ClickOrigin.Banner,
    }));
};

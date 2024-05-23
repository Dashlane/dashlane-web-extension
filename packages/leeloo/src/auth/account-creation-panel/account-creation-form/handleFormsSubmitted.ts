import { CreateAccountResult, UserConsent } from '@dashlane/communication';
import { Lee } from 'lee';
import { carbonConnector } from 'libs/carbon/connector';
import { ConfirmSubmitOptions } from './confirm/confirm-form';
import { getUserId } from 'user/index';
import { getDefaultDeviceName } from 'helpers';
import { translate } from 'libs/i18n';
export const handleStep2Submit = async (lee: Lee, confirm: ConfirmSubmitOptions, step1Response: CreateAccountResult, isTACFlow: boolean): Promise<void> => {
    if (!step1Response.valid) {
        const error = new Error('accountCreationStep1.valid was not defined on confirm submit');
        lee.reportError(error);
        return Promise.reject(error);
    }
    if (confirm.isEu && !confirm.privacyPolicyAndToS.valueOr(false)) {
        const error = new Error('termsOfService set to false on confirm submit');
        lee.reportError(error);
        return Promise.reject(error);
    }
    const tosConsent: UserConsent[] = confirm.privacyPolicyAndToS.caseOf({
        just: (status: boolean) => [
            {
                consentType: 'privacyPolicyAndToS',
                status,
            },
        ],
        nothing: () => [],
    });
    const emailsConsent: UserConsent = {
        consentType: 'emailsOffersAndTips',
        status: step1Response.encryptSettingsRequest.subscribe,
    };
    try {
        await carbonConnector.createAccountStep2({
            createAccountResult: step1Response,
            options: { flowIndicator: isTACFlow ? 'teamTrial' : 'standaloneAccount' },
            isStandAlone: true,
            consents: [...tosConsent, emailsConsent],
        });
    }
    catch (e) {
        const error = e instanceof Error ? e : new Error('Unknown error');
        lee.reportError(error, 'Account creation failed');
    }
};
export const handleAccountCreationSubmit = async (lee: Lee, confirmPageOptions: ConfirmSubmitOptions, login: string, isTACFlow: boolean): Promise<void> => {
    const accountCreationState = confirmPageOptions;
    const settings = {
        anonymousUserId: getUserId(lee.globalState),
        login,
        password: accountCreationState.password,
        format: 'US',
        language: 'en',
        subscribe: accountCreationState.emailsTipsAndOffers.valueOr(false),
        deviceName: getDefaultDeviceName(translate('webapp_login_form_regsiter_fallback_browser_name')),
    };
    const step1Response = await carbonConnector.createAccountStep1(settings);
    await handleStep2Submit(lee, confirmPageOptions, step1Response, isTACFlow);
};

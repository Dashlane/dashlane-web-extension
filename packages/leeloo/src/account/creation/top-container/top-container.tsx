import { Fragment, useEffect, useState } from 'react';
import { jsx } from '@dashlane/design-system';
import { ConfirmAccountCreationResult, CreateAccountRequest, CreateAccountResult, UserConsent, } from '@dashlane/communication';
import * as DashlaneAPIv2 from '@dashlane/dashlane-api';
import { Lee } from 'lee';
import { getUserId } from 'user';
import { TAC_URL } from 'app/routes/constants';
import loadingLottie from 'libs/assets/lottie-loading.json';
import { carbonConnector } from 'libs/carbon/connector';
import DashlaneExtension from 'libs/DashlaneExtension';
import Animation from 'libs/dashlane-style/animation';
import { redirectToUrl } from 'libs/external-urls';
import useTranslate from 'libs/i18n/useTranslate';
import { logUserWebAccountCreationEvent } from 'libs/logs/events/create-account/createAccount';
import { getUserFunnelCookieWebsite } from 'libs/logs/getUserFunnelCookie';
import { CustomRoute, redirect } from 'libs/router';
import { isValidEmail } from 'libs/validators';
import { ConfirmForm, ConfirmSubmitOptions, } from 'account/creation/confirm/confirm-form';
import * as flow from 'account/creation/flow';
import { Info, InfoSubmitOptions } from 'account/creation/info/info';
import { getDefaultDeviceName } from 'helpers';
import styles from 'account/creation/top-container/index.css';
const accountCreationURLs = {
    teamTrial: {
        info: '/team/create',
        confirm: '/team/create/confirm',
    },
    webAccount: {
        info: '/account/create',
        confirm: '/account/create/confirm',
    },
    memberAccount: {
        info: '/member/create',
        confirm: '/member/create/confirm',
    },
};
export interface TopContainerProps {
    basePath: string;
    lee: Lee;
    options: {
        flowIndicator: flow.Indicator;
    };
    location: {
        search: string;
        pathname: string;
    };
}
export const TopContainer = ({ basePath, lee, options, location, }: TopContainerProps) => {
    const { translate } = useTranslate();
    const searchParams = new URLSearchParams(location.search);
    const [login, setLogin] = useState(searchParams.get('login') ?? searchParams.get('email'));
    const [lockedLoginValue] = useState(login && isValidEmail(login) ? login : '');
    const [isForceStartOnWeb, setIsForceStartOnWeb] = useState(searchParams.get('forceStartOnWeb') === 'true');
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const checkExtensionInstalled = (abortController: AbortController) => {
            DashlaneAPIv2.isInstalled()
                .then((isExtensionInstalled: boolean) => {
                if (!abortController.signal.aborted) {
                    setIsForceStartOnWeb(isExtensionInstalled);
                }
            })
                .catch(() => {
            })
                .finally(() => {
                if (!abortController.signal.aborted) {
                    setIsLoading(false);
                }
            });
        };
        const abortController = new AbortController();
        if (!APP_PACKAGED_IN_EXTENSION && !abortController.signal.aborted) {
            setIsLoading(true);
            checkExtensionInstalled(abortController);
        }
        return () => {
            abortController.abort();
        };
    }, []);
    const handleInfoSubmit = (info: InfoSubmitOptions) => {
        setLogin(info.login);
        redirect(accountCreationURLs[options.flowIndicator].confirm);
    };
    const handleConfirmSubmit = async (confirm: ConfirmSubmitOptions) => {
        const accountCreationState = confirm;
        if (!login) {
            return;
        }
        const settings: CreateAccountRequest = {
            anonymousUserId: getUserId(lee.globalState),
            login: login,
            password: accountCreationState.password,
            format: 'US',
            language: 'en',
            subscribe: accountCreationState.emailsTipsAndOffers.valueOr(false),
            deviceName: getDefaultDeviceName(translate('webapp_login_form_regsiter_fallback_browser_name')),
        };
        try {
            const createAccountResult: CreateAccountResult = await carbonConnector.createAccountStep1(settings);
            if (!createAccountResult.valid) {
                const error = new Error('accountCreationStep1.valid was not defined on confirm submit');
                lee.reportError(error);
                redirect(accountCreationURLs[options.flowIndicator].info);
            }
            if (confirm.isEu && !confirm.privacyPolicyAndToS.valueOr(false)) {
                const error = new Error('termsOfService set to false on confirm submit');
                lee.reportError(error);
                redirect(accountCreationURLs[options.flowIndicator].confirm);
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
                status: createAccountResult.encryptSettingsRequest.subscribe,
            };
            const confirmAccountCreation = {
                createAccountResult: createAccountResult,
                options: {
                    flowIndicator: options.flowIndicator,
                },
                isStandAlone: false,
                consents: [...tosConsent, emailsConsent],
            };
            const userFunnelCookie = getUserFunnelCookieWebsite();
            carbonConnector
                .createAccountStep2(confirmAccountCreation)
                .then(({ m2dToken }: ConfirmAccountCreationResult) => {
                if (flow.isWebAccount(options.flowIndicator)) {
                    DashlaneExtension.webAccountCreation.accountCreated({}, (error?: Error) => {
                        if (error) {
                            lee.reportError(error, 'Failed to connect with extension');
                        }
                    });
                }
                logUserWebAccountCreationEvent(userFunnelCookie, accountCreationState.emailsTipsAndOffers.valueOr(false));
                let redirectUrl;
                if (flow.isTeamTrial(options.flowIndicator)) {
                    redirectUrl = `${TAC_URL}#/members`;
                }
                else if (flow.isTeamMemberAccount(options.flowIndicator)) {
                    redirectUrl = isForceStartOnWeb
                        ? `*****` : `*****${m2dToken}`;
                }
                redirectToUrl(redirectUrl ??
                    `*****${m2dToken}`);
            });
        }
        catch (error) {
            lee.reportError(error, 'Account creation failed');
        }
    };
    return isLoading ? (<div className={styles.loadingContainer}>
      <Animation height={150} width={150} animationParams={{
            renderer: 'svg',
            animationData: loadingLottie,
            loop: true,
            autoplay: true,
        }}/>
    </div>) : (<>
      <CustomRoute path={basePath} exact component={Info} additionalProps={{
            onSubmit: handleInfoSubmit,
            lockedLoginValue: lockedLoginValue,
            preFilledLoginValue: login,
        }} options={options}/>
      <CustomRoute path={`${basePath}/confirm`} component={ConfirmForm} additionalProps={{
            onSubmit: handleConfirmSubmit,
            isEu: lee.carbon.currentLocation.isEu,
            dispatchGlobal: lee.dispatchGlobal,
        }} options={options}/>
    </>);
};

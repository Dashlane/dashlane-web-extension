import { Fragment, useCallback, useEffect, useState } from 'react';
import queryString from 'query-string';
import { add } from 'date-fns';
import { FlexChild, FlexContainer, Heading, jsx, Paragraph, } from '@dashlane/ui-components';
import { Button } from '@dashlane/design-system';
import { BrowseComponent, InvitationLinkClickOrigin, PageView, SignupFlowStep, UserSignupToDashlaneEvent, } from '@dashlane/hermes';
import { Lee } from 'lee';
import { logEvent, logPageView } from 'libs/logs/logEvent';
import { handleAccountCreationSubmit } from './handleFormsSubmitted';
import { InfoForm, InfoSubmitOptions } from './info-form/info-form';
import { ConfirmForm, ConfirmSubmitOptions } from './confirm/confirm-form';
import useTranslate from 'libs/i18n/useTranslate';
import { useHistory, useLocation, useRouterGlobalSettingsContext, } from 'libs/router';
import { DASHLANE_DOMAIN, EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT, } from 'app/routes/constants';
import { logUserWebAccountCreationEvent } from 'libs/logs/events/create-account/createAccount';
import { getUserFunnelCookieExtension, getUserFunnelCookieWebsite, } from 'libs/logs/getUserFunnelCookie';
import { openUrl } from 'libs/external-urls';
import { DASHLANE_DOWNLOAD_EXTENSION_URL } from 'webapp/urls';
import { TEAM_SIGN_UP_PAGE_COOKIE } from 'auth/types';
interface AccountCreationFormProps {
    lee: Lee;
    isTACFlow: boolean;
}
export enum AccountCreationStep {
    Info = 'info',
    Confirm = 'confirm',
    Creation = 'creation'
}
const stepToPageView: Record<AccountCreationStep, PageView> = {
    info: PageView.AccountCreationEmail,
    confirm: PageView.AccountCreationConfirmMasterPassword,
    creation: PageView.AccountCreationCreateMasterPassword,
};
const I18N_KEYS = {
    NO_EXTENSION_HEADER: 'webapp_auth_panel_account_creation_no_extension_header',
    NO_EXTENSION_DESCRIPTION: 'webapp_auth_panel_account_creation_no_extension_description',
    DOWNLOAD_EXTENSION_BUTTON: 'webapp_auth_panel_account_creation_no_extension_download_button',
};
export const AccountCreationForm = ({ lee, isTACFlow, }: AccountCreationFormProps) => {
    const { routes } = useRouterGlobalSettingsContext();
    const { pathname } = useLocation();
    const history = useHistory();
    const { search } = useLocation();
    const queryParams = queryString.parse(search);
    const emailQueryParam = `${queryParams.email ?? ''}`;
    const prefilledTeamKey = `${queryParams.team ?? ''}`;
    const [login, setLogin] = useState(emailQueryParam);
    const [hasBeenRedirected, setHasBeenRedirected] = useState(false);
    const [currentStep, setCurrentStep] = useState<AccountCreationStep>(AccountCreationStep.Info);
    const { translate } = useTranslate();
    const isEmployeeSignUp = pathname === EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT;
    const showInstallExtensionPage = isEmployeeSignUp && !APP_PACKAGED_IN_EXTENSION;
    const logActiveStepPageView = useCallback((step?: AccountCreationStep) => {
        if (stepToPageView[step ?? currentStep]) {
            logPageView(stepToPageView[step ?? currentStep], isTACFlow ? BrowseComponent.Tac : BrowseComponent.MainApp);
        }
    }, [currentStep, isTACFlow]);
    useEffect(() => {
        logActiveStepPageView();
    }, [logActiveStepPageView]);
    useEffect(() => {
        if (showInstallExtensionPage) {
            logPageView(PageView.JoinDashlaneTeamInstallExtension);
            logEvent(new UserSignupToDashlaneEvent({
                invitationLinkClickOrigin: prefilledTeamKey
                    ? InvitationLinkClickOrigin.SharedInvitationLink
                    : InvitationLinkClickOrigin.InvitationEmail,
                signupFlowStep: SignupFlowStep.InstallExtension,
            }));
        }
    }, [showInstallExtensionPage, prefilledTeamKey]);
    useEffect(() => {
        if (isEmployeeSignUp && !APP_PACKAGED_IN_EXTENSION) {
            const expiryDateString = add(new Date(), {
                days: 1,
            }).toUTCString();
            window.document.cookie = `${TEAM_SIGN_UP_PAGE_COOKIE}=${login},${prefilledTeamKey};domain=${DASHLANE_DOMAIN};expires=${expiryDateString}`;
        }
    }, [history, isEmployeeSignUp, login, prefilledTeamKey]);
    const handleInstallExtensionClick = () => {
        openUrl(DASHLANE_DOWNLOAD_EXTENSION_URL);
    };
    const goToStep = (step: AccountCreationStep): void => {
        setCurrentStep(step);
        logActiveStepPageView(step);
    };
    const onSubmitStep1 = (info: InfoSubmitOptions): void => {
        setLogin(info.login ?? '');
        goToStep(AccountCreationStep.Confirm);
    };
    const onSubmitStep2 = async (confirmPageOptions: ConfirmSubmitOptions): Promise<void> => {
        const userFunnelCookie = APP_PACKAGED_IN_EXTENSION
            ? await getUserFunnelCookieExtension()
            : await getUserFunnelCookieWebsite();
        goToStep(AccountCreationStep.Creation);
        await handleAccountCreationSubmit(lee, confirmPageOptions, login, isTACFlow);
        logUserWebAccountCreationEvent(userFunnelCookie, confirmPageOptions.emailsTipsAndOffers.valueOr(false));
        if (isEmployeeSignUp) {
            logEvent(new UserSignupToDashlaneEvent({
                signupFlowStep: SignupFlowStep.LoginToAccount,
                invitationLinkClickOrigin: prefilledTeamKey
                    ? InvitationLinkClickOrigin.SharedInvitationLink
                    : InvitationLinkClickOrigin.InvitationEmail,
            }));
        }
        if (isTACFlow) {
            history.push(routes.teamRoutesBasePath);
        }
    };
    return (<div>
      
      {showInstallExtensionPage ? (<FlexContainer flexDirection="column" sx={{ margin: '80px' }} gap={4}>
          <Heading size="medium">
            {translate(I18N_KEYS.NO_EXTENSION_HEADER)}
          </Heading>
          <Paragraph color="ds.text.neutral.quiet">
            {translate(I18N_KEYS.NO_EXTENSION_DESCRIPTION)}
          </Paragraph>
          <FlexChild alignSelf="end">
            <Button onClick={handleInstallExtensionClick} size="large" mood="brand" intensity="catchy" type="button">
              {translate(I18N_KEYS.DOWNLOAD_EXTENSION_BUTTON)}
            </Button>
          </FlexChild>
        </FlexContainer>) : (<>
          {currentStep === AccountCreationStep.Info && (<FlexContainer flexDirection="column" gap={4} sx={{ marginTop: '80px' }}>
              <InfoForm hasBeenRedirected={hasBeenRedirected} setHasBeenRedirected={setHasBeenRedirected} lee={lee} onSubmit={onSubmitStep1} isB2BFlow={isTACFlow || isEmployeeSignUp}/>
            </FlexContainer>)}
          {(currentStep === AccountCreationStep.Confirm ||
                currentStep === AccountCreationStep.Creation) && (<FlexContainer flexDirection="column" gap={4}>
              <ConfirmForm login={login} isEu={lee.carbon.currentLocation.isEu} backStep={goToStep} onSubmit={onSubmitStep2} isTACFlow={isTACFlow} isEmployeeSignUp={isEmployeeSignUp}/>
            </FlexContainer>)}
        </>)}
    </div>);
};

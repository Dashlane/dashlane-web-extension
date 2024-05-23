import { Fragment, useState } from 'react';
import { Button, Infobox, jsx } from '@dashlane/design-system';
import { Button as ButtonType, ClickOrigin, SsoSetupStep, UserClickEvent, } from '@dashlane/hermes';
import { confidentialSSOApi, InferredSsoState, } from '@dashlane/sso-scim-contracts';
import { DataStatus, useModuleCommands, useModuleQuery, } from '@dashlane/framework-react';
import { Link as RouteLink, useRouterGlobalSettingsContext } from 'libs/router';
import useTranslate from 'libs/i18n/useTranslate';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import { carbonConnector } from 'libs/carbon/connector';
import { logEvent } from 'libs/logs/logEvent';
import { openUrl } from 'libs/external-urls';
import { isAccountTeamTrialBusiness } from 'libs/account/helpers';
import { BUSINESS_BUY } from 'team/urls';
import { logSelfHostedSSOSetupStep } from 'team/settings/sso-setup-logs';
import { CreateMarkup } from 'team/settings/nitro-sso/react-markdown-wrapper';
import { useTeamSpaceContext } from '../components/TeamSpaceContext';
import { ClearSettingsConfirmationDialog } from './clear-settings-confirmation-dialog';
const NITRO_LIMITATIONS_VALUES = {
    INFOBOX_TITLE: "Switching between SSO options isn't available right now",
    INFOBOX_DESCRIPTION: "We're in the process of adding new capabilities to Confidential SSO. During this period, you can't switch between the two options. Before turning on your chosen SSO option, please make sure it meets your organization's needs.",
};
const PLAN_UPSELL_I18N_KEYS = {
    SSO_PLAN_MISSING_HEADER: 'team_settings_es_sso_plan_error_header',
    SSO_PLAN_MISSING_BODY: 'team_settings_es_sso_plan_missing_body',
    UPGRADE_BUTTON: 'team_settings_es_sso_plan_missing_button',
    BUY_DASHLANE_BUTTON: 'team_account_teamplan_plan_buy_dashlane',
};
const CLEAR_NITRO_SETUP_VALUES = {
    INFOBOX_TITLE: 'To use self-hosted SSO, clear Confidential SSO setup',
    INFOBOX_DESCRIPTION: 'If you want to use self-hosted SSO, which supports SCIM provisioning, select **Clear setup** to erase your progress in Dashlane. Make sure to also delete your progress in your IdP.',
    INFOBOX_CTA: 'Clear setup',
};
const CLEAR_SELF_HOSTED_SETUP_VALUES = {
    INFOBOX_TITLE: 'To use Confidential SSO, clear self-hosted SSO setup',
    INFOBOX_DESCRIPTION: 'If you want to use Confidential SSO, select **Clear setup** to erase your progress in Dashlane. Make sure to also delete your progress in your IdP.',
    INFOBOX_CTA: 'Clear setup',
};
const CONFIRM_CLEAR_SETUP_VALUES = {
    DIALOG_TITLE: 'Are you sure?',
    DIALOG_BODY: 'This action can’t be undone.',
};
export enum PageContext {
    ChooseSso = 'ChooseSso',
    SelfHosted = 'SelfHosted',
    Nitro = 'Nitro'
}
interface SsoInfoboxProps {
    pageContext: PageContext;
    onSetupClear?: () => Promise<void>;
}
export const SsoInfobox = ({ pageContext, onSetupClear }: SsoInfoboxProps) => {
    const { routes } = useRouterGlobalSettingsContext();
    const accountInfo = useAccountInfo();
    const { translate } = useTranslate();
    const [showClearSettingsConfirmation, setShowClearSettingsConfirmation] = useState(false);
    const { teamId } = useTeamSpaceContext();
    const { clearSettings, initSsoProvisioning } = useModuleCommands(confidentialSSOApi);
    const { status: ssoStateStatus, data: ssoState } = useModuleQuery(confidentialSSOApi, 'ssoProvisioning');
    if (ssoStateStatus !== DataStatus.Success || ssoState.enableSSO.ssoEnabled) {
        return null;
    }
    const { global: { inferredSsoState, ssoCapable }, } = ssoState;
    const handleClickOnBuyDashlane = () => {
        logEvent(new UserClickEvent({
            button: ButtonType.BuyDashlane,
            clickOrigin: ClickOrigin.SsoPaywallBanner,
        }));
        openUrl(`${BUSINESS_BUY}?plan=business&subCode=${accountInfo?.subscriptionCode}`);
    };
    if (ssoCapable === false) {
        return (<Infobox mood="neutral" size="large" title={translate(PLAN_UPSELL_I18N_KEYS.SSO_PLAN_MISSING_HEADER)} description={translate(PLAN_UPSELL_I18N_KEYS.SSO_PLAN_MISSING_BODY)} actions={accountInfo?.premiumStatus
                ? [
                    isAccountTeamTrialBusiness(accountInfo.premiumStatus) ? (<Button key="buy" onClick={handleClickOnBuyDashlane} role="link">
                    {translate(PLAN_UPSELL_I18N_KEYS.BUY_DASHLANE_BUTTON)}
                  </Button>) : (<RouteLink key="upgrade" to={`${routes.teamAccountChangePlanRoutePath}?plan=business`}>
                    <Button>
                      {translate(PLAN_UPSELL_I18N_KEYS.UPGRADE_BUTTON)}
                    </Button>
                  </RouteLink>),
                ]
                : []}/>);
    }
    const partialSetupStates: InferredSsoState[] = [
        InferredSsoState.enum.NitroIncomplete,
        InferredSsoState.enum.SelfHostedIncomplete,
    ];
    if (pageContext !== PageContext.ChooseSso &&
        partialSetupStates.includes(inferredSsoState)) {
        let infoboxProps: {
            title: string;
            description: string;
            cta: string;
        } | null = null;
        let clearCallback: () => Promise<void> = async () => {
            await onSetupClear?.();
            logSelfHostedSSOSetupStep({
                ssoSetupStep: SsoSetupStep.ClearSsoSettings,
            });
        };
        if (pageContext === PageContext.SelfHosted &&
            inferredSsoState === InferredSsoState.enum.NitroIncomplete) {
            infoboxProps = {
                title: CLEAR_NITRO_SETUP_VALUES.INFOBOX_TITLE,
                description: CLEAR_NITRO_SETUP_VALUES.INFOBOX_DESCRIPTION,
                cta: CLEAR_NITRO_SETUP_VALUES.INFOBOX_CTA,
            };
            clearCallback = async () => {
                await clearSettings();
                await initSsoProvisioning({ teamId: `${teamId}` });
                await onSetupClear?.();
            };
        }
        else if (pageContext === PageContext.Nitro &&
            inferredSsoState === InferredSsoState.enum.SelfHostedIncomplete) {
            infoboxProps = {
                title: CLEAR_SELF_HOSTED_SETUP_VALUES.INFOBOX_TITLE,
                description: CLEAR_SELF_HOSTED_SETUP_VALUES.INFOBOX_DESCRIPTION,
                cta: CLEAR_SELF_HOSTED_SETUP_VALUES.INFOBOX_CTA,
            };
            clearCallback = async () => {
                await carbonConnector.clearSelfHostedESSettings();
                await initSsoProvisioning({ teamId: `${teamId}` });
                await onSetupClear?.();
            };
        }
        const completeSetupSteps: InferredSsoState[] = [
            InferredSsoState.enum.NitroComplete,
            InferredSsoState.enum.SelfHostedComplete,
        ];
        if (infoboxProps && !completeSetupSteps.includes(inferredSsoState)) {
            return (<>
          {showClearSettingsConfirmation ? (<ClearSettingsConfirmationDialog onClose={() => setShowClearSettingsConfirmation(false)} onConfirm={clearCallback} titleText={CONFIRM_CLEAR_SETUP_VALUES.DIALOG_TITLE} bodyText={CONFIRM_CLEAR_SETUP_VALUES.DIALOG_BODY}/>) : null}
          <Infobox mood="neutral" size="large" title={infoboxProps.title} description={<CreateMarkup markdownValue={infoboxProps.description}/>} actions={[
                    <Button key="clear" onClick={() => setShowClearSettingsConfirmation(true)}>
                {infoboxProps.cta}
              </Button>,
                ]}/>
        </>);
        }
    }
    return (<Infobox mood="warning" size="large" title={NITRO_LIMITATIONS_VALUES.INFOBOX_TITLE} description={NITRO_LIMITATIONS_VALUES.INFOBOX_DESCRIPTION}/>);
};

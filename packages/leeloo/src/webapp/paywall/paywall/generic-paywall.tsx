import { CloseIcon, colors, FlexContainer, Heading, OpenWebsiteIcon, Paragraph, } from '@dashlane/ui-components';
import { Button, jsx } from '@dashlane/design-system';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { logEvent, logPageView } from 'libs/logs/logEvent';
import { OutsideClickHandler } from 'libs/outside-click-handler/outside-click-handler';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { openDashlaneUrl } from 'libs/external-urls';
import useTranslate from 'libs/i18n/useTranslate';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import zIndexVars from 'libs/dashlane-style/globals/z-index-variables.css';
import colorVars from 'libs/dashlane-style/globals/color-variables.css';
import { getPlanRenewalPeriodicity } from 'libs/premium-status.lib';
import { goToCheckoutPage } from 'webapp/notifications-hub/helpers';
import { cancelPaywallLog, panelToPageView, PAYWALL_ACTION, PAYWALL_SUBTYPE, PAYWALL_TYPE, seeAllPlansLog, upGradeToPremiumLog, } from 'webapp/paywall/logs';
import { useTranslateWithMarkup } from 'libs/i18n/useTranslateWithMarkup';
import { TranslationOptions } from 'libs/i18n/types';
import { useEffect } from 'react';
interface PaywallFeature {
    icon: React.ReactNode;
    key: string;
    title: TranslationOptions | string;
    description: TranslationOptions | string;
}
export enum PaywallTarget {
    Essentials = 'essentials',
    Premium = 'premium'
}
export interface PaywallProps {
    paywallType: PAYWALL_SUBTYPE;
    mode: 'fullscreen' | 'popup';
    title: TranslationOptions | string;
    description: TranslationOptions | string;
    paywallFeatures: PaywallFeature[];
    target?: PaywallTarget;
    closePaywall?: () => void;
    withDefaultFooter?: boolean;
    customFooter?: React.ReactNode;
    lightBackground?: boolean;
    headingBadge?: React.ReactNode;
}
const I18N_KEYS = {
    GO_TO_PLANS: 'webapp_paywall_go_to_plans',
    UPGRADE_PREMIUM: 'webapp_paywall_upgrade_premium',
    UPGRADE_ESSENTIALS: 'webapp_paywall_upgrade_essentials',
    CLOSE_TITLE: 'webapp_paywall_close',
};
export const GenericPaywall: React.FC<PaywallProps> = (props) => {
    const { target, title, mode, description, paywallFeatures, closePaywall, paywallType, lightBackground, withDefaultFooter, headingBadge, customFooter, } = props;
    const { routes } = useRouterGlobalSettingsContext();
    const { translateWithMarkup } = useTranslateWithMarkup();
    const { translate } = useTranslate();
    const accountInfo = useAccountInfo();
    const premiumStatus = usePremiumStatus();
    useEffect(() => {
        if (premiumStatus.status === DataStatus.Success && premiumStatus.data) {
            logPageView(panelToPageView[paywallType]);
        }
    }, [paywallType, premiumStatus]);
    if (premiumStatus.status !== DataStatus.Success) {
        return null;
    }
    const close = () => {
        if (mode === 'popup' && closePaywall) {
            logEvent(cancelPaywallLog);
            closePaywall();
        }
    };
    const goToCheckout = () => {
        const subscriptionCode = accountInfo?.subscriptionCode ?? '';
        const pricing = getPlanRenewalPeriodicity(accountInfo?.premiumStatus?.autoRenewInfo);
        const isEssentials = target === PaywallTarget.Essentials;
        const actionUsed = isEssentials
            ? PAYWALL_ACTION.GO_ESSENTIALS
            : PAYWALL_ACTION.GO_PREMIUM;
        const tracking = {
            type: PAYWALL_TYPE.PREMIUM_PROMPT,
            subtype: paywallType,
            action: actionUsed,
        };
        goToCheckoutPage('', subscriptionCode, tracking, isEssentials, pricing);
        logEvent(upGradeToPremiumLog);
    };
    const goToPlans = () => {
        const tracking = {
            type: PAYWALL_TYPE.PREMIUM_PROMPT,
            subtype: paywallType,
            action: PAYWALL_ACTION.GO_PLANS,
        };
        openDashlaneUrl(routes.userGoPlans, tracking);
        logEvent(seeAllPlansLog);
    };
    const goToCheckoutText = target === PaywallTarget.Essentials
        ? I18N_KEYS.UPGRADE_ESSENTIALS
        : I18N_KEYS.UPGRADE_PREMIUM;
    return (<FlexContainer sx={{
            position: 'absolute',
            zIndex: zIndexVars['--z-index-above-panel'],
            top: '0px',
            overflow: 'auto',
            width: '100%',
            height: '100%',
            backgroundColor: lightBackground
                ? 'ds.container.agnostic.neutral.standard'
                : colorVars['--transparent-dash-green-00-background-color'],
        }} justifyContent="center" alignItems="center">
      <OutsideClickHandler onOutsideClick={close}>
        <FlexContainer sx={{
            position: 'relative',
            width: ['auto', 'auto', '784px'],
            background: colors.white,
            borderRadius: '4px',
            padding: ['32px', '32px', '88px 88px 46px 88px'],
        }} justifyContent="center" flexDirection="column">
          {mode === 'popup' ? (<button sx={{
                position: 'absolute',
                cursor: 'pointer',
                background: 'transparent',
                top: '21px',
                right: '21px',
            }} type="button" aria-label={translate(I18N_KEYS.CLOSE_TITLE)} title={translate(I18N_KEYS.CLOSE_TITLE)} onClick={close}>
              <CloseIcon color={colors.dashGreen03}/>
            </button>) : null}

          <div sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flexStart',
            gap: '8px',
        }}>
            {headingBadge}
            <Heading>{translateWithMarkup(title)}</Heading>
            <Paragraph color={colors.dashGreen02}>
              {translateWithMarkup(description)}
            </Paragraph>
          </div>

          <ul sx={{ mt: '32px', mb: '32px' }}>
            {paywallFeatures.map((paywallFeature) => (<li sx={{
                mt: '16px',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                svg: { flexShrink: 0 },
            }} key={paywallFeature.key}>
                {paywallFeature.icon}
                <div sx={{ ml: '16px', lineHeight: '18px' }}>
                  <Paragraph bold={true} color={colors.dashGreen00}>
                    {translateWithMarkup(paywallFeature.title)}
                  </Paragraph>

                  <div sx={{ mt: '4px' }}>
                    <Paragraph color={colors.dashGreen02}>
                      {translateWithMarkup(paywallFeature.description)}
                    </Paragraph>
                  </div>
                </div>
              </li>))}
          </ul>
          {withDefaultFooter ? (<FlexContainer justifyContent="flex-end" sx={{
                mt: '36px',
                mr: ['0px', '0px', '-44px'],
                button: { ml: '8px' },
            }}>
              <Button onClick={goToPlans} mood="neutral" intensity="quiet">
                {translate(I18N_KEYS.GO_TO_PLANS)}
                <OpenWebsiteIcon />
              </Button>
              <Button onClick={goToCheckout}>
                {translate(goToCheckoutText)}
              </Button>
            </FlexContainer>) : (customFooter)}
        </FlexContainer>
      </OutsideClickHandler>
    </FlexContainer>);
};

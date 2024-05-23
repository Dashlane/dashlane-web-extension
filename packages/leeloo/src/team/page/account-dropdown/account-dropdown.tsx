import { Fragment, useContext, useState } from 'react';
import classnames from 'classnames';
import { Button as ButtonType, ClickOrigin, UserClickEvent, } from '@dashlane/hermes';
import { Button as UiCButton } from '@dashlane/ui-components';
import { Button, jsx } from '@dashlane/design-system';
import { Lee } from 'lee';
import { isAccountTeamTrialBusiness, isStarterTier, isTeamTier, } from 'libs/account/helpers';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import { Dropdown, DropdownAlignment, DropdownPosition, } from 'libs/dashlane-style/dropdown';
import { openUrl } from 'libs/external-urls';
import { useLogout } from 'libs/hooks/useLogout';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent } from 'libs/logs/logEvent';
import { redirect, useRouterGlobalSettingsContext } from 'libs/router';
import { useLogPageViewContext } from 'libs/logs/log-page-view-context';
import { Feedback } from 'team/page/feedback';
import { ContactSupportDialog } from 'team/page/support/contact-support-dialog';
import { ShowVaultNavModalContext } from 'team/show-vault-nav-modal/show-vault-nav-modal-provider';
import { BUSINESS_BUY, BUSINESS_SUPPORT, SERVICE_STATUS } from 'team/urls';
import { TrialBadge } from './trial-badge';
import styles from './styles.css';
export interface Props {
    lee: Lee;
}
const I18N_KEYS = {
    ACCOUNT: 'team_account',
    BUY_DASHLANE: 'team_buy_dashlane',
    CONTACT_SUPPORT: 'team_contact_support_menu_item',
    FEEDBACK: 'team_feedback',
    LOGOUT: 'team_logout',
    PLAN: 'team_plan',
    SERVICE_STATUS: 'team_service_status',
    SUPPORT: 'team_support',
    WEBAPP: 'team_webapp',
    UPGRADE: 'team_upgrade',
};
export const TeamAccountDropdown = ({ lee }: Props) => {
    const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
    const [feedbackDialogIsOpen, setFeedbackDialogIsOpen] = useState(false);
    const [supportDialogIsOpen, setSupportDialogIsOpen] = useState(false);
    const accountInfo = useAccountInfo();
    const { translate } = useTranslate();
    const logout = useLogout(lee.dispatchGlobal);
    const currentPageView = useLogPageViewContext();
    const { setIsVaultNavigationModalOpen } = useContext(ShowVaultNavModalContext);
    const { routes } = useRouterGlobalSettingsContext();
    const onLogoutClick = () => {
        logout();
    };
    const onOpenWebappClick = () => {
        if (APP_PACKAGED_IN_EXTENSION) {
            redirect('/');
        }
        else {
            setIsVaultNavigationModalOpen(true);
        }
    };
    const getClickWithUserLog = (userActionName: string, usageViewName: string, onClick: (event: React.MouseEvent<HTMLElement>) => void) => (event: React.MouseEvent<HTMLElement>) => {
        onClick(event);
    };
    const DropdownButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, ...props }) => (<UiCButton type="button" nature="ghost" className={classnames(styles.dropdownElement, className)} {...props}/>);
    const renderButton = (toggle: () => void) => (<Button mood="neutral" intensity="quiet" layout="iconTrailing" icon={dropdownIsOpen ? 'CaretUpOutlined' : 'CaretDownOutlined'} onClick={toggle}>
      {translate(I18N_KEYS.ACCOUNT)}
    </Button>);
    const feedbackDialog = feedbackDialogIsOpen ? (<Feedback lee={lee} onDismiss={() => setFeedbackDialogIsOpen(false)} onSend={() => setFeedbackDialogIsOpen(false)}/>) : null;
    const supportDialog = supportDialogIsOpen ? (<ContactSupportDialog onDismiss={() => setSupportDialogIsOpen(false)}/>) : null;
    const isStarterOrTeamPlan = accountInfo?.premiumStatus &&
        !isAccountTeamTrialBusiness(accountInfo?.premiumStatus) &&
        (isTeamTier(accountInfo?.premiumStatus) ||
            isStarterTier(accountInfo?.premiumStatus));
    const planParam = accountInfo?.premiumStatus && isTeamTier(accountInfo?.premiumStatus)
        ? 'team'
        : 'business';
    const isTeamBusinessTrial = accountInfo?.premiumStatus &&
        isAccountTeamTrialBusiness(accountInfo?.premiumStatus);
    const hasBillingAccess = lee.permission.adminAccess.hasBillingAccess;
    const utmParam = `button:buy_dashlane+click_origin:account_dropdown+origin_page:${currentPageView || undefined}+origin_component:main_app`;
    const buyDashlaneLink = `${BUSINESS_BUY}?plan=${planParam}&subCode=${accountInfo?.subscriptionCode}&utm_source=${utmParam}`;
    const handleClickOnBuyDashlane = () => {
        logEvent(new UserClickEvent({
            button: ButtonType.BuyDashlane,
            clickOrigin: ClickOrigin.AccountDropdown,
        }));
        openUrl(buyDashlaneLink);
    };
    return (<>
      <div className={styles.teamAccountDropdown}>
        <Dropdown alignment={DropdownAlignment.End} position={DropdownPosition.Bottom} onToggle={() => {
            setDropdownIsOpen(!dropdownIsOpen);
        }} withBackdrop={false} renderRoot={(toggle) => renderButton(toggle)}>
          <div className={styles.dropdownMenu}>
            {hasBillingAccess ? (<DropdownButton onClick={getClickWithUserLog('plan', 'accountSummary', () => {
                redirect(routes.teamAccountRoutePath);
            })}>
                {translate(I18N_KEYS.PLAN)}
              </DropdownButton>) : null}

            <DropdownButton onClick={getClickWithUserLog('webapp', 'gotoWebApp', () => onOpenWebappClick())}>
              {translate(I18N_KEYS.WEBAPP)}
            </DropdownButton>

            {isTeamBusinessTrial && hasBillingAccess ? (<DropdownButton onClick={getClickWithUserLog('buy', 'buyDashlane', () => handleClickOnBuyDashlane())}>
                <div>
                  {translate(I18N_KEYS.BUY_DASHLANE)}
                  <TrialBadge />
                </div>
              </DropdownButton>) : null}

            {isStarterOrTeamPlan && hasBillingAccess ? (<DropdownButton onClick={getClickWithUserLog('upgrade', 'upgradePlan', () => redirect(`${routes.teamAccountChangePlanRoutePath}`))}>
                {translate(I18N_KEYS.UPGRADE)}
              </DropdownButton>) : null}

            <DropdownButton onClick={getClickWithUserLog('status', 'serviceStatus', () => openUrl(SERVICE_STATUS))}>
              {translate(I18N_KEYS.SERVICE_STATUS)}
            </DropdownButton>

            <DropdownButton onClick={getClickWithUserLog('support', 'visitHelpCenter', () => openUrl(BUSINESS_SUPPORT))}>
              {translate(I18N_KEYS.SUPPORT)}
            </DropdownButton>

            {hasBillingAccess ? (<DropdownButton onClick={() => setSupportDialogIsOpen(true)}>
                {translate(I18N_KEYS.CONTACT_SUPPORT)}
              </DropdownButton>) : null}

            <DropdownButton onClick={getClickWithUserLog('feedback', 'sendFeedback', () => setFeedbackDialogIsOpen(true))}>
              {translate(I18N_KEYS.FEEDBACK)}
            </DropdownButton>

            <hr />

            <DropdownButton onClick={getClickWithUserLog('logout', 'logout', onLogoutClick)} className={styles.logout}>
              {translate(I18N_KEYS.LOGOUT)}
            </DropdownButton>
          </div>
        </Dropdown>
      </div>

      {feedbackDialog}
      {supportDialog}
    </>);
};

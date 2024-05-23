import { Fragment, useState } from 'react';
import { AuthenticationFlowContracts } from '@dashlane/authentication-contracts';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { PremiumStatus, SpaceTiers } from '@dashlane/communication';
import { Icon, jsx } from '@dashlane/design-system';
import { useModuleCommands } from '@dashlane/framework-react';
import { UserLockAppEvent } from '@dashlane/hermes';
import { Button, colors, DiamondBlueIcon, DiamondDullIcon, DropdownElement, DropdownMenu, Eyebrow, FlexChild, FlexContainer, MagicWandIcon, Paragraph, } from '@dashlane/ui-components';
import { getActiveSpace, getPlanNameFromTier, isAccountBusiness, isAccountFamily, isAdvancedPlan, isEssentialsPlan, isFreeTrial, isPaidAccount, isPremiumPlan, isPremiumPlusPlan, } from 'libs/account/helpers';
import { useHasFeatureEnabled } from 'libs/carbon/hooks/useHasFeature';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import { goToConsole } from 'libs/console';
import { AvatarWithAbbreviatedText } from 'libs/dashlane-style/avatar/avatar-with-abbreviated-text';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent } from 'libs/logs/logEvent';
import { redirect } from 'libs/router';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { useOpenTeamConsole } from 'libs/hooks/use-open-team-console';
import { AccountButtonWithTooltip } from 'webapp/components/header/account-button-with-tooltip';
import { useUserLogin } from 'webapp/account/hooks/use-user-login';
import { logLogoutEvent } from 'webapp/account/logs';
import { useWebAuthnAuthenticationOptedIn } from 'webapp/webauthn';
import { DASHLANE_LABS_FEATURE_FLIP_NAME } from 'webapp/dashlane-labs/constants';
import { OpenAdminConsoleDialog } from 'webapp/open-admin-console-dialog/open-admin-console-dialog';
import { useAccountSettingsPanelContext } from 'webapp/account/account-settings-panel-context';
import { useWebappLogoutDialogContext } from 'webapp/webapp-logout-dialog-context';
interface HeaderAccountMenuProps {
    color?: string;
}
const I18N_KEYS = {
    ACCOUNT_LABEL: 'webapp_account_root_header',
    EMAIL_LABEL: 'manage_subscription_account_menu_email',
    LINKS: {
        ADMIN_CONSOLE: 'manage_subscription_account_menu_admin_console',
        LOCK: 'webapp_account_root_item_lock',
        LOGOUT: 'manage_subscription_account_menu_logout',
        SETTINGS: 'manage_subscription_account_menu_settings',
        SUBSCRIPTION: 'manage_subscription_page_title',
    },
    PLAN_NAME: {
        BUSINESS: 'manage_subscription_plan_name_business',
        TEAM: 'manage_subscription_plan_name_team',
        ADVANCED: 'manage_subscription_plan_name_advanced',
        ESSENTIALS: 'manage_subscription_plan_name_essentials',
        FAMILY: 'manage_subscription_plan_name_family',
        FREE: 'manage_subscription_plan_name_free',
        PREMIUM: 'manage_subscription_plan_name_premium',
        PREMIUM_PLUS: 'manage_subscription_plan_name_premium_plus',
        PREMIUM_TRIAL: 'manage_subscription_plan_name_premium_trial',
    },
};
const accountButtonSx = {
    margin: '0 12px 0 0',
    ':hover:enabled:not(:active), :focus:enabled:not(:active)': {
        background: 'transparent',
        border: `2px solid ds.oddity.focus`,
    },
};
const getPlanNameKey = (premiumStatus: PremiumStatus) => {
    if (isAccountBusiness(premiumStatus)) {
        const activeSpace = getActiveSpace(premiumStatus);
        if (activeSpace &&
            getPlanNameFromTier(activeSpace.tier) === SpaceTiers.Team) {
            return I18N_KEYS.PLAN_NAME.TEAM;
        }
        else {
            return I18N_KEYS.PLAN_NAME.BUSINESS;
        }
    }
    else if (isAccountFamily(premiumStatus)) {
        return I18N_KEYS.PLAN_NAME.FAMILY;
    }
    else if (isAdvancedPlan(premiumStatus)) {
        return I18N_KEYS.PLAN_NAME.ADVANCED;
    }
    else if (isEssentialsPlan(premiumStatus)) {
        return I18N_KEYS.PLAN_NAME.ESSENTIALS;
    }
    else if (isFreeTrial(premiumStatus)) {
        return I18N_KEYS.PLAN_NAME.PREMIUM_TRIAL;
    }
    else if (isPremiumPlusPlan(premiumStatus)) {
        return I18N_KEYS.PLAN_NAME.PREMIUM_PLUS;
    }
    else if (isPremiumPlan(premiumStatus)) {
        return I18N_KEYS.PLAN_NAME.PREMIUM;
    }
    return I18N_KEYS.PLAN_NAME.FREE;
};
export const HeaderAccountMenu = ({ color = 'ds.text.neutral.standard', }: HeaderAccountMenuProps) => {
    const premiumStatus = usePremiumStatus();
    const { routes, store } = useRouterGlobalSettingsContext();
    const { translate } = useTranslate();
    const hasDashlaneLabs = useHasFeatureEnabled(DASHLANE_LABS_FEATURE_FLIP_NAME);
    const isWebAuthnAvailable = useWebAuthnAuthenticationOptedIn();
    const { openAccountPanel } = useAccountSettingsPanelContext();
    const { lockSession } = useModuleCommands(AuthenticationFlowContracts.authenticationFlowApi);
    const userLogin = useUserLogin() ?? '';
    const { openTeamConsole } = useOpenTeamConsole();
    const { openLogoutDialog } = useWebappLogoutDialogContext();
    const [adminConsoleDialogIsOpen, setAdminConsoleDialogIsOpen] = useState(false);
    const [displayRecoveryActivationNotification, setDisplayRecoveryActivationNotification,] = useState(false);
    if (premiumStatus.status !== DataStatus.Success || !premiumStatus.data) {
        return null;
    }
    const isAccountPaid = isPaidAccount(premiumStatus.data);
    const isAccountB2B = isAccountBusiness(premiumStatus.data);
    const isBusinessAdmin = store.getState().user?.session?.permissions.tacAccessPermissions.size > 0 ??
        false;
    const isInFreeTrial = isFreeTrial(premiumStatus.data);
    const isAccountPaidOrTrail = isAccountPaid || isInFreeTrial;
    const isBlueDiamondVisible = isAccountPaidOrTrail && !isAccountB2B;
    const isDullDiamondVisible = !isAccountPaidOrTrail && !isAccountB2B;
    let planName;
    const activeSpace = getActiveSpace(premiumStatus.data);
    if (activeSpace && premiumStatus.data.planName === '2022_team_starter_tier') {
        planName = 'Starter';
    }
    else {
        planName = translate(getPlanNameKey(premiumStatus.data));
    }
    const goToOpenAdminConsoleDialog = () => {
        if (!(APP_PACKAGED_IN_DESKTOP || APP_PACKAGED_IN_EXTENSION)) {
            setAdminConsoleDialogIsOpen(true);
        }
        else {
            goToConsole(userLogin, premiumStatus.data, openTeamConsole);
        }
    };
    const goToSubscriptionPage = () => {
        if (isBusinessAdmin) {
            redirect(routes.teamAccountRoutePath);
        }
        else {
            redirect(routes.userSubscriptionManagement);
        }
    };
    const goToDashlaneLabsPage = () => {
        redirect(routes.dashlaneLabs);
    };
    const handleLogout = () => {
        logLogoutEvent();
        openLogoutDialog();
    };
    const handleLock = () => {
        logEvent(new UserLockAppEvent({}));
        void lockSession();
    };
    const styles = {
        dropdownElement: {
            backgroundColor: 'ds.container.expressive.neutral.supershy.idle',
            ':focus': {
                border: '1px solid ds.oddity.focus',
            },
            color: 'ds.text.neutral.standard',
            fontSize: '14px',
            ':hover': {
                border: 'none',
                backgroundColor: 'ds.container.expressive.neutral.supershy.hover',
            },
            ':active': {
                backgroundColor: 'ds.container.expressive.neutral.supershy.active',
            },
        },
    };
    return displayRecoveryActivationNotification ? (<AccountButtonWithTooltip accountButtonSx={accountButtonSx} color={color} hideRecoveryNotifcation={() => setDisplayRecoveryActivationNotification(false)}/>) : (<>
      <DropdownMenu placement="bottom-end" sx={{ width: 240, zIndex: 99 }} content={[
            <FlexContainer key="accountItem" flexDirection="column" sx={{ padding: '16px' }} onClick={() => {
                }}>
            <AvatarWithAbbreviatedText avatarSize={36} email={userLogin} placeholderFontSize={18} placeholderTextType="firstTwoCharacters"/>
            <Eyebrow as="header" size="small" color={colors.grey00} sx={{ margin: '12px 0 4px' }}>
              {translate(I18N_KEYS.EMAIL_LABEL)}
            </Eyebrow>
            <Paragraph sx={{
                    fontSize: '14px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                }}>
              {userLogin}
            </Paragraph>
          </FlexContainer>,
            <DropdownElement data-testid="subscriptionItem" fullWidth key="subscriptionItem" onClick={goToSubscriptionPage} sx={styles.dropdownElement}>
            <FlexContainer alignItems="center">
              <FlexChild sx={{ margin: '0 8px 0 0' }}>
                {translate(I18N_KEYS.LINKS.SUBSCRIPTION)}
              </FlexChild>
              <Eyebrow size="small" sx={{
                    alignItems: 'center',
                    background: colors.grey06,
                    borderRadius: '2px',
                    color: isAccountPaidOrTrail
                        ? colors.dashGreen01
                        : colors.grey01,
                    display: 'inline-flex',
                    padding: '2px 4px',
                }}>
                {isBlueDiamondVisible ? (<DiamondBlueIcon size={12} sx={{ margin: '0 2px 0 0' }}/>) : null}
                {isDullDiamondVisible ? (<DiamondDullIcon size={12} sx={{ margin: '0 2px 0 0' }}/>) : null}
                {planName}
              </Eyebrow>
            </FlexContainer>
          </DropdownElement>,
            isBusinessAdmin ? (<DropdownElement key="adminItem" fullWidth onClick={goToOpenAdminConsoleDialog} sx={{
                    alignItems: 'flex-start',
                    ...styles.dropdownElement,
                }}>
              <FlexContainer sx={{ alignItems: 'center', lineHeight: '1.25rem' }}>
                <p style={{ marginRight: '50px' }}>
                  {translate(I18N_KEYS.LINKS.ADMIN_CONSOLE)}
                </p>
                <Icon name="ArrowRightOutlined" size="small" color="ds.text.neutral.standard"/>
              </FlexContainer>
            </DropdownElement>) : null,
            <DropdownElement data-testid="settingsItem" fullWidth key="settingsItem" onClick={openAccountPanel} sx={styles.dropdownElement}>
            {translate(I18N_KEYS.LINKS.SETTINGS)}
          </DropdownElement>,
            hasDashlaneLabs ? (<DropdownElement data-testid="dashlane-labs-item" fullWidth key="dashlane-labs-item" onClick={goToDashlaneLabsPage} sx={styles.dropdownElement}>
              <FlexContainer alignItems={'center'} gap="8px">
                <FlexChild>Dashlane Labs</FlexChild>
                <FlexChild>
                  <MagicWandIcon />
                </FlexChild>
              </FlexContainer>
            </DropdownElement>) : null,
            <hr key="horizontal-divider" sx={{
                    border: 'none',
                    borderTopWidth: '1px',
                    borderTopStyle: 'solid',
                    borderTopColor: 'ds.border.neutral.quiet.idle',
                    margin: '8px 16px',
                }}/>,
            APP_PACKAGED_IN_EXTENSION && isWebAuthnAvailable ? (<DropdownElement fullWidth key="lockItem" data-testid="lockItem" onClick={handleLock} sx={styles.dropdownElement}>
              <FlexContainer sx={{ alignItems: 'center', lineHeight: '1.25rem' }}>
                <Icon name="LockOutlined" size="small" color="ds.text.neutral.standard"/>
                <p style={{ marginLeft: '8px' }}>
                  {translate(I18N_KEYS.LINKS.LOCK)}
                </p>
              </FlexContainer>
            </DropdownElement>) : null,
            <DropdownElement fullWidth key="logoutItem" data-testid="logoutItem" onClick={handleLogout} sx={styles.dropdownElement}>
            <FlexContainer sx={{ alignItems: 'center', lineHeight: '1.25rem' }}>
              <Icon name="LogOutOutlined" size="small" color="ds.text.neutral.standard"/>
              <p style={{ marginLeft: '8px' }}>
                {translate(I18N_KEYS.LINKS.LOGOUT)}
              </p>
            </FlexContainer>
          </DropdownElement>,
        ]}>
        <Button sx={{ ...accountButtonSx, color: color }} type="button" nature="ghost">
          <FlexContainer sx={{ mr: '4px' }}>
            {translate(I18N_KEYS.ACCOUNT_LABEL)}
          </FlexContainer>
          <Icon name="CaretDownOutlined" color={color}/>
        </Button>
      </DropdownMenu>
      {adminConsoleDialogIsOpen ? (<OpenAdminConsoleDialog showAdminConsoleModal={adminConsoleDialogIsOpen} setShowAdminConsoleModal={setAdminConsoleDialogIsOpen}/>) : null}
    </>);
};

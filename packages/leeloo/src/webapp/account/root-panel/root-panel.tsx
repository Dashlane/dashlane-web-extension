import { Fragment, useEffect, useState } from 'react';
import { HelpCenterArticleCta, PageView, UserOpenHelpCenterEvent, } from '@dashlane/hermes';
import { Button, Dialog, jsx, Paragraph } from '@dashlane/design-system';
import { ArrowDownIcon, colors, FlexContainer, OpenWebsiteIcon, } from '@dashlane/ui-components';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { PremiumStatus, PremiumStatusCode } from '@dashlane/communication';
import { TAC_URL } from 'app/routes/constants';
import { ActivePanel } from 'webapp/account/types';
import { DebugDataDialog } from 'webapp/debug-data-dialog';
import { isAccountFamilyAdmin } from 'libs/account/helpers';
import { onLinkClickOpenDashlaneUrl } from 'libs/external-urls';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent, logPageView } from 'libs/logs/logEvent';
import { useIsPersonalSpaceDisabled } from 'libs/hooks/use-is-personal-space-disabled';
import { Link, useRouterGlobalSettingsContext } from 'libs/router';
import { useNodePremiumStatus } from 'libs/carbon/hooks/useNodePremiumStatus';
import { useIsMPlessUser } from '../security-settings/hooks/use-is-mpless-user';
import { logLogoutEvent } from '../logs';
import SyncAction from './sync-action';
import styles from './styles.css';
import parentStyles from '../styles.css';
interface RootPanelProps {
    premiumStatus: PremiumStatus;
    triggerSwitchPanel: (panelId: ActivePanel) => void;
    onClickLogout: () => void;
    onClickTeamConsole: () => void;
    onClickFamilyDashboard: () => void;
    secureExportEnabled: boolean;
}
const I18N_KEYS = {
    HEADER: 'manage_subscription_account_menu_settings',
    GO_TO_TAC: 'webapp_account_root_go_to_team_admin_console',
    ACCOUNT_DETAILS: 'webapp_account_management_panel_heading',
    FAMILY_DASHBOARD: 'webapp_account_root_item_family_dashboard',
    DEVICE_MANAGEMENT: 'webapp_account_root_item_device_management',
    SECURITY_SETTINGS: 'webapp_account_root_item_security_settings',
    IMPORT_EXPORT: 'webapp_account_root_item_import_export_data',
    IMPORT_DATA: 'webapp_account_root_import_data',
    ADD_DEVICE: 'webapp_account_root_item_add_device',
    MANUAL_SYNC: 'webapp_account_root_item_manual_sync',
    ALL_FEATURES: 'webapp_account_root_item_access_all_features',
    REFER_FRIEND: 'webapp_account_root_item_refer_a_friend',
    HELP_CENTER: 'webapp_account_root_item_help_center',
    TERMS: 'webapp_account_root_item_terms',
    PRIVACY_POLICY: 'webapp_account_root_item_privacy_policy',
    DEPENDENCY_LIST: 'webapp_account_root_dependencies_list',
    LOG_OUT: 'webapp_account_root_item_log_out',
    EXPORT_DISABLED_MODAL_TITLE: 'webapp_account_root_export_disabled_title',
    EXPORT_DISABLED_MODAL_CONTENT: 'webapp_account_root_export_disabled_content',
    EXPORT_DISABLED_MODAL_CLOSE: '_common_toast_close_label',
};
const dashGrey00 = colors.grey00;
export const RootPanel = ({ premiumStatus, triggerSwitchPanel, onClickLogout, onClickTeamConsole, onClickFamilyDashboard, secureExportEnabled, }: RootPanelProps) => {
    const [exportDisabledModalOpen, setExportDisabledModalOpen] = useState(false);
    const { translate } = useTranslate();
    const { routes, store } = useRouterGlobalSettingsContext();
    const isPersonalSpaceDisabled = useIsPersonalSpaceDisabled();
    const isPersonalSpaceEnabled = isPersonalSpaceDisabled.status === DataStatus.Success &&
        !isPersonalSpaceDisabled.isDisabled;
    const premiumData = useNodePremiumStatus();
    const isVaultExportEnabled = !isPersonalSpaceEnabled
        ? premiumData.status === DataStatus.Success &&
            !!premiumData.data.b2bStatus?.currentTeam?.teamInfo?.vaultExportEnabled
        : true;
    const { status: isMPLessUserStatus, isMPLessUser } = useIsMPlessUser();
    useEffect(() => {
        logPageView(PageView.SettingsGeneral);
    }, []);
    const switchPanel = (panelId: Exclude<ActivePanel, 'root'>) => {
        const panelToPageView: Record<Exclude<ActivePanel, 'root'>, PageView> = {
            'account-details': PageView.SettingsAccount,
            'device-management': PageView.SettingsDeviceList,
            'security-settings': PageView.SettingsSecurity,
            'import-export-data': PageView.SettingsExport,
            'access-all-features': PageView.SettingsMoreFeatures,
            'account-recovery': PageView.SettingsSecurity,
        };
        logPageView(panelToPageView[panelId]);
        triggerSwitchPanel(panelId);
    };
    const getDashlaneUrlHandler = (params: {
        type: string;
        action: string;
    }) => (e: React.MouseEvent<HTMLAnchorElement>) => {
        onLinkClickOpenDashlaneUrl(params)(e);
    };
    const handleClickOnLogout = () => {
        logLogoutEvent();
        onClickLogout();
    };
    const handleClickOnHelpCenter = (params: {
        type: string;
        action: string;
    }) => (e: React.MouseEvent<HTMLAnchorElement>) => {
        logEvent(new UserOpenHelpCenterEvent({
            helpCenterArticleCta: HelpCenterArticleCta.HelpCenter,
        }));
        logEvent(new UserOpenHelpCenterEvent({}));
        onLinkClickOpenDashlaneUrl(params)(e);
    };
    const handleClickTeamConsole = () => {
        onClickTeamConsole();
    };
    const openInNewTab = (url: string) => {
        window.open(url, '_blank', 'noreferrer');
    };
    const isBusinessAdmin = store.getState().user?.session?.permissions.tacAccessPermissions.size > 0 ??
        false;
    const isFamilyAdmin = isAccountFamilyAdmin(premiumStatus);
    const isPremiumOnly = premiumStatus.statusCode === PremiumStatusCode.PREMIUM;
    const isTrialOrPremiumOnly = isPremiumOnly || premiumStatus.statusCode === PremiumStatusCode.NEW_USER;
    const canTriggerManualSync = isTrialOrPremiumOnly ||
        premiumStatus.statusCode === PremiumStatusCode.PREMIUM_CANCELLED ||
        premiumStatus.statusCode === PremiumStatusCode.OLD_ACCOUNT;
    return (<section className={styles.rootContainer}>
      <h1 className={parentStyles.header}>{translate(I18N_KEYS.HEADER)}</h1>

      {isBusinessAdmin ? (<>
          <hr />
          <ul>
            <li>
              {APP_PACKAGED_IN_EXTENSION ? (<button type="button" onClick={handleClickTeamConsole}>
                  {translate(I18N_KEYS.GO_TO_TAC)}
                </button>) : (<a href={TAC_URL} target="_blank" rel="noopener noreferrer" onClick={getDashlaneUrlHandler({
                    type: 'account',
                    action: 'goToTAC',
                })}>
                  {translate(I18N_KEYS.GO_TO_TAC)}
                </a>)}
            </li>
          </ul>
        </>) : null}

      <hr />
      <ul>
        <li>
          <button type="button" className={styles.subPanelLink} onClick={() => switchPanel(ActivePanel.AccountDetails)}>
            {translate(I18N_KEYS.ACCOUNT_DETAILS)}
            <div className={styles.subPanelIcon}>
              <ArrowDownIcon color={dashGrey00} rotate={270}/>
            </div>
          </button>
        </li>

        <li>
          <button type="button" className={styles.subPanelLink} onClick={() => switchPanel(ActivePanel.DeviceManagement)}>
            {translate(I18N_KEYS.DEVICE_MANAGEMENT)}
            <div className={styles.subPanelIcon}>
              <ArrowDownIcon color={dashGrey00} rotate={270}/>
            </div>
          </button>
        </li>

        <li>
          <button type="button" className={styles.subPanelLink} onClick={() => switchPanel(ActivePanel.SecuritySettings)}>
            {translate(I18N_KEYS.SECURITY_SETTINGS)}
            <div className={styles.subPanelIcon}>
              <ArrowDownIcon color={dashGrey00} rotate={270}/>
            </div>
          </button>
        </li>

        <Dialog isOpen={exportDisabledModalOpen} actions={{
            primary: {
                children: translate(I18N_KEYS.EXPORT_DISABLED_MODAL_CLOSE),
                onClick: () => setExportDisabledModalOpen(false),
            },
        }} closeActionLabel={translate(I18N_KEYS.EXPORT_DISABLED_MODAL_CLOSE)} onClose={() => setExportDisabledModalOpen(false)} title={translate(I18N_KEYS.EXPORT_DISABLED_MODAL_TITLE)}>
          <Paragraph>
            {translate(I18N_KEYS.EXPORT_DISABLED_MODAL_CONTENT)}
          </Paragraph>
        </Dialog>

        {secureExportEnabled ? (<li>
            <button type="button" className={styles.subPanelLink} onClick={() => {
                if (isVaultExportEnabled) {
                    switchPanel(ActivePanel.ImportExportData);
                }
                else {
                    setExportDisabledModalOpen(true);
                }
            }}>
              {translate(I18N_KEYS.IMPORT_EXPORT)}
              <div className={styles.subPanelIcon}>
                <ArrowDownIcon color={dashGrey00} rotate={270}/>
              </div>
            </button>
          </li>) : null}

        <li>
          <Link to={`${routes.importData}`}>
            {translate(I18N_KEYS.IMPORT_DATA)}
          </Link>
        </li>

        {isFamilyAdmin && (<li>
            <button type="button" className={styles.subPanelLink} onClick={onClickFamilyDashboard}>
              {translate(I18N_KEYS.FAMILY_DASHBOARD)}
            </button>
          </li>)}
      </ul>

      {isMPLessUserStatus !== DataStatus.Success ? null : isMPLessUser ? (<>
          <hr />
          <ul>
            <li>
              <Link to={`${routes.deviceTransfer}`}>
                {translate(I18N_KEYS.ADD_DEVICE)}
              </Link>
            </li>
          </ul>
        </>) : null}

      {canTriggerManualSync && (<>
          <hr />
          <ul>
            <li>
              <SyncAction>{translate(I18N_KEYS.MANUAL_SYNC)}</SyncAction>
            </li>
          </ul>
        </>)}

      <hr />
      <ul>
        <li>
          <Link to={`${routes.userReferral}`}>
            {translate(I18N_KEYS.REFER_FRIEND)}
          </Link>
        </li>
        <li>
          <a href="*****" target="_blank" rel="noopener noreferrer" onClick={handleClickOnHelpCenter({
            type: 'account',
            action: 'helpCenter',
        })}>
            {translate(I18N_KEYS.HELP_CENTER)}
            <div className={styles.subPanelLinkIcon}>
              <OpenWebsiteIcon color={dashGrey00}/>
            </div>
          </a>
        </li>
      </ul>

      <hr />
      <ul>
        <li>
          <a href="*****" target="_blank" rel="noopener noreferrer" onClick={getDashlaneUrlHandler({
            type: 'account',
            action: 'termsOfService',
        })}>
            {translate(I18N_KEYS.TERMS)}
            <div className={styles.subPanelLinkIcon}>
              <OpenWebsiteIcon color={dashGrey00}/>
            </div>
          </a>
        </li>
        <li>
          <a href="*****" target="_blank" rel="noopener noreferrer" onClick={getDashlaneUrlHandler({
            type: 'account',
            action: 'privacyPolicy',
        })}>
            {translate(I18N_KEYS.PRIVACY_POLICY)}
            <div className={styles.subPanelLinkIcon}>
              <OpenWebsiteIcon color={dashGrey00}/>
            </div>
          </a>
        </li>
      </ul>

      <hr />
      <ul>
        <li>
          <Paragraph textStyle="ds.title.supporting.small">
            Find us on social media
          </Paragraph>
        </li>
        <li>
          <FlexContainer>
            <Button style={{ padding: '10px', marginLeft: '5px' }} mood="neutral" intensity="supershy" layout="iconOnly" icon="SocialFacebookFilled" onClick={() => openInNewTab('*****')}/>
            <Button style={{ padding: '10px', marginLeft: '5px' }} mood="neutral" intensity="supershy" layout="iconOnly" icon="SocialTwitterFilled" onClick={() => openInNewTab('*****')}/>
            <Button style={{ padding: '10px', marginLeft: '5px' }} mood="neutral" intensity="supershy" layout="iconOnly" icon="SocialYoutubeFilled" onClick={() => openInNewTab('*****')}/>
            <Button style={{ padding: '10px', marginLeft: '5px' }} mood="neutral" intensity="supershy" layout="iconOnly" icon="SocialInstagramFilled" onClick={() => openInNewTab('*****')}/>
            <Button style={{ padding: '10px', marginLeft: '5px' }} mood="neutral" intensity="supershy" layout="iconOnly" icon="SocialRedditFilled" onClick={() => openInNewTab('*****')}/>
            <Button style={{ padding: '10px' }} mood="neutral" intensity="supershy" layout="iconOnly" icon="SocialLinkedinFilled" onClick={() => openInNewTab('*****')}/>
          </FlexContainer>
        </li>
      </ul>

      <hr />
      <ul>
        <li>
          <button type="button" onClick={() => handleClickOnLogout()}>
            {translate(I18N_KEYS.LOG_OUT)}
          </button>
        </li>
      </ul>

      
      <DebugDataDialog />
    </section>);
};

import { useEffect, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { jsx } from '@dashlane/design-system';
import { PremiumStatus } from '@dashlane/communication';
import { Lee } from 'lee';
import { getUrlSearchParams, useHistory } from 'libs/router';
import { isInLegacyEdgeExtension } from 'libs/extension';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import { useOpenTeamConsole } from 'libs/hooks/use-open-team-console';
import { accountPanelIgnoreClickOutsideClassName } from 'webapp/variables';
import { useWebappLogoutDialogContext } from 'webapp/webapp-logout-dialog-context';
import { Panel } from 'webapp/panel';
import { RootPanel } from './root-panel/root-panel';
import DeviceManagement from './device-management';
import { SecuritySettings } from './security-settings/security-settings';
import { AccountRecoveryRoot } from './security-settings/account-recovery-root/account-recovery-root';
import { AccountRecoveryKeyReactivateDialog } from './security-settings/account-recovery-root/account-recovery-key/components/account-recovery-key-reactivate-dialog';
import { AccountDetails } from './account-details/account-details';
import { ExportData } from './export-data/export-data';
import { ActivePanel } from './types';
import styles from './styles.css';
import cssVariables from '../variables.css';
import rootPanelTransitionStyles from './transition-root.css';
import subPanelTransitionStyles from './transition-subpanel.css';
const panelAnimationDurationMs = parseInt(cssVariables['--edit-panel-animation-duration-enter'], 10);
export interface AccountComponentProps {
    lee: Lee;
    premiumStatus: PremiumStatus | null;
    onNavigateOut: (userWasRedirectedToAnotherPage?: boolean) => void;
    onClickFamilyDashboard: () => void;
}
export const AccountComponent = ({ lee, premiumStatus, onNavigateOut, onClickFamilyDashboard, }: AccountComponentProps) => {
    const panelContent = useRef<HTMLDivElement>(null);
    const [ignoreClosePanelOnEscape, setIgnoreClosePanelOnEscape] = useState(false);
    const [activePanel, setActivePanel] = useState<ActivePanel>(ActivePanel.Root);
    const [isRecoveryKeyDialogOpen, setIsRecoveryKeyDialogOpen] = useState(false);
    const accountInfo = useAccountInfo();
    const { openTeamConsole } = useOpenTeamConsole();
    const { isLogoutDialogOpen, openLogoutDialog } = useWebappLogoutDialogContext();
    const onRecoveryKeyDialogClose = () => {
        setIsRecoveryKeyDialogOpen(false);
    };
    const onGoToRecoveryKeySettingsClick = () => {
        setActivePanel(ActivePanel.AccountRecovery);
    };
    const urlParams = getUrlSearchParams();
    const viewParam = urlParams.get('view');
    useEffect(() => {
        switch (viewParam) {
            case 'devices':
                setActivePanel(ActivePanel.DeviceManagement);
                break;
            case 'security-settings':
                setActivePanel(ActivePanel.SecuritySettings);
                break;
            case 'recovery-key-reactivate':
                setActivePanel(ActivePanel.SecuritySettings);
                setIsRecoveryKeyDialogOpen(true);
                break;
            default:
                setActivePanel(ActivePanel.Root);
                break;
        }
    }, [viewParam]);
    const onDialogSateChanged = (isDialogOpened: boolean) => {
        setIgnoreClosePanelOnEscape(isDialogOpened);
    };
    const onSubPanelExitRequest = () => {
        setActivePanel(ActivePanel.Root);
        if (panelContent.current) {
            panelContent.current.focus();
        }
    };
    useEffect(() => {
        if (panelContent.current) {
            panelContent.current.focus();
        }
    }, []);
    const history = useHistory();
    useEffect(() => {
        const unRegisterListen = history.listen(() => {
            onNavigateOut(true);
        });
        return () => unRegisterListen();
    }, [history, onNavigateOut]);
    if (premiumStatus === null || accountInfo === null) {
        return null;
    }
    const url = window.location.href;
    const isAuthorizedExtension = !isInLegacyEdgeExtension(url);
    return (<Panel className={styles.panel} onNavigateOut={() => {
            if (!isLogoutDialogOpen) {
                onNavigateOut();
            }
        }} ignoreClickOutsideClassName={`${accountPanelIgnoreClickOutsideClassName} ${styles.alertPopup}`} ignoreCloseOnEscape={ignoreClosePanelOnEscape}>
      <div tabIndex={-1} ref={panelContent}>
        {isRecoveryKeyDialogOpen ? (<AccountRecoveryKeyReactivateDialog onClose={onRecoveryKeyDialogClose} onGoToRecoveryKeySettings={onGoToRecoveryKeySettingsClick}/>) : null}
        <TransitionGroup>
          {activePanel === ActivePanel.Root ? (<CSSTransition classNames={rootPanelTransitionStyles} timeout={panelAnimationDurationMs}>
              <RootPanel key="for-CSSTransition-root" premiumStatus={premiumStatus} triggerSwitchPanel={(p) => {
                setActivePanel(p);
            }} onClickLogout={openLogoutDialog} onClickTeamConsole={openTeamConsole} onClickFamilyDashboard={onClickFamilyDashboard} secureExportEnabled={isAuthorizedExtension}/>
            </CSSTransition>) : null}

          {activePanel === ActivePanel.AccountDetails ? (<CSSTransition classNames={subPanelTransitionStyles} timeout={panelAnimationDurationMs} exit={false}>
              <AccountDetails key="for-TransitionGroup-subpanel-account-details" onNavigateOut={onSubPanelExitRequest} premiumStatus={premiumStatus} onDialogSateChanged={onDialogSateChanged} onClickTeamConsole={openTeamConsole}/>
            </CSSTransition>) : null}

          {activePanel === ActivePanel.DeviceManagement && (<CSSTransition classNames={subPanelTransitionStyles} timeout={panelAnimationDurationMs} exit={false}>
              <DeviceManagement key="for-TransitionGroup-subpanel-device-mngmt" onNavigateOut={onSubPanelExitRequest} devices={lee.carbon.devices} lee={lee}/>
            </CSSTransition>)}

          {activePanel === ActivePanel.ImportExportData && (<CSSTransition classNames={subPanelTransitionStyles} timeout={panelAnimationDurationMs}>
              <ExportData key="for-TransitionGroup-subpanel-export-data" onNavigateOut={onSubPanelExitRequest} reportError={lee.reportError}/>
            </CSSTransition>)}

          {activePanel === ActivePanel.SecuritySettings && (<CSSTransition classNames={subPanelTransitionStyles} timeout={panelAnimationDurationMs}>
              <SecuritySettings key="for-TransitionGroup-subpanel-security-settings" onNavigateOut={onSubPanelExitRequest} onDialogStateChanged={onDialogSateChanged}/>
            </CSSTransition>)}

          {activePanel === ActivePanel.AccountRecovery ? (<CSSTransition classNames={subPanelTransitionStyles} timeout={panelAnimationDurationMs} exit={false}>
              <AccountRecoveryRoot key="for-TransitionGroup-security-settings-subpanel-account-recovery" onNavigateOut={onSubPanelExitRequest}/>
            </CSSTransition>) : null}
        </TransitionGroup>
      </div>
    </Panel>);
};

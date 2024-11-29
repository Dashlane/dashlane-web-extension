import { useEffect, useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { PremiumStatus } from "@dashlane/communication";
import { Lee } from "../../lee";
import { AccountDetails } from "./account-details/account-details";
import DeviceManagement from "./device-management/device-management-panel";
import { ExportData } from "./export-data/export-data";
import { Panel } from "../panel";
import { RootPanel } from "./root-panel/root-panel";
import { SecuritySettings } from "./security-settings/security-settings";
import { AccountRecoveryRoot } from "./security-settings/account-recovery-root/account-recovery-root";
import { AccountRecoveryKeyReactivateDialog } from "./security-settings/account-recovery-root/account-recovery-key/components/account-recovery-key-reactivate-dialog";
import { ActivePanel } from "./types";
import { useWebappLogoutDialogContext } from "../webapp-logout-dialog-context";
import {
  accountPanelIgnoreClickOutsideClassName,
  debugDataIgnoreClickOutsideClassname,
} from "../variables";
import { getUrlSearchParams, useHistory } from "../../libs/router";
import { isInLegacyEdgeExtension } from "../../libs/extension";
import { useAccountInfo } from "../../libs/carbon/hooks/useAccountInfo";
import zIndexVars from "../../libs/dashlane-style/globals/z-index-variables.css";
import subPanelTransitionStyles from "./transition-subpanel.css";
import rootPanelTransitionStyles from "./transition-root.css";
import cssVariables from "../variables.css";
import styles from "./styles.css";
const panelAnimationDurationMs = parseInt(
  cssVariables["--edit-panel-animation-duration-enter"],
  10
);
export interface AccountComponentProps {
  lee: Lee;
  premiumStatus: PremiumStatus | null;
  onNavigateOut: (userWasRedirectedToAnotherPage?: boolean) => void;
  onClickFamilyDashboard: () => void;
}
export const AccountComponent = ({
  lee,
  premiumStatus,
  onNavigateOut,
  onClickFamilyDashboard,
}: AccountComponentProps) => {
  const panelContent = useRef<HTMLDivElement>(null);
  const [ignoreClosePanelOnEscape, setIgnoreClosePanelOnEscape] =
    useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>(ActivePanel.Root);
  const [isRecoveryKeyDialogOpen, setIsRecoveryKeyDialogOpen] = useState(false);
  const accountInfo = useAccountInfo();
  const { isLogoutDialogOpen, openLogoutDialog } =
    useWebappLogoutDialogContext();
  const onRecoveryKeyDialogClose = () => {
    setIsRecoveryKeyDialogOpen(false);
  };
  const onHandleGoToSecuritySettingsClick = () => {
    setActivePanel(ActivePanel.SecuritySettings);
  };
  const urlParams = getUrlSearchParams();
  const viewParam = urlParams.get("view");
  useEffect(() => {
    switch (viewParam) {
      case "devices":
        setActivePanel(ActivePanel.DeviceManagement);
        break;
      case "security-settings":
        setActivePanel(ActivePanel.SecuritySettings);
        break;
      case "recovery-key-reactivate":
        setActivePanel(ActivePanel.SecuritySettings);
        setIsRecoveryKeyDialogOpen(true);
        break;
      case "change-login-email":
        setActivePanel(ActivePanel.AccountDetails);
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
  return (
    <Panel
      containerSx={{
        position: "fixed",
        overflowX: "hidden",
        overflowY: "auto",
        backgroundColor: "ds.container.agnostic.neutral.supershy",
        boxShadow: "-16px 0px 32px rgba(0, 0, 0, 0.1)",
        width: cssVariables["--account-panel-width"],
        zIndex: zIndexVars["--z-index-account-panel"],
      }}
      onNavigateOut={() => {
        if (!isLogoutDialogOpen) {
          onNavigateOut();
        }
      }}
      ignoreClickOutsideClassName={`${accountPanelIgnoreClickOutsideClassName} ${styles.alertPopup} ${debugDataIgnoreClickOutsideClassname}`}
      ignoreCloseOnEscape={ignoreClosePanelOnEscape}
    >
      <div tabIndex={-1} ref={panelContent}>
        {isRecoveryKeyDialogOpen ? (
          <AccountRecoveryKeyReactivateDialog
            onClose={onRecoveryKeyDialogClose}
            onGoToSecuritySettings={onHandleGoToSecuritySettingsClick}
          />
        ) : null}
        <TransitionGroup>
          {activePanel === ActivePanel.Root ? (
            <CSSTransition
              classNames={rootPanelTransitionStyles}
              timeout={panelAnimationDurationMs}
            >
              <RootPanel
                key="for-CSSTransition-root"
                premiumStatus={premiumStatus}
                triggerSwitchPanel={(p) => {
                  setActivePanel(p);
                }}
                onClickLogout={openLogoutDialog}
                onClickFamilyDashboard={onClickFamilyDashboard}
                secureExportEnabled={isAuthorizedExtension}
              />
            </CSSTransition>
          ) : null}

          {activePanel === ActivePanel.AccountDetails ? (
            <CSSTransition
              classNames={subPanelTransitionStyles}
              timeout={panelAnimationDurationMs}
              exit={false}
            >
              <AccountDetails
                key="for-TransitionGroup-subpanel-account-details"
                onNavigateOut={onSubPanelExitRequest}
                premiumStatus={premiumStatus}
                onDialogSateChanged={onDialogSateChanged}
              />
            </CSSTransition>
          ) : null}

          {activePanel === ActivePanel.DeviceManagement && (
            <CSSTransition
              classNames={subPanelTransitionStyles}
              timeout={panelAnimationDurationMs}
              exit={false}
            >
              <DeviceManagement
                key="for-TransitionGroup-subpanel-device-mngmt"
                onNavigateOut={onSubPanelExitRequest}
              />
            </CSSTransition>
          )}

          {activePanel === ActivePanel.ImportExportData && (
            <CSSTransition
              classNames={subPanelTransitionStyles}
              timeout={panelAnimationDurationMs}
            >
              <ExportData
                key="for-TransitionGroup-subpanel-export-data"
                onNavigateOut={onSubPanelExitRequest}
                reportError={lee.reportError}
              />
            </CSSTransition>
          )}

          {activePanel === ActivePanel.SecuritySettings && (
            <CSSTransition
              classNames={subPanelTransitionStyles}
              timeout={panelAnimationDurationMs}
            >
              <SecuritySettings
                key="for-TransitionGroup-subpanel-security-settings"
                onNavigateOut={onSubPanelExitRequest}
                onDialogStateChanged={onDialogSateChanged}
              />
            </CSSTransition>
          )}

          {activePanel === ActivePanel.AccountRecovery ? (
            <CSSTransition
              classNames={subPanelTransitionStyles}
              timeout={panelAnimationDurationMs}
              exit={false}
            >
              <AccountRecoveryRoot
                key="for-TransitionGroup-security-settings-subpanel-account-recovery"
                onNavigateOut={onSubPanelExitRequest}
              />
            </CSSTransition>
          ) : null}
        </TransitionGroup>
      </div>
    </Panel>
  );
};

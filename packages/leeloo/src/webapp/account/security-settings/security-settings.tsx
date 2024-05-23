import React, { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { AccountRecoveryRoot } from './account-recovery-root/account-recovery-root';
import { TwoFactorAuthenticationRoot } from './two-factor-authentication-root/two-factor-authentication-root';
import { SecuritySettingsRoot } from './security-settings-root/security-settings-root';
import { ChangeMasterPasswordRoot } from './change-master-password-root/change-master-password-root';
import { WebAuthnRoot } from './webauthn-root/webauthn-root';
import cssVariables from '../../variables.css';
import rootPanelTransitionStyles from '../transition-root.css';
import subPanelTransitionStyles from '../transition-subpanel.css';
import { logPageView } from 'libs/logs/logEvent';
import { PageView } from '@dashlane/hermes';
const panelAnimationDurationMs = parseInt(cssVariables['--edit-panel-animation-duration-enter'], 10);
export enum ActivePanel {
    WebAuthn,
    AccountRecovery,
    ChangeMP,
    Root,
    TwoFactorAuthentication
}
export interface Props {
    onNavigateOut: () => void;
    onDialogStateChanged?: (isDialogOpened: boolean) => void;
}
export const SecuritySettings = ({ onNavigateOut, onDialogStateChanged, }: Props) => {
    const [activePanel, setActivePanel] = useState(ActivePanel.Root);
    const onSubPanelExitRequest = () => {
        logPageView(PageView.SettingsSecurity);
        setActivePanel(ActivePanel.Root);
    };
    return (<div>
      <TransitionGroup>
        {activePanel === ActivePanel.Root ? (<CSSTransition classNames={rootPanelTransitionStyles} timeout={panelAnimationDurationMs}>
            <SecuritySettingsRoot key="for-TransitionGroup-security-settings-root" onNavigateOut={onNavigateOut} changeActivePanel={setActivePanel} onDialogStateChanged={onDialogStateChanged}/>
          </CSSTransition>) : null}
        {activePanel === ActivePanel.ChangeMP ? (<CSSTransition classNames={subPanelTransitionStyles} timeout={panelAnimationDurationMs}>
            <ChangeMasterPasswordRoot key="for-TransitionGroup-security-settings-subpanel-changemp" onNavigateOut={onSubPanelExitRequest}/>
          </CSSTransition>) : null}
        {activePanel === ActivePanel.AccountRecovery ? (<CSSTransition classNames={subPanelTransitionStyles} timeout={panelAnimationDurationMs}>
            <AccountRecoveryRoot key="for-TransitionGroup-security-settings-subpanel-account-recovery" onNavigateOut={onSubPanelExitRequest}/>
          </CSSTransition>) : null}
        {activePanel === ActivePanel.TwoFactorAuthentication ? (<CSSTransition classNames={subPanelTransitionStyles} timeout={panelAnimationDurationMs}>
            <TwoFactorAuthenticationRoot key="for-TransitionGroup-security-settings-subpanel-account-recovery" onNavigateOut={onSubPanelExitRequest}/>
          </CSSTransition>) : null}
        {activePanel === ActivePanel.WebAuthn ? (<CSSTransition classNames={subPanelTransitionStyles} timeout={panelAnimationDurationMs}>
            <WebAuthnRoot key="for-TransitionGroup-security-settings-subpanel-webauthn" onNavigateOut={onSubPanelExitRequest} onDialogStateChanged={onDialogStateChanged}/>
          </CSSTransition>) : null}
      </TransitionGroup>
    </div>);
};

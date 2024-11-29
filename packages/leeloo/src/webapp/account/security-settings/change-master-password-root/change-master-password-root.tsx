import React, { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { ChangeMPFlowPath } from "@dashlane/communication";
import { carbonConnector } from "../../../../libs/carbon/connector";
import { ChangeMasterPasswordForm } from "./change-master-password-form/change-master-password-form";
import { PasswordTips } from "./password-tips/password-tips";
import cssVariables from "../../../variables.css";
import rootPanelTransitionStyles from "../../transition-root.css";
import subPanelTransitionStyles from "../../transition-subpanel.css";
const panelAnimationDurationMs = parseInt(
  cssVariables["--edit-panel-animation-duration-enter"],
  10
);
export enum ChangeMPActivePanel {
  Root,
  PasswordTipsPanel,
}
export interface Props {
  onNavigateOut: () => void;
}
const handleChangeMasterPassword = async (
  currentPassword: string | null,
  newPassword: string | null
): Promise<void> => {
  if (!currentPassword || !newPassword) {
    return;
  }
  await carbonConnector.changeMasterPassword({
    currentPassword,
    newPassword,
    flow: ChangeMPFlowPath.USER_CHANGING_MP,
  });
};
export const ChangeMasterPasswordRoot = ({ onNavigateOut }: Props) => {
  const [activePanel, setActivePanel] = useState(ChangeMPActivePanel.Root);
  const onSubPanelExitRequest = () => {
    setActivePanel(ChangeMPActivePanel.Root);
  };
  const onConfirmChangeMasterPassword = (
    currentPassword: string,
    newPassword: string
  ) => {
    handleChangeMasterPassword(currentPassword, newPassword);
  };
  const onShowPasswordTips = () => {
    setActivePanel(ChangeMPActivePanel.PasswordTipsPanel);
  };
  return (
    <div>
      <TransitionGroup>
        {activePanel === ChangeMPActivePanel.Root ? (
          <CSSTransition
            classNames={rootPanelTransitionStyles}
            timeout={panelAnimationDurationMs}
          >
            <ChangeMasterPasswordForm
              key="for-TransitionGroup-security-settings-changemp-form"
              onNavigateOut={onNavigateOut}
              onShowPasswordTips={onShowPasswordTips}
              onConfirmChangeMasterPassword={onConfirmChangeMasterPassword}
            />
          </CSSTransition>
        ) : null}

        {activePanel === ChangeMPActivePanel.PasswordTipsPanel ? (
          <CSSTransition
            classNames={subPanelTransitionStyles}
            timeout={panelAnimationDurationMs}
          >
            <PasswordTips
              key="for-TransitionGroup-security-settings-changemp-subpanel-passwordtips"
              onNavigateOut={onSubPanelExitRequest}
            />
          </CSSTransition>
        ) : null}
      </TransitionGroup>
    </div>
  );
};

import * as React from "react";
import { PremiumStatus } from "@dashlane/communication";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { ActivePanel } from "./types";
import { AccountManagement } from "./account-management/account-management";
import {
  ChangeEmail,
  ChangeEmailFlow,
} from "./account-management/change-email/change-email";
import { Invoices } from "./invoices/invoices";
import styles from "./styles.css";
import cssVariables from "../../variables.css";
import rootPanelTransitionStyles from "../transition-root.css";
import subPanelTransitionStyles from "../transition-subpanel.css";
import { getUrlSearchParams } from "../../../libs/router";
const panelAnimationDurationMs = parseInt(
  cssVariables["--edit-panel-animation-duration-enter"],
  10
);
export interface Props {
  premiumStatus: PremiumStatus;
  onNavigateOut: () => void;
  onDialogSateChanged: (isDialogOpen: boolean) => void;
}
export interface SubPanelProps extends Props {
  setActivePanel: (panel: ActivePanel) => void;
  onSubPanelExitRequest: () => void;
}
const AccountManagementComponent = (props: SubPanelProps) => {
  return (
    <AccountManagement
      changeActivePanel={props.setActivePanel}
      onNavigateOut={props.onNavigateOut}
    />
  );
};
const InvoicesComponent = (props: SubPanelProps) => {
  return <Invoices onNavigateOut={props.onSubPanelExitRequest} />;
};
const ChangeContactEmailComponent = (props: SubPanelProps) => {
  return (
    <ChangeEmail
      flow={ChangeEmailFlow.CONTACT_EMAIL}
      onNavigateOut={props.onSubPanelExitRequest}
    />
  );
};
const ChangeLoginEmailComponent = (props: SubPanelProps) => {
  return (
    <ChangeEmail
      flow={ChangeEmailFlow.LOGIN_EMAIL}
      onNavigateOut={props.onSubPanelExitRequest}
    />
  );
};
const SubPanelMap: Record<ActivePanel, (props: SubPanelProps) => JSX.Element> =
  {
    [ActivePanel.Root]: AccountManagementComponent,
    [ActivePanel.Invoices]: InvoicesComponent,
    [ActivePanel.ChangeContactEmail]: ChangeContactEmailComponent,
    [ActivePanel.ChangeLoginEmail]: ChangeLoginEmailComponent,
  };
const wrapPanelInTransition = (
  activePanel: ActivePanel,
  childProps: SubPanelProps
) => {
  return (
    <CSSTransition
      classNames={
        activePanel === ActivePanel.Root
          ? rootPanelTransitionStyles
          : subPanelTransitionStyles
      }
      timeout={panelAnimationDurationMs}
      key={activePanel}
    >
      {SubPanelMap[activePanel]({
        ...childProps,
      })}
    </CSSTransition>
  );
};
export const AccountDetails = (props: Props) => {
  const [activePanel, setActivePanel] = React.useState<ActivePanel>(
    ActivePanel.Root
  );
  const urlParams = getUrlSearchParams();
  const viewParam = urlParams.get("view");
  React.useEffect(() => {
    switch (viewParam) {
      case "change-login-email":
        setActivePanel(ActivePanel.ChangeLoginEmail);
        break;
      default:
        setActivePanel(ActivePanel.Root);
        break;
    }
  }, [viewParam]);
  const onSubPanelExitRequest = () => {
    setActivePanel(ActivePanel.Root);
  };
  const subPanelProps = {
    ...props,
    setActivePanel,
    onSubPanelExitRequest,
  };
  return (
    <div className={styles.rootContainer}>
      <TransitionGroup>
        {wrapPanelInTransition(activePanel, subPanelProps)}
      </TransitionGroup>
    </div>
  );
};

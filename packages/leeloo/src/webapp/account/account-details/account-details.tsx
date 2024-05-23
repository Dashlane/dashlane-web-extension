import * as React from 'react';
import { PremiumStatus } from '@dashlane/communication';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ActivePanel } from 'webapp/account/account-details/types';
import { AccountManagement } from './account-management/account-management';
import { ChangeContactEmail } from './account-management/change-contact-email/change-contact-email';
import { Invoices } from './invoices/invoices';
import styles from './styles.css';
import cssVariables from '../../variables.css';
import rootPanelTransitionStyles from '../transition-root.css';
import subPanelTransitionStyles from '../transition-subpanel.css';
const panelAnimationDurationMs = parseInt(cssVariables['--edit-panel-animation-duration-enter'], 10);
export interface Props {
    premiumStatus: PremiumStatus;
    onNavigateOut: () => void;
    onDialogSateChanged: (isDialogOpen: boolean) => void;
    onClickTeamConsole: () => void;
}
export interface SubPanelProps extends Props {
    setActivePanel: (panel: ActivePanel) => void;
    onSubPanelExitRequest: () => void;
}
const AccountManagementComponent = (props: SubPanelProps) => {
    return (<AccountManagement changeActivePanel={props.setActivePanel} onNavigateOut={props.onNavigateOut}/>);
};
const InvoicesComponent = (props: SubPanelProps) => {
    return <Invoices onNavigateOut={props.onSubPanelExitRequest}/>;
};
const ChangeContactEmailComponent = (props: SubPanelProps) => {
    return <ChangeContactEmail onNavigateOut={props.onSubPanelExitRequest}/>;
};
const SubPanelMap: Record<ActivePanel, (props: SubPanelProps) => JSX.Element> = {
    [ActivePanel.Root]: AccountManagementComponent,
    [ActivePanel.Invoices]: InvoicesComponent,
    [ActivePanel.ChangeContactEmail]: ChangeContactEmailComponent,
};
const wrapPanelInTransition = (activePanel: ActivePanel, childProps: SubPanelProps) => {
    return (<CSSTransition classNames={activePanel === ActivePanel.Root
            ? rootPanelTransitionStyles
            : subPanelTransitionStyles} timeout={panelAnimationDurationMs} key={activePanel}>
      {SubPanelMap[activePanel]({
            ...childProps,
        })}
    </CSSTransition>);
};
export const AccountDetails = (props: Props) => {
    const [activePanel, setActivePanel] = React.useState<ActivePanel>(ActivePanel.Root);
    const onSubPanelExitRequest = () => {
        setActivePanel(ActivePanel.Root);
    };
    const subPanelProps = {
        ...props,
        setActivePanel,
        onSubPanelExitRequest,
    };
    return (<div className={styles.rootContainer}>
      <TransitionGroup>
        {wrapPanelInTransition(activePanel, subPanelProps)}
      </TransitionGroup>
    </div>);
};

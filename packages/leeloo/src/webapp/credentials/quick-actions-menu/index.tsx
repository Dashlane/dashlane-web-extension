import React, { createRef } from 'react';
import { Credential } from '@dashlane/vault-contracts';
import { DropdownType, Field, ItemType, UserOpenVaultItemDropdownEvent, } from '@dashlane/hermes';
import { openUrl } from 'libs/external-urls';
import { redirect } from 'libs/router';
import { Dropdown, DropdownAlignment, DropdownPosition, } from 'libs/dashlane-style/dropdown';
import { logOpenCredentialUrl } from 'libs/logs/events/vault/open-external-vault-item-link';
import { logEvent } from 'libs/logs/logEvent';
import { carbonConnector } from 'libs/carbon/connector';
import { sendLogsForCopyVaultItem } from '../helpers';
import { menuMaxHeight } from './menu';
import { QuickActionsMenuContent } from './content';
interface State {
    position: DropdownPosition;
    credentialsGloballyRequireMP?: boolean;
}
interface Props {
    credential: Credential;
    children?: React.ReactNode;
    credentialItemRoute: string;
    renderRoot: (toggle: () => void) => JSX.Element;
}
export class QuickActionsMenu extends React.Component<Props, State> {
    private anchorRef = createRef<HTMLDivElement>();
    public state = {
        position: DropdownPosition.Bottom,
        credentialsGloballyRequireMP: undefined,
    };
    public componentDidMount() {
        carbonConnector.arePasswordsProtected().then((protectPasswords) => {
            this.setState({
                credentialsGloballyRequireMP: protectPasswords,
            });
        });
    }
    private adaptMenuOpenAnimationVerticalDirection = () => {
        if (!this.anchorRef.current) {
            return;
        }
        const viewPortHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        const anchorOriginDistanceFromBottom = viewPortHeight - this.anchorRef.current.getBoundingClientRect().bottom;
        const margin = 10;
        const hasEnoughSpaceBelowForMenu = anchorOriginDistanceFromBottom >= menuMaxHeight + margin;
        this.setState({
            position: hasEnoughSpaceBelowForMenu
                ? DropdownPosition.Bottom
                : DropdownPosition.Top,
        });
    };
    private onOpenPopover = () => {
        logEvent(new UserOpenVaultItemDropdownEvent({
            dropdownType: DropdownType.QuickActions,
            itemType: ItemType.Credential,
        }));
        this.adaptMenuOpenAnimationVerticalDirection();
    };
    private onEditItem = () => {
        redirect(this.props.credentialItemRoute);
    };
    private onGoToWebsite = () => {
        logOpenCredentialUrl(this.props.credential.id, this.props.credential.URL);
        openUrl(this.props.credential.URL);
    };
    private onCopyLogin = () => {
        sendLogsForCopyVaultItem(this.props.credential.id, this.props.credential.URL, Field.Login, false);
    };
    private onCopyEmail = () => {
        sendLogsForCopyVaultItem(this.props.credential.id, this.props.credential.URL, Field.Email, false);
    };
    private onToggle = (isOpen: boolean) => {
        if (isOpen) {
            setTimeout(this.onOpenPopover);
        }
    };
    public render() {
        const { credential } = this.props;
        const { position } = this.state;
        const anchor = <div ref={this.anchorRef}/>;
        return (<Dropdown alignment={DropdownAlignment.End} position={position} onToggle={this.onToggle} withBackdrop={false} renderRoot={this.props.renderRoot} anchor={anchor}>
        <QuickActionsMenuContent credential={credential} onCopyLogin={this.onCopyLogin} onCopyEmail={this.onCopyEmail} onEditItem={this.onEditItem} onGoToWebsite={credential.URL ? this.onGoToWebsite : undefined}/>
      </Dropdown>);
    }
}

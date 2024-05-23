import React from 'react';
import classNames from 'classnames';
import { ThemeUIStyleObject } from '@dashlane/design-system';
import { useModuleQuery } from '@dashlane/framework-react';
import { sharingItemsApi } from '@dashlane/sharing-contracts';
import { Credential, vaultItemsCrudApi } from '@dashlane/vault-contracts';
import { IconButton, Tooltip } from '@dashlane/ui-components';
import { Lee } from 'lee';
import { Link } from 'libs/router';
import { openUrl } from 'libs/external-urls';
import { logOpenCredentialUrl } from 'libs/logs/events/vault/open-external-vault-item-link';
import { CredentialInfo as CredentialInfoBase, CredentialInfoSize, } from 'libs/dashlane-style/credential-info/credential-info';
import { QuickActionsMenu } from 'webapp/credentials/quick-actions-menu';
import { editPanelIgnoreClickOutsideClassName } from 'webapp/variables';
import styles from './styles.css';
import goToIcon from './images/icon-goto.svg';
import moreIcon from './images/icon-more.svg';
interface CredentialSearchItemProps {
    credential: Credential;
    lee: Lee;
    onSelectCredential: () => void;
    style?: React.CSSProperties;
    sxProps?: Partial<ThemeUIStyleObject>;
}
interface State {
    isMounted: boolean;
    onHover: boolean;
}
type CancelablePromise = {
    promise: Promise<any>;
    cancel: () => void;
};
const goToImage = <img src={goToIcon}/>;
interface CredentialInfoProps {
    credential: Credential;
    sxProps?: Partial<ThemeUIStyleObject>;
}
const CredentialInfo = ({ credential, sxProps = {} }: CredentialInfoProps) => {
    const { id, itemName, username, email } = credential;
    const { data: credentialPreferences } = useModuleQuery(vaultItemsCrudApi, 'tempCredentialPreferences', {
        credentialId: id,
    });
    const { data: sharingStatus } = useModuleQuery(sharingItemsApi, 'getSharingStatusForItem', {
        itemId: credential.id,
    });
    return (<CredentialInfoBase title={itemName} login={username} email={email} shared={sharingStatus?.isShared} autoProtected={credentialPreferences?.requireMasterPassword} size={CredentialInfoSize.SMALL} fullWidth sxProps={sxProps}/>);
};
const moreButton = (label: string, onClick: () => void) => (<button type="button" className={styles.more} title={label} onClick={onClick}>
    <img src={moreIcon} className={styles.moreImg}/>
  </button>);
interface GoToButtonProps {
    id: string;
    URL: string;
    label: string;
    disabled: boolean;
}
const GoToButton = ({ id, URL, label, disabled }: GoToButtonProps) => {
    const onClick = (): void => {
        logOpenCredentialUrl(id, URL);
        openUrl(URL);
    };
    return (<Tooltip content={label} placement="bottom-end">
      <IconButton type="button" className={styles.goto} disabled={disabled} aria-label={label} icon={goToImage} onClick={onClick}/>
    </Tooltip>);
};
const preventDragAndDrop = (e: React.DragEvent<HTMLElement>) => e.preventDefault();
export class CredentialSearchItem extends React.Component<CredentialSearchItemProps, State> {
    private promise: CancelablePromise;
    public constructor(props: CredentialSearchItemProps) {
        super(props);
        this.state = {
            isMounted: false,
            onHover: false,
        };
    }
    public componentDidMount() {
        let isCanceled = false;
        const promise = new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                if (isCanceled) {
                    reject();
                }
                else {
                    resolve();
                }
            }, 500);
        })
            .then(() => this.updateState({ isMounted: true }))
            .catch(() => {
        });
        this.promise = {
            promise,
            cancel: () => {
                isCanceled = true;
            },
        };
    }
    public componentWillUnmount() {
        this.promise.cancel();
        if (this.state.isMounted) {
            this.updateState({ isMounted: false });
        }
    }
    private getButtons() {
        const _ = this.props.lee.translate.namespace('webapp_sidemenu_search_actions_');
        const { credential } = this.props;
        const { id, URL } = credential;
        const renderQuickActionsMenuRoot = (toggle: () => void): JSX.Element => {
            return moreButton(_('more_title'), toggle);
        };
        return this.state.isMounted && this.state.onHover ? (<div className={styles.actions}>
        <GoToButton id={id} URL={URL} disabled={!URL} label={!URL ? _('no_website') : _('goto_title')}/>
        <QuickActionsMenu renderRoot={renderQuickActionsMenuRoot} credential={credential} credentialItemRoute={this.props.lee.routes.userCredential(id)}/>
      </div>) : null;
    }
    private updateState(state: {}) {
        this.setState(Object.assign({}, this.state, state));
    }
    private onItemClick = () => {
        this.props.onSelectCredential();
    };
    public render() {
        const { credential, lee } = this.props;
        return (<div className={classNames(styles.item, editPanelIgnoreClickOutsideClassName)} onMouseLeave={() => this.updateState({ onHover: false })} onMouseEnter={() => this.updateState({ onHover: true })}>
        <Link onClick={this.onItemClick} to={lee.routes.userCredential(credential.id)} className={styles.link} onDragStart={preventDragAndDrop} onDrop={preventDragAndDrop}>
          <CredentialInfo credential={credential} sxProps={{
                paddingRight: '16px',
            }}/>
        </Link>
        {this.getButtons()}
      </div>);
    }
}

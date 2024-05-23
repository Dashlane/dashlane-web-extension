import { Button, Icon, jsx } from '@dashlane/design-system';
import { withProtectedItemsUnlocker } from 'webapp/unlock-items';
import { LockedItemType, ProtectedItemsUnlockerProps, UnlockerAction, } from 'webapp/unlock-items/types';
import { InjectedTranslateProps, withTranslate } from 'libs/i18n/withTranslate';
import styles from './styles.css';
import iconOk from './img/ok-tick.svg';
import iconNotOk from './img/not-ok-cross.svg';
import { Component } from 'react';
const FEEDBACK_DELAY_MS = 100;
const FEEDBACK_DURATION_MS = 1200;
export interface State {
    copySuccess?: boolean;
    showFeedback?: boolean;
    timeoutIds: number[];
}
export interface Props {
    data?: string;
    disabled?: boolean;
    checkProtected?: () => boolean | undefined;
    onCopy?: (success: boolean, err: Error | undefined) => void;
    itemType?: LockedItemType.BankAccount | LockedItemType.CreditCard | LockedItemType.Password;
    itemId?: string;
    buttonId?: string;
}
class CopyToClipboardComponent extends Component<Props & ProtectedItemsUnlockerProps & InjectedTranslateProps, State> {
    public constructor(props: Props & ProtectedItemsUnlockerProps & InjectedTranslateProps) {
        super(props);
        this.state = {
            copySuccess: undefined,
            showFeedback: false,
            timeoutIds: [],
        };
    }
    public componentWillUnmount() {
        this.state.timeoutIds.map((timeoutId) => window.clearTimeout(timeoutId));
    }
    private copyText = () => {
        if (!this.props.data) {
            return;
        }
        navigator.clipboard.writeText(this.props.data).then(() => {
            this._onCopyDone(true);
        }, (err) => {
            this._onCopyDone(false, err);
        });
    };
    private scheduleFeedback = () => {
        const showFeedbackTimeoutId = window.setTimeout(() => {
            this.setState({ showFeedback: true });
        }, FEEDBACK_DELAY_MS);
        const hideFeedbackTimeoutId = window.setTimeout(() => {
            this.setState({ showFeedback: false, copySuccess: undefined });
        }, FEEDBACK_DELAY_MS + FEEDBACK_DURATION_MS);
        this.setState({
            timeoutIds: [showFeedbackTimeoutId, hideFeedbackTimeoutId],
        });
    };
    private _onCopyDone(success: boolean, err?: Error | undefined) {
        if (this.state.copySuccess) {
            return;
        }
        if (this.props.onCopy) {
            this.props.onCopy(success, err);
        }
        this.setState({ copySuccess: success });
    }
    private doCopy = () => {
        this.scheduleFeedback();
        this.copyText();
    };
    private handleClick = () => {
        const isCopyLocked = this.props.checkProtected?.() || false;
        if (isCopyLocked) {
            if (this.props.itemId) {
                return this.props.openProtectedItemsUnlocker({
                    successCallback: () => this.doCopy(),
                    action: UnlockerAction.Copy,
                    itemType: LockedItemType.Password,
                    credentialId: this.props.itemId,
                    showNeverAskOption: true,
                });
            }
            else if (!(this.props.itemType === LockedItemType.Password)) {
                return this.props.openProtectedItemsUnlocker({
                    successCallback: () => this.doCopy(),
                    action: UnlockerAction.Copy,
                    itemType: this.props.itemType ?? LockedItemType.BankAccount,
                });
            }
        }
        this.doCopy();
    };
    public render() {
        const _ = this.props.translate.namespace('webapp_credential_edition_field_');
        const isFeedbackDisplayed = this.state.showFeedback && typeof this.state.copySuccess !== 'undefined';
        const feedbackMood = this.state.copySuccess ? 'positive' : 'danger';
        const label = (<div className={styles.label} title={_('generic_action_copy')}>
        
        <span>{isFeedbackDisplayed || <Icon name="ActionCopyOutlined"/>}</span>

        
        <div className={styles.iconWrapper}>
          {isFeedbackDisplayed &&
                (this.state.copySuccess ? (<img src={iconOk}/>) : (<img src={iconNotOk}/>))}
        </div>
        <span className={styles.feedbackLegend}>
          {isFeedbackDisplayed &&
                this.state.copySuccess &&
                _('generic_action_copy_feedback_ok')}
        </span>
      </div>);
        return (<Button id={this.props.buttonId} mood={isFeedbackDisplayed ? feedbackMood : 'brand'} intensity={isFeedbackDisplayed ? 'catchy' : 'supershy'} disabled={this.props.disabled} onClick={this.handleClick} title={_('generic_action_copy')} tooltip={_('generic_action_copy')}>
        {label}
      </Button>);
    }
}
export const CopyToClipboardButton = withProtectedItemsUnlocker(withTranslate(CopyToClipboardComponent));

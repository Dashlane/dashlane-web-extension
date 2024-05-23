import { CheckCircleIcon, colors, FlexContainer, InfoCircleIcon, jsx, LoadingIcon, Paragraph, } from '@dashlane/ui-components';
import { Toggle } from '@dashlane/design-system';
import { Component } from 'react';
import styles from './styles.css';
const { grey00, accessibleValidatorGreen, accessibleValidatorRed } = colors;
export interface Props {
    value: boolean;
    isLoading?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    disabledFeedbackMessage?: string | null;
    saveValueFunction: (value: boolean) => Promise<void>;
    successMessage?: string;
    savingMessage?: string;
    ariaLabelledBy?: string;
    genericErrorMessage: string;
}
interface State {
    isSavingField: boolean;
    errorMessage: string;
    showSaveFieldFeedbackMessage: boolean;
}
export default class SwitchWithFeedback extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isSavingField: false,
            errorMessage: '',
            showSaveFieldFeedbackMessage: false,
        };
    }
    private handleSwitchToggled = async () => {
        this.setState({ isSavingField: true });
        try {
            await this.props.saveValueFunction(this.props.value);
            this.setState({
                errorMessage: '',
                showSaveFieldFeedbackMessage: true,
            });
            setTimeout(() => {
                this.setState({ showSaveFieldFeedbackMessage: false });
            }, 1000);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : this.props.genericErrorMessage;
            this.setState({
                errorMessage,
                showSaveFieldFeedbackMessage: false,
            });
        }
        finally {
            this.setState({
                isSavingField: false,
            });
        }
    };
    private isDisabled = (): boolean => {
        return (this.props.isDisabled || this.state.isSavingField);
    };
    FEEDBACK_MESSAGE_TYPE = {
        SAVING: {
            textColor: accessibleValidatorGreen,
            messageIcon: (<LoadingIcon color={accessibleValidatorGreen} size={20} sx={{ mr: '2px' }}/>),
        },
        SAVED: {
            textColor: accessibleValidatorGreen,
            messageIcon: (<CheckCircleIcon size={22} color={accessibleValidatorGreen}/>),
        },
        ERROR: {
            textColor: accessibleValidatorRed,
            messageIcon: undefined,
        },
        DISABLED: {
            textColor: grey00,
            messageIcon: <InfoCircleIcon size={20}/>,
        },
    };
    private getFeedbackMessage = () => {
        if (this.state.isSavingField) {
            return {
                feedbackMessage: this.props.savingMessage,
                feedbackMessageType: this.FEEDBACK_MESSAGE_TYPE.SAVING,
            };
        }
        if (this.state.showSaveFieldFeedbackMessage) {
            return {
                feedbackMessage: this.props.successMessage,
                feedbackMessageType: this.FEEDBACK_MESSAGE_TYPE.SAVED,
            };
        }
        if (this.props.isDisabled) {
            return {
                feedbackMessage: this.props.disabledFeedbackMessage,
                feedbackMessageType: this.FEEDBACK_MESSAGE_TYPE.DISABLED,
            };
        }
        return {
            feedbackMessage: this.state.errorMessage,
            feedbackMessageType: this.FEEDBACK_MESSAGE_TYPE.ERROR,
        };
    };
    public render() {
        const { feedbackMessage, feedbackMessageType } = this.getFeedbackMessage();
        const nativeProps = this.isDisabled()
            ? {
                'aria-disabled': true,
            }
            : {};
        const isChecked = this.props.value;
        return (<div className={styles.switchContainer} {...nativeProps}>
        {this.props.isLoading && !this.state.isSavingField ? (<LoadingIcon size={25} color="ds.border.brand.standard.idle"/>) : (<Toggle aria-labelledby={this.props.ariaLabelledBy} checked={isChecked} onChange={this.handleSwitchToggled} disabled={this.isDisabled()} readOnly={this.props.isReadOnly}/>)}
        {feedbackMessage ? (<FlexContainer alignItems="center" flexDirection="row" sx={{ height: '22px' }} className={this.props.isDisabled ? styles.errorFeedbackContainer : undefined}>
            {feedbackMessageType.messageIcon}
            <Paragraph size="x-small" color={feedbackMessageType.textColor} sx={{ ml: '5px', flex: 1, lineHeight: 0 }}>
              {feedbackMessage}
            </Paragraph>
          </FlexContainer>) : null}
      </div>);
    }
}

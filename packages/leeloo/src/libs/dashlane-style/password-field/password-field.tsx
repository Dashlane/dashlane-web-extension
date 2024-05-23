import * as React from 'react';
import { TextField } from 'libs/dashlane-style/text-field/text-field';
import { browser } from '@dashlane/browser-utils';
import classnames from 'classnames';
import styles from './styles/index.css';
import InlineEyeIcon from './icon-eye.svg?inline';
export interface Props {
    autoFocus?: boolean;
    className?: string;
    defaultValue?: string;
    errorText: string | null;
    floatingLabelText?: string;
    hintText: string;
    id?: string;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
    style?: React.CSSProperties;
    hintStyle?: React.CSSProperties;
    onTogglePassword?: (showPassword: boolean) => void;
    showLabel: string;
    hideLabel: string;
    keepHintArea?: boolean;
}
interface PasswordFieldIState {
    showPassword?: boolean;
}
export class PasswordField extends React.Component<Props, PasswordFieldIState> {
    private textfield = React.createRef<TextField>();
    public constructor(props: Props) {
        super(props);
        this.state = {
            showPassword: false,
        };
    }
    public focus() {
        if (this.textfield.current) {
            this.textfield.current.focus();
        }
    }
    public getValue() {
        return this.textfield.current ? this.textfield.current.getValue() : '';
    }
    private toggleShow = (event: React.MouseEvent<HTMLElement>) => {
        if (this.props.onTogglePassword) {
            this.props.onTogglePassword(!this.state.showPassword);
        }
        else {
            this.focus();
        }
        this.setState({
            showPassword: !this.state.showPassword,
        });
        event.preventDefault();
    };
    public render() {
        const inputClassName = classnames({
            [styles.chromeInput]: !this.state.showPassword && browser.isChrome(),
            [styles.edgeInput]: browser.isChromiumEdge() || browser.isEdge(),
        });
        const asideElement = (<button tabIndex={-1} className={classnames(styles.inputButton, {
                [styles.withoutLabel]: !this.props.floatingLabelText,
            })} onClick={this.toggleShow} type="button">
        <InlineEyeIcon className={styles.inputButtonIcon}/>
        {this.state.showPassword ? this.props.hideLabel : this.props.showLabel}
      </button>);
        return (<div className={styles.field} style={this.props.style}>
        <TextField keepHintArea={this.props.keepHintArea} autoFocus={this.props.autoFocus} placeholder={this.props.hintText} labelText={this.props.floatingLabelText} ref={this.textfield} defaultValue={this.props.defaultValue} id={this.props.id} asideElement={asideElement} onBlur={this.props.onBlur} onFocus={this.props.onFocus} onChange={this.props.onChange} onKeyDown={this.props.onKeyDown} errorText={this.props.errorText} inputClassName={inputClassName} type={this.state.showPassword ? 'text' : 'password'}/>
      </div>);
    }
}

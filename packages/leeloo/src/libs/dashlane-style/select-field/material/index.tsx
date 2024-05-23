import * as React from 'react';
import { omit } from 'lodash';
import styles from './style.css';
interface SelectOptionProps extends React.HTMLAttributes<HTMLElement> {
    primaryText?: React.ReactNode;
    value?: string;
    disabled?: boolean;
}
export const OptionField = (props: SelectOptionProps) => {
    const attributes = omit(props, ['primaryText']);
    return (<option className={styles.option} {...attributes}>
      {props.primaryText}
    </option>);
};
export interface MaterialUiOnChangeCallback {
    (event: React.FormEvent<HTMLInputElement>, index: number, value: string): void;
}
interface SelectFieldProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode[];
    autoWidth?: boolean;
    errorStyle?: React.CSSProperties;
    errorText?: React.ReactNode;
    floatingLabelStyle?: React.CSSProperties;
    floatingLabelText?: React.ReactNode;
    hintStyle?: React.CSSProperties;
    hintText?: React.ReactNode;
    onChangeExtended?: MaterialUiOnChangeCallback;
    style?: React.CSSProperties;
    successText?: string;
    disabled?: boolean;
    value?: string;
}
interface State {
    isFocused: boolean;
}
export class SelectField extends React.Component<SelectFieldProps, State> {
    constructor(props: SelectFieldProps) {
        super(props);
        this.state = { isFocused: false };
    }
    protected onChange(event: React.FormEvent<HTMLInputElement>) {
        if (this.props.onChange) {
            this.props.onChange(event);
        }
        const selectElement = event.target as any;
        if (!selectElement) {
            return;
        }
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        if (!selectedOption) {
            return;
        }
        if (this.props.onChangeExtended) {
            this.props.onChangeExtended(event, selectElement.selectedIndex as number, selectedOption.value as string);
        }
    }
    protected onFocus(event: React.FocusEvent<HTMLInputElement>) {
        if (this.props.onFocus) {
            this.props.onFocus(event);
        }
        this.setState({ isFocused: true });
    }
    protected onBlur(event: React.FocusEvent<HTMLInputElement>) {
        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
        this.setState({ isFocused: false });
    }
    public render() {
        const attributes = omit(this.props, [
            'onChange',
            'onChangeExtended',
            'onFocus',
            'onBlur',
            'children',
            'errorStyle',
            'errorText',
            'floatingLabelStyle',
            'floatingLabelText',
            'hintStyle',
            'hintText',
            'style',
            'successText',
        ]);
        const hasError = !!this.props.errorText;
        const hasSuccess = !!this.props.successText;
        const containerClass = [
            styles.container,
            this.props.disabled ? styles.disabled : '',
            this.state.isFocused ? styles.focus : '',
            hasError ? styles.error : '',
            hasSuccess ? styles.success : '',
        ].join(' ');
        const label = this.props.floatingLabelText && (<label className={styles.label} style={this.props.floatingLabelStyle}>
        {this.props.floatingLabelText}
      </label>);
        const hint = ((!this.props.value && this.props.hintText) ||
            hasSuccess ||
            hasError) && (<span className={styles.hint} style={this.props.hintStyle}>
        {this.props.errorText || this.props.successText || this.props.hintText}
      </span>);
        return (<div className={containerClass} style={this.props.style}>
        {label}

        <select className={styles.select} onChange={this.onChange.bind(this)} onFocus={this.onFocus.bind(this)} onBlur={this.onBlur.bind(this)} {...attributes}>
          {this.props.children}
        </select>

        <div>
          <hr className={styles.firstLine}/>
          <hr className={styles.secondLine}/>
        </div>

        {hint}
      </div>);
    }
}

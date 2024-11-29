import * as React from "react";
import { omit } from "lodash";
import classnames from "classnames";
import styles from "./style.css";
const TEXTAREA_DEFAULT_FONT_SIZE = 16;
export interface Props {
  asideElement?: React.ReactNode;
  autoFocus?: boolean;
  children?: React.ReactNode | React.ReactNodeArray;
  className?: string;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
  defaultValue?: string;
  errorStyle?: React.CSSProperties;
  errorText?: React.ReactNode;
  fieldContainerStyle?: React.CSSProperties;
  hasHorizontalScroll?: boolean;
  hintStyle?: React.CSSProperties;
  hintText?: React.ReactNode;
  id?: string;
  inputStyle?: React.CSSProperties;
  inputClassName?: string;
  isDisabled?: boolean;
  labelStyle?: React.CSSProperties;
  labelText?: React.ReactNode;
  multiLine?: boolean;
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  placeholder?: string;
  placeholderIcon?: React.ReactSVGElement;
  style?: React.CSSProperties;
  successText?: React.ReactNode;
  textareaStyle?: React.CSSProperties;
  type?: string;
  value?: string;
  keepHintArea?: boolean;
}
interface TextFieldState {
  rowCount: number;
  rowHeight: number;
  value?: string;
}
const DEFAULT_ROW_COUNT = 4;
export class TextField extends React.Component<Props, TextFieldState> {
  private _field: HTMLInputElement | HTMLTextAreaElement | null;
  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.defaultValue,
      rowHeight: this.calculateRowHeight(props.textareaStyle),
      rowCount: this.calculateRowCount(props.defaultValue),
    };
  }
  protected updateValue(newValue: string): void {
    this.setState({
      value: newValue,
    });
    if (this.props.multiLine) {
      this.setState({
        rowCount: this.calculateRowCount(newValue),
      });
    }
  }
  protected handleFieldChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { target } = event;
    if (this.props.onChange) {
      this.props.onChange(event);
    }
    this.updateValue(target.value);
  }
  protected handleFieldFocus(event: React.FocusEvent<HTMLFormElement>) {
    if (this.props.isDisabled) {
      return;
    }
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  }
  protected handleFieldBlur(event: React.FocusEvent<HTMLFormElement>) {
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  }
  protected handleOnKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }
  };
  protected calculateRowCount(defaultValue?: string): number {
    if (!this.props.multiLine || !defaultValue) {
      return DEFAULT_ROW_COUNT;
    }
    return (defaultValue.match(/\n/g) || []).length + 3;
  }
  protected calculateRowHeight(textareaStyle?: React.CSSProperties): number {
    if (
      !textareaStyle ||
      typeof textareaStyle.fontSize !== "number" ||
      typeof textareaStyle.lineHeight !== "number"
    ) {
      return TEXTAREA_DEFAULT_FONT_SIZE;
    }
    return textareaStyle.lineHeight * textareaStyle.fontSize;
  }
  public getValue = (): string => (this._field ? this._field.value : "");
  public blur() {
    if (this._field) {
      this._field.blur();
    }
  }
  public focus() {
    if (this._field) {
      this._field.focus();
    }
  }
  public render() {
    const fieldOtherProps = omit(this.props, [
      "children",
      "asideElement",
      "keepHintArea",
      "inputClassName",
      "containerClassName",
      "containerStyle",
      "defaultValue",
      "errorStyle",
      "errorText",
      "fieldContainerStyle",
      "hasHorizontalScroll",
      "hintStyle",
      "hintText",
      "inputStyle",
      "isDisabled",
      "multiLine",
      "labelStyle",
      "labelText",
      "placeholderIcon",
      "successText",
      "textareaStyle",
      "onBlur",
      "onChange",
      "onFocus",
    ]);
    const containerClassesDynamic = {
      [styles.error]: !!this.props.errorText,
      [styles.noWrap]: this.props.hasHorizontalScroll,
      [styles.success]: !!this.props.successText,
    };
    if (this.props.containerClassName) {
      containerClassesDynamic[this.props.containerClassName] = true;
    }
    const containerClasses = classnames(
      styles.container,
      containerClassesDynamic
    );
    const label = this.props.labelText ? (
      <div className={styles.label} style={this.props.labelStyle}>
        {this.props.labelText}
      </div>
    ) : null;
    const fieldClassesDynamic = {
      [styles.textarea]: this.props.multiLine,
      [styles.input]: !this.props.multiLine,
      [styles.inputWithIcon]: this.props.placeholderIcon,
      [styles.error]: !!this.props.errorText,
    };
    if (this.props.inputClassName) {
      fieldClassesDynamic[this.props.inputClassName] = true;
    }
    const fieldClasses = classnames(styles.field, fieldClassesDynamic);
    const fieldProps = {
      autoFocus: this.props.autoFocus,
      className: fieldClasses,
      defaultValue: this.props.defaultValue,
      disabled: this.props.isDisabled,
      onBlur: this.handleFieldBlur.bind(this),
      onChange: this.handleFieldChange.bind(this),
      onFocus: this.handleFieldFocus.bind(this),
      onKeyDown: this.handleOnKeyDown.bind(this),
      ref: (element: HTMLInputElement | HTMLTextAreaElement | null) =>
        (this._field = element),
      ...fieldOtherProps,
    };
    const decoratorClasses = classnames(styles.fieldDecorator, {
      [styles.fieldDecoratorError]: !!this.props.errorText,
      [styles.fieldDecoratorDisabled]: this.props.isDisabled,
    });
    const inputStyle = {
      ...(this.props.inputStyle || {}),
      ...(this.props.placeholderIcon
        ? {
            backgroundImage: `url(${this.props.placeholderIcon})`,
          }
        : {}),
      ...(this.props.multiLine
        ? {
            height: this.state.rowCount * this.state.rowHeight,
          }
        : {}),
    };
    const hint =
      this.props.keepHintArea ||
      (!this.props.value && this.props.hintText) ||
      this.props.successText ||
      this.props.errorText ? (
        <div className={styles.hint} style={this.props.hintStyle}>
          {this.props.errorText ||
            this.props.successText ||
            this.props.hintText}
        </div>
      ) : null;
    return (
      <div className={containerClasses} style={this.props.containerStyle}>
        {label}
        <div className={decoratorClasses}>
          {this.props.multiLine ? (
            <textarea style={inputStyle} {...fieldProps} />
          ) : (
            <input style={inputStyle} {...fieldProps} />
          )}
          {this.props.asideElement}
        </div>
        {hint}
      </div>
    );
  }
}

import * as React from "react";
import Textarea from "react-textarea-autosize";
import classnames from "classnames";
import { equals } from "ramda";
import { v4 as uuid } from "uuid";
import ReactInputMask from "react-input-mask";
import IntelligentTooltipOnOverflow from "../intelligent-tooltip-on-overflow";
import styles from "./styles.css";
const overrideDefaultCopy = (stringToCopy: string) => {
  navigator.clipboard.writeText(stringToCopy.replaceAll(" ", ""));
};
interface Props {
  label?: string;
  value?: string;
  disabled?: boolean;
  readOnly?: boolean;
  multiLine?: boolean;
  name?: string;
  dataName?: string;
  error?: string | boolean;
  placeholder: string;
  handleFieldBlur?: () => void;
  onFieldKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  type?: string;
  mask?: string;
  maskProps?: {
    maskChar?: string;
  };
  testId?: string;
}
interface MaskManagedProps {
  mask?: string;
  onBlur?: (ev: React.FormEvent<HTMLInputElement>) => void;
  onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  value: string;
}
interface State {
  fieldHtmlId: string;
  selectionRangeStart: number | null;
  selectionRangeEnd: number | null;
}
export default class EditableField extends React.Component<Props, State> {
  public static defaultProps: Partial<Props> = {
    maskProps: {
      maskChar: "",
    },
  };
  public constructor(props: Props) {
    super(props);
    this.state = {
      fieldHtmlId: uuid(),
      selectionRangeStart: null,
      selectionRangeEnd: null,
    };
  }
  public componentDidUpdate() {
    if (
      this.state.selectionRangeStart !== null &&
      this.state.selectionRangeEnd !== null
    ) {
      this.field.setSelectionRange(
        this.state.selectionRangeStart,
        this.state.selectionRangeEnd
      );
    }
  }
  public shouldComponentUpdate(props: Props, state: State) {
    return !(
      equals(this.props.value, props.value) &&
      equals(this.props.error, props.error) &&
      equals(this.props.mask, props.mask) &&
      equals(this.props.label, props.label) &&
      equals(this.state.selectionRangeStart, state.selectionRangeStart) &&
      equals(this.state.selectionRangeEnd, state.selectionRangeEnd)
    );
  }
  private field: HTMLInputElement | HTMLTextAreaElement;
  public getValue() {
    return this.field.value;
  }
  public focus() {
    this.field.focus();
  }
  private getTextarea() {
    return (
      <Textarea
        inputRef={(el: HTMLTextAreaElement) => {
          this.field = el;
        }}
        id={this.state.fieldHtmlId}
        disabled={this.props.disabled}
        value={this.props.value ?? ""}
        name={this.props.name}
        data-name={this.props.dataName}
        sx={{
          borderColor: this.props.error && "ds.border.danger.standard.idle",
        }}
        className={styles.textarea}
        placeholder={this.props.placeholder}
        onBlur={this.props.handleFieldBlur}
        onKeyDown={this.props.onFieldKeyDown}
        onChange={this.handleChange}
        readOnly={this.props.readOnly}
      />
    );
  }
  private getInput() {
    const maskManagedProps: MaskManagedProps = {
      onBlur: this.props.handleFieldBlur,
      onChange: this.handleChange,
      disabled: this.props.disabled,
      readOnly: this.props.readOnly,
      value: this.props.value ?? "",
    };
    const inputProps = {
      ref: (el: HTMLInputElement) => {
        this.field = el;
      },
      id: this.state.fieldHtmlId,
      autoComplete: "off",
      className: classnames(styles.input, {
        [styles.error]: Boolean(this.props.error),
      }),
      sx: {
        ...(this.props.error && {
          "::placeholder": {
            color: "ds.text.danger.quiet",
          },
          minWidth: "fit-content",
        }),
        border: "1px solid",
        borderColor: this.props.error
          ? "ds.border.danger.standard.idle"
          : "transparent",
      },
      name: this.props.name,
      "data-name": this.props.dataName,
      type: this.props.type || "text",
      placeholder: this.props.placeholder,
      onKeyDown: this.props.onFieldKeyDown,
    };
    return this.props.mask ? (
      <ReactInputMask
        {...maskManagedProps}
        {...this.props.maskProps}
        mask={this.props.mask}
        onCopy={() => overrideDefaultCopy(maskManagedProps.value)}
        onCut={() => overrideDefaultCopy(maskManagedProps.value)}
      >
        {(otherInputProps: MaskManagedProps | {}) => (
          <input {...inputProps} {...otherInputProps} />
        )}
      </ReactInputMask>
    ) : (
      <div className={styles.inputRow}>
        <input {...inputProps} {...maskManagedProps} />
        <div
          hidden={!this.props.error || typeof this.props.error !== "string"}
          sx={{
            color: "ds.text.danger.quiet",
          }}
          className={styles.errorMessage}
        >
          {this.props.error}
        </div>
      </div>
    );
  }
  private handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    this.setState({
      selectionRangeStart: event.target.selectionStart,
      selectionRangeEnd: event.target.selectionEnd,
    });
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  };
  public render() {
    const tooltipText =
      this.props.type !== "password"
        ? this.props.value || this.props.placeholder
        : "";
    return (
      <div
        className={classnames(
          styles.container,
          this.props.multiLine ? styles.containerMultiLine : null
        )}
      >
        {this.props.label && (
          <label
            className={styles.label}
            sx={{ color: "ds.text.neutral.catchy" }}
            htmlFor={this.state.fieldHtmlId}
          >
            <span className={styles.text} title={this.props.label}>
              {this.props.label}
            </span>
          </label>
        )}
        <IntelligentTooltipOnOverflow
          tooltipText={tooltipText}
          className={classnames(styles.value, {
            [styles.placeholder]: !this.props.value,
            [styles.multiline]: this.props.multiLine,
          })}
        >
          {this.props.multiLine ? this.getTextarea() : this.getInput()}
        </IntelligentTooltipOnOverflow>
      </div>
    );
  }
}

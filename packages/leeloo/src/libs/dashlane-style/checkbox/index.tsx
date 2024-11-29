import * as React from "react";
import styles from "./style.css";
import classnames from "classnames";
export interface Props {
  ariaLabel?: string;
  defaultChecked?: boolean;
  checked?: boolean;
  disabled?: boolean;
  label?: string | React.ReactNode;
  name?: string;
  onCheck?: (checked: boolean) => void;
  style?: React.CSSProperties;
  labelClass?: string;
}
const INPUT_KEY = "checkbox";
export default class Checkbox extends React.Component<Props> {
  private el = React.createRef<HTMLInputElement>();
  private isChecked = () => Boolean(this.el.current?.checked);
  public render() {
    return (
      <label className={styles.label} style={this.props.style}>
        <div className={styles.checkboxContainer}>
          <input
            key={INPUT_KEY}
            aria-label={this.props.ariaLabel}
            defaultChecked={this.props.defaultChecked}
            checked={this.props.checked}
            disabled={this.props.disabled}
            className={styles.checkbox}
            name={this.props.name}
            onChange={() => {
              if (this.props.onCheck) {
                this.props.onCheck(this.isChecked());
              }
            }}
            ref={this.el}
            type="checkbox"
          />
          <span />
        </div>
        <span className={classnames(styles.text, this.props.labelClass)}>
          {this.props.label}
        </span>
      </label>
    );
  }
}

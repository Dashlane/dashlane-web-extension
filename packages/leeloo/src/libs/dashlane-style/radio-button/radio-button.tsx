import React, { InputHTMLAttributes, Key } from "react";
import classnames from "classnames";
import styles from "./styles.css";
interface RadioButtonProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  children?: React.ReactNode;
  key?: Key;
  value: string;
  name?: string;
  checked?: boolean;
  disabled?: boolean;
  labelClassName?: string;
}
export const RadioButton = ({
  children,
  className,
  key,
  disabled,
  labelClassName,
  ...inputProps
}: RadioButtonProps) => {
  return (
    <label
      key={key}
      className={classnames(
        {
          [styles.disabled]: disabled,
        },
        styles.radioWrapper,
        className
      )}
    >
      <span className={styles.circleContainer}>
        <input disabled={disabled} {...inputProps} type="radio" />
        <span className={styles.check} />
      </span>
      <div className={classnames(styles.radioLabel, labelClassName)}>
        {children}
      </div>
    </label>
  );
};

import * as React from "react";
import classnames from "classnames";
import StandardButton, { ButtonProps } from "./base";
const Button = (
  baseClassName: string,
  baseProps: Partial<ButtonProps> = {}
) => {
  const innerButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (props, ref) => (
      <StandardButton
        buttonRef={ref}
        {...baseProps}
        {...props}
        classNames={[
          baseClassName,
          ...(baseProps.classNames || []),
          ...(props.classNames || []),
        ]}
        spinnerClassName={classnames(
          baseProps.spinnerClassName,
          props.spinnerClassName
        )}
      />
    )
  );
  innerButton.displayName = "InnerButton";
  return innerButton;
};
export default Button;

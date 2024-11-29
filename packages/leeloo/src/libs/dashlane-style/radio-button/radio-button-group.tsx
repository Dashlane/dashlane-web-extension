import { Fragment } from "@dashlane/design-system/jsx-runtime";
import { ChangeEventHandler, Children, cloneElement, Key } from "react";
import { RadioButton } from "./radio-button";
type RadioButtonGroupProps = {
  groupName: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  children: (React.ReactElement | null)[];
  key?: Key;
  disabled?: boolean;
};
export const RadioButtonGroup = (props: RadioButtonGroupProps) => (
  <Fragment key={props.key}>
    {Children.map(props.children, (child) =>
      child !== null && child.type === RadioButton
        ? cloneElement(child, {
            checked: props.value === child.props.value,
            name: props.groupName,
            onChange: props.onChange,
            disabled: props.disabled || child.props.disabled,
          })
        : child
    )}
  </Fragment>
);

import React, { ChangeEventHandler, Fragment, Key } from 'react';
import { RadioButton } from './radio-button';
type RadioButtonGroupProps = {
    groupName: string;
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    children: (React.ReactElement | null)[];
    key?: Key;
    disabled?: boolean;
};
export const RadioButtonGroup = (props: RadioButtonGroupProps) => (<Fragment key={props.key}>
    {React.Children.map(props.children, (child) => child !== null && child.type === RadioButton
        ? React.cloneElement(child, {
            checked: props.value === child.props.value,
            name: props.groupName,
            onChange: props.onChange,
            disabled: props.disabled || child.props.disabled,
        })
        : child)}
  </Fragment>);

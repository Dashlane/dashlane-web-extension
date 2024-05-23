import React from 'react';
import { ButtonsOnHover } from 'libs/dashlane-style/buttons-on-hover';
export const FieldButtonsWrapper = (props: {
    children: React.ReactNode;
    buttons: React.ReactNode;
    showButtonsOnHover: boolean;
}): JSX.Element => {
    if (props.buttons === null) {
        return <>{props.children}</>;
    }
    return (<ButtonsOnHover enabled={props.showButtonsOnHover}>
      {props.children}
      {props.buttons}
    </ButtonsOnHover>);
};

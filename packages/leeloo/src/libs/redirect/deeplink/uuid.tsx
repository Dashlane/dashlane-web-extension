import * as React from 'react';
import { Redirect, RoutesProps, useLocation } from 'libs/router';
export const UUID_REG_EXP_PATH = '{([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})}';
const UUID_REG_EXP = new RegExp(UUID_REG_EXP_PATH);
export const Uuid = (props: RoutesProps) => {
    const location = useLocation();
    const regExpResult = UUID_REG_EXP.exec(location.pathname);
    if (!regExpResult) {
        return null;
    }
    const redirectUrl = `${location.pathname.replace(UUID_REG_EXP, '$1')}${location.search}`;
    return <Redirect to={redirectUrl}/>;
};

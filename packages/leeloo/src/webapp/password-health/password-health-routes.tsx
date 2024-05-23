import * as React from 'react';
import { CustomRoute, RoutesProps } from 'libs/router';
import { PasswordHealth } from './password-health';
export const PasswordHealthRoutes = ({ path }: RoutesProps) => {
    return <CustomRoute path={path} component={PasswordHealth}/>;
};

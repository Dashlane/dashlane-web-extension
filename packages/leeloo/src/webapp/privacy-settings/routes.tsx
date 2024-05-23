import * as React from 'react';
import { CustomRoute, RoutesProps } from 'libs/router';
import { PrivacySettings } from './privacy-settings';
export const PrivacySettingsRoutes = ({ path }: RoutesProps) => {
    return <CustomRoute path={path} component={PrivacySettings}/>;
};

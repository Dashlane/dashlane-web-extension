import * as React from 'react';
import { CustomRoute, RoutesProps } from 'libs/router';
import { DarkWebMonitoring } from './dark-web-monitoring';
export const DarkWebMonitoringRoutes = ({ path }: RoutesProps) => {
    return <CustomRoute path={path} component={DarkWebMonitoring}/>;
};

import * as React from 'react';
import { CustomRoute, RoutesProps } from 'libs/router';
import { SubscriptionPage } from 'webapp/subscription-management/subscription-page';
export const SubscriptionManagementRoutes = ({ path }: RoutesProps) => {
    return <CustomRoute path={path} component={SubscriptionPage}/>;
};

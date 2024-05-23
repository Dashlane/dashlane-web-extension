import * as React from 'react';
import { CustomRoute, RoutesProps } from 'libs/router';
import { FamilyDashboard } from './family-dashboard';
export default function routes({ path }: RoutesProps): JSX.Element {
    return (<CustomRoute path={path} component={FamilyDashboard} additionalProps={{}}/>);
}

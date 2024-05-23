import * as React from 'react';
import { CustomRoute, RoutesProps } from 'libs/router';
import { DashlaneLabs } from './dashlane-labs';
export default function routes({ path }: RoutesProps): JSX.Element {
    return (<CustomRoute path={path} component={DashlaneLabs} additionalProps={{}}/>);
}

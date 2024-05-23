import React from 'react';
import { CustomRoute, RoutesProps } from 'libs/router';
import { PasskeysView } from './passkeys-view';
export const PasskeysRoutes = ({ path }: RoutesProps): JSX.Element => (<CustomRoute path={path} component={PasskeysView}/>);

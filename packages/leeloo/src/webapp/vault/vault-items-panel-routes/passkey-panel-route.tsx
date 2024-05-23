import React, { lazy } from 'react';
import { PanelTransitionRoute, RoutesProps } from 'libs/router';
import { uuidRegex } from './common';
const PasskeyEditPanel = lazy(() => import('webapp/vault/passkeys/passkey-edit').then((module) => ({
    default: module.Connected,
})));
export const PasskeyPanelRoutes = ({ path }: RoutesProps) => (<PanelTransitionRoute path={`${path}*/passkey(s?)/:uuid(${uuidRegex})`} component={PasskeyEditPanel}/>);

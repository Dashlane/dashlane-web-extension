import React, { lazy } from 'react';
import { PanelTransitionRoute, RoutesProps } from 'libs/router';
import { useNavigateBack, uuidRegex } from './common';
const SecretAddPanel = lazy(() => import('webapp/secrets/add/secret-add').then((module) => ({
    default: module.SecretAddPanel,
})));
const SecretEditPanel = lazy(() => import('webapp/secrets/edit/secret-edit').then((module) => ({
    default: module.SecretEditPanel,
})));
export const SecretPanelRoutes = ({ path }: RoutesProps) => {
    const { routes, navigateBack } = useNavigateBack();
    return (<>
      <PanelTransitionRoute path={`${path}*/secret(s?)/add`} component={SecretAddPanel} additionalProps={{
            onClose: () => navigateBack(routes.userSecrets),
        }}/>
      <PanelTransitionRoute path={`${path}*/secret(s?)/:uuid(${uuidRegex})`} component={SecretEditPanel} additionalProps={{
            onClose: () => navigateBack(routes.userSecrets),
        }}/>
    </>);
};

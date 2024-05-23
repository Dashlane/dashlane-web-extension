import React, { Suspense } from 'react';
import { RoutesProps } from 'libs/router';
import { VaultItemPanelsErrorBoundaryRedirect } from './vault-item-panels-error-boundary-redirect';
import { CredentialPanelRoutes } from './credential-panel-routes';
import { IdsPanelRoutes } from './ids-panel-routes';
import { PasskeyPanelRoutes } from './passkey-panel-route';
import { PaymentPanelRoutes } from './payment-panel-routes';
import { PersonalInfoPanelRoutes } from './personal-info-panel-routes';
import { SecureNotePanelRoutes } from './secure-note-panel-routes';
import { SecretPanelRoutes } from './secret-panel-routes';
export const VaultItemsPanelRoutes = ({ path }: RoutesProps) => {
    return (<VaultItemPanelsErrorBoundaryRedirect redirectPath={path}>
      <Suspense fallback={null}>
        <CredentialPanelRoutes path={path}/>
        <IdsPanelRoutes path={path}/>
        <PasskeyPanelRoutes path={path}/>
        <PaymentPanelRoutes path={path}/>
        <PersonalInfoPanelRoutes path={path}/>
        <SecretPanelRoutes path={path}/>
        <SecureNotePanelRoutes path={path}/>
      </Suspense>
    </VaultItemPanelsErrorBoundaryRedirect>);
};

import { lazy } from "react";
import { PanelTransitionRoute, RoutesProps } from "../../libs/router";
import { uuidRegex } from "./common";
const PanelWrapper = lazy(() =>
  import("../ids/routes/wrapper/panel-wrapper").then((module) => ({
    default: module.PanelWrapper,
  }))
);
const DriverLicenseAddPanel = lazy(() =>
  import("../ids/add/documents/driver-license").then((module) => ({
    default: module.DriverLicenseAddPanel,
  }))
);
const DriverLicenseEditPanel = lazy(() =>
  import("../ids/edit/documents/driver-license").then((module) => ({
    default: module.DriverLicenseEditPanel,
  }))
);
const FiscalIdAddPanel = lazy(() =>
  import("../ids/add/documents/fiscal-id").then((module) => ({
    default: module.FiscalIdAddPanel,
  }))
);
const FiscalIdEditPanel = lazy(() =>
  import("../ids/edit/documents/fiscal-id").then((module) => ({
    default: module.FiscalIdEditPanel,
  }))
);
const IdCardAddPanel = lazy(() =>
  import("../ids/add/documents/id-card").then((module) => ({
    default: module.IdCardAddPanel,
  }))
);
const IdCardEditPanel = lazy(() =>
  import("../ids/edit/documents/id-card").then((module) => ({
    default: module.IdCardEditPanel,
  }))
);
const PassportAddPanel = lazy(() =>
  import("../ids/add/documents/passport").then((module) => ({
    default: module.PassportAddPanel,
  }))
);
const PassportEditPanel = lazy(() =>
  import("../ids/edit/documents/passport").then((module) => ({
    default: module.PassportEditPanel,
  }))
);
const SocialSecurityIdAddPanel = lazy(() =>
  import("../ids/add/documents/social-security-id").then((module) => ({
    default: module.SocialSecurityIdAddPanel,
  }))
);
const SocialSecurityIdEditPanel = lazy(() =>
  import("../ids/edit/documents/social-security-id").then((module) => ({
    default: module.SocialSecurityIdEditPanel,
  }))
);
export const IdsPanelRoutes = ({ path }: RoutesProps) => (
  <>
    <PanelTransitionRoute
      path={`${path}*/driver-license(s?)/add`}
      component={PanelWrapper}
      additionalProps={{
        component: DriverLicenseAddPanel,
      }}
    />
    <PanelTransitionRoute
      path={`${path}*/driver-license(s?)/:uuid(${uuidRegex})`}
      component={PanelWrapper}
      additionalProps={{
        component: DriverLicenseEditPanel,
      }}
    />
    <PanelTransitionRoute
      path={`${path}*/fiscal-id(s?)/add`}
      component={PanelWrapper}
      additionalProps={{
        component: FiscalIdAddPanel,
      }}
    />
    <PanelTransitionRoute
      path={`${path}*/fiscal-id(s?)/:uuid(${uuidRegex})`}
      component={PanelWrapper}
      additionalProps={{
        component: FiscalIdEditPanel,
      }}
    />
    <PanelTransitionRoute
      path={`${path}*/id-card(s?)/add`}
      component={PanelWrapper}
      additionalProps={{
        component: IdCardAddPanel,
      }}
    />
    <PanelTransitionRoute
      path={`${path}*/id-card(s?)/:uuid(${uuidRegex})`}
      component={PanelWrapper}
      additionalProps={{
        component: IdCardEditPanel,
      }}
    />
    <PanelTransitionRoute
      path={`${path}*/passport(s?)/add`}
      component={PanelWrapper}
      additionalProps={{
        component: PassportAddPanel,
      }}
    />
    <PanelTransitionRoute
      path={`${path}*/passport(s?)/:uuid(${uuidRegex})`}
      component={PanelWrapper}
      additionalProps={{
        component: PassportEditPanel,
      }}
    />
    <PanelTransitionRoute
      path={`${path}*/social-security-id(s?)/add`}
      component={PanelWrapper}
      additionalProps={{
        component: SocialSecurityIdAddPanel,
      }}
    />
    <PanelTransitionRoute
      path={`${path}*/social-security-id(s?)/:uuid(${uuidRegex})`}
      component={PanelWrapper}
      additionalProps={{
        component: SocialSecurityIdEditPanel,
      }}
    />
  </>
);

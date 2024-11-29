import { lazy } from "react";
import { PanelTransitionRoute, RoutesProps } from "../../libs/router";
import { uuidRegex } from "./common";
const SecretAddPanel = lazy(() =>
  import("../secrets/add/secret-add-component").then((module) => ({
    default: module.SecretAddPanelComponent,
  }))
);
const SecretEditPanel = lazy(() =>
  import("../secrets/edit/secret-edit").then((module) => ({
    default: module.SecretEditPanel,
  }))
);
export const SecretPanelRoutes = ({ path }: RoutesProps) => {
  return (
    <>
      <PanelTransitionRoute
        path={`${path}*/secret(s?)/add`}
        component={SecretAddPanel}
      />
      <PanelTransitionRoute
        path={`${path}*/secret(s?)/:uuid(${uuidRegex})`}
        component={SecretEditPanel}
      />
    </>
  );
};

import { lazy } from "react";
import { PanelTransitionRoute, RoutesProps } from "../../libs/router";
import { useNavigateBack, uuidRegex } from "./common";
const CredentialEditPanel = lazy(() =>
  import("../credentials/edit/credentials-edit").then((module) => ({
    default: module.CredentialEditPanel,
  }))
);
const CredentialAddPanel = lazy(() =>
  import("../credentials/add/credentials-add").then((module) => ({
    default: module.CredentialAddPanel,
  }))
);
export const CredentialPanelRoutes = ({ path }: RoutesProps) => {
  const { routes, navigateBack } = useNavigateBack();
  return (
    <>
      <PanelTransitionRoute
        path={`${path}*/credential(s?)/add`}
        component={CredentialAddPanel}
        additionalProps={{
          onClose: () => navigateBack(routes.userCredentials),
        }}
      />
      <PanelTransitionRoute
        path={`${path}*/credential(s?)/:uuid(${uuidRegex})`}
        component={CredentialEditPanel}
        additionalProps={{
          onClose: () => navigateBack(routes.userCredentials),
        }}
      />
    </>
  );
};

import * as React from "react";
import {
  PanelTransitionRoute,
  redirect,
  RoutesProps,
  WrappingRoute,
} from "../../libs/router";
import { SharingCenterDataProvider } from ".";
import { GroupPanel } from "./group/panel/group-panel";
import { UserPanel } from "./sharing-users/panel/user-panel";
const uuidRegex = "[-a-zA-Z\\d]{36}";
export const SharingCenterRoutes = ({ path }: RoutesProps): JSX.Element => {
  const closeEditPanel = () => {
    redirect(path);
  };
  return (
    <WrappingRoute
      path={[path, `${path}/group/:uuid`, `${path}/user/:id`]}
      component={SharingCenterDataProvider}
    >
      <PanelTransitionRoute
        exact
        path={`${path}/group/:uuid(${uuidRegex})`}
        component={GroupPanel}
        additionalProps={{
          onClose: closeEditPanel,
        }}
      />
      <PanelTransitionRoute
        exact
        path={`${path}/user/:id`}
        component={UserPanel}
        additionalProps={{
          onClose: closeEditPanel,
        }}
      />
    </WrappingRoute>
  );
};

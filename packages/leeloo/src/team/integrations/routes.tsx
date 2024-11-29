import {
  CustomRoute,
  RoutesProps,
  Switch,
  WrappingRoute,
} from "../../libs/router";
import { TeamIntegrationsRoutes } from "../../app/routes/constants";
import { SsoRoutes } from "../settings/sso-routes/sso-routes";
import { DirectorySync } from "../settings/directory-sync/routes";
import { Integrations } from "./integrations";
import { shouldRenderRouteForPermission } from "../routes";
import { SiemSettings } from "../settings/siem/siem-settings";
import { NudgesSettings } from "../settings/nudges/nudges-settings";
export default function routes({ path }: RoutesProps): JSX.Element {
  return (
    <WrappingRoute path={path} permission={(p) => p.adminAccess.hasFullAccess}>
      <Switch>
        <CustomRoute
          exact
          component={Integrations}
          path={`${path}`}
          permission={(p) => shouldRenderRouteForPermission("FULL", p)}
          redirectPath={`${path}`}
        />
        <CustomRoute
          path={`${path}${TeamIntegrationsRoutes.DIRECTORY_SYNC}`}
          component={DirectorySync}
        />
        <CustomRoute
          path={`${path}${TeamIntegrationsRoutes.SSO}`}
          component={SsoRoutes}
        />
        <CustomRoute
          path={`${path}${TeamIntegrationsRoutes.SIEM}`}
          component={SiemSettings}
        />
        <CustomRoute
          path={`${path}${TeamIntegrationsRoutes.NUDGES}`}
          component={NudgesSettings}
        />
      </Switch>
    </WrappingRoute>
  );
}

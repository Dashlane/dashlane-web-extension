import {
  CustomRoute,
  Redirect,
  RoutesProps,
  Switch,
  WrappingRoute,
} from "../../libs/router";
import { TeamSettingsRoutes } from "../../app/routes/constants";
import DuoSettings from "./duo";
import duoSettingsReducer from "./duo/reducer";
import MasterPasswordPoliciesSettings from "./master-password-policies";
import masterPasswordPoliciesSettingsReducer from "./master-password-policies/reducer";
import { PoliciesSettings } from "./policies/policies-settings";
export default function routes({ path }: RoutesProps): JSX.Element {
  return (
    <WrappingRoute path={path} permission={(p) => p.adminAccess.hasFullAccess}>
      <Switch>
        <Redirect
          exact
          from={path}
          to={`${path}${TeamSettingsRoutes.POLICIES}`}
        />
        <CustomRoute
          path={`${path}${TeamSettingsRoutes.POLICIES}`}
          component={PoliciesSettings}
        />
        <CustomRoute
          path={`${path}${TeamSettingsRoutes.DUO}`}
          component={DuoSettings}
          reducer={duoSettingsReducer}
        />
        <CustomRoute
          path={`${path}${TeamSettingsRoutes.MASTER_PASSWORD_POLICIES}`}
          component={MasterPasswordPoliciesSettings}
          reducer={masterPasswordPoliciesSettingsReducer}
        />
      </Switch>
    </WrappingRoute>
  );
}

import { CustomRoute, Redirect, RoutesProps, Switch } from "../../libs/router";
import { Settings } from "./settings";
import { SettingTab } from "./types";
export const SettingsRoutes = ({ path }: RoutesProps) => {
  return (
    <Switch>
      <CustomRoute
        exact
        path={`${path}/:settingTab(${Object.values(SettingTab).join("|")})`}
        component={Settings}
      />
      <Redirect path={path} to={`${path}/${SettingTab.Privacy}`} />
    </Switch>
  );
};

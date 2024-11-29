import * as React from "react";
import {
  CustomRoute,
  Redirect,
  RoutesProps,
  Switch,
  WrappingRoute,
} from "../../libs/router";
import RecentActivity from "./recent";
import RequestsActivity from "./requests";
export default function routes({ path }: RoutesProps): JSX.Element {
  return (
    <WrappingRoute
      path={[path, `${path}/recent`, `${path}/requests`]}
      permission={(p) => p.adminAccess.hasFullAccess}
    >
      <Switch>
        <Redirect exact from={`${path}/`} to={`${path}/recent`} />
        <CustomRoute path={`${path}/requests`} component={RequestsActivity} />
        <CustomRoute path={`${path}/recent`} component={RecentActivity} />
      </Switch>
    </WrappingRoute>
  );
}

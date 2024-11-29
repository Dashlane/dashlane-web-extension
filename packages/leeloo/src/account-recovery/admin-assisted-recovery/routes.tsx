import * as React from "react";
import {
  CustomRoute,
  Redirect,
  RoutesProps,
  Switch,
  WrappingRoute,
} from "../../libs/router";
import { VerifyAccountScreen } from "./verify-account-screen/verify-account-screen";
import { CreateMasterPasswordScreen } from "./create-master-password-screen/create-master-password-screen";
import { RecoveryRequestScreen } from "./recovery-request-screen/recovery-request-screen";
import { AccountRecoveryPending } from "./recovery-pending/recovery-pending";
import { ChangeMasterPasswordProgress } from "../../webapp/change-master-password-progress/change-master-password-progress";
export default function routes({ path }: RoutesProps): JSX.Element {
  return (
    <WrappingRoute path={path}>
      <Switch>
        <Redirect exact from={`${path}/`} to={`${path}/device-registration`} />
        <CustomRoute
          permission={(p) => !p.loggedIn}
          redirectPath="/"
          exact
          path={`${path}/device-registration`}
          component={VerifyAccountScreen}
        />
        <CustomRoute
          permission={(p) => !p.loggedIn}
          redirectPath="/"
          exact
          path={`${path}/create-master-password`}
          component={CreateMasterPasswordScreen}
        />
        <CustomRoute
          permission={(p) => !p.loggedIn}
          redirectPath="/"
          exact
          path={`${path}/send-request`}
          component={RecoveryRequestScreen}
        />
        <CustomRoute
          permission={(p) => !p.loggedIn}
          redirectPath="/"
          exact
          path={`${path}/pending-request`}
          component={AccountRecoveryPending}
        />
        <CustomRoute
          exact
          path={`${path}/change-master-password`}
          component={ChangeMasterPasswordProgress}
        />
      </Switch>
    </WrappingRoute>
  );
}

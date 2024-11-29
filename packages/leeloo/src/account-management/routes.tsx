import React from "react";
import { CustomRoute, Route, RoutesProps } from "../libs/router";
import { ChangeLoginEmailContainer } from "./change-login-email/change-login-email-container";
export const AccountManagementRoutes = ({ path }: RoutesProps) => {
  return (
    <Route path={path}>
      <CustomRoute path={path} component={ChangeLoginEmailContainer} />
    </Route>
  );
};

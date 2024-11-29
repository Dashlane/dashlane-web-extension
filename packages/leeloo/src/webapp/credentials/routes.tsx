import React from "react";
import { CustomRoute, RoutesProps } from "../../libs/router";
import { CredentialsView } from "./credentials-view";
export const CredentialsRoutes = ({ path }: RoutesProps): JSX.Element => (
  <CustomRoute path={path} component={CredentialsView} />
);

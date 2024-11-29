import React from "react";
import { CustomRoute, RoutesProps } from "../../libs/router";
import { Secrets } from "./secrets";
export const SecretsRoutes = ({ path }: RoutesProps): JSX.Element => (
  <CustomRoute path={path} component={Secrets} isB2BCapabilityRestricted />
);

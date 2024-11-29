import React from "react";
import { CustomRoute, RoutesProps } from "../../libs/router";
import { PersonalInfo } from "./personal-info";
export const PersonalInfoRoutes = ({ path }: RoutesProps): JSX.Element => (
  <CustomRoute path={path} component={PersonalInfo} />
);

import React from "react";
import { CustomRoute, RoutesProps } from "../../libs/router";
import { Payments } from "./payments";
export const PaymentsRoutes = ({ path }: RoutesProps): JSX.Element => (
  <CustomRoute path={path} component={Payments} />
);

import * as React from "react";
import { VpnPage } from "./vpn-page";
import { CustomRoute, RoutesProps } from "../../libs/router";
export const VpnRoutes = ({ path }: RoutesProps) => {
  return <CustomRoute path={path} component={VpnPage} />;
};

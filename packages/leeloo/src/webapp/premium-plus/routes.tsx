import * as React from "react";
import { CustomRoute, RoutesProps } from "../../libs/router";
import { PremiumPlus } from "./premium-plus";
export const PremiumPlusRoutes = ({ path }: RoutesProps) => {
  return <CustomRoute path={path} component={PremiumPlus} />;
};

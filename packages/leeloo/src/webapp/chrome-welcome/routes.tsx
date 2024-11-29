import * as React from "react";
import { CustomRoute, RoutesProps } from "../../libs/router";
import { ChromeWelcome } from "./chrome-welcome";
export const ChromeWelcomeRoutes = ({ path }: RoutesProps) => {
  return <CustomRoute exact path={path} component={ChromeWelcome} />;
};

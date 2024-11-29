import * as React from "react";
import { CustomRoute, RoutesProps } from "../../libs/router";
import { Upsell } from ".";
export default function routes({ path }: RoutesProps): JSX.Element {
  return <CustomRoute path={path} component={Upsell} />;
}

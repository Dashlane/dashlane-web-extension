import * as React from "react";
import { SharingNotifications } from "./sharing-notifications";
import { CustomRoute, RoutesProps } from "../../libs/router";
const additionalProps = { fullPage: true, triggerSync: true };
export default function routes({ path }: RoutesProps): JSX.Element {
  return (
    <CustomRoute
      path={path}
      component={SharingNotifications}
      additionalProps={additionalProps}
    />
  );
}

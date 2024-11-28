import * as React from "react";
import { BreachStatus } from "@dashlane/communication";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { kernel } from "../../../kernel";
import { useBreaches } from "../../../libs/api";
import { DarkWebBreachAlert } from "./alerts/dark-web-breach-alert";
export const OverlayAlertHub = () => {
  const [isDismissed, setIsDismissed] = React.useState(false);
  const breachesQueryResult = useBreaches(BreachStatus.PENDING);
  const pendingBreaches =
    breachesQueryResult.status === DataStatus.Success
      ? breachesQueryResult.data.items
      : [];
  const shouldDisplayDarkWebBreach = pendingBreaches.length > 0;
  const onDismiss = () => {
    setIsDismissed(true);
  };
  const onClick = () => {
    setIsDismissed(true);
    kernel.browser.closePopover();
  };
  if (isDismissed) {
    return null;
  }
  if (shouldDisplayDarkWebBreach) {
    return (
      <DarkWebBreachAlert
        pendingBreaches={pendingBreaches}
        onClick={onClick}
        onDismiss={onDismiss}
      />
    );
  }
  return null;
};

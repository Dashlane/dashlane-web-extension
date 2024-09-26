import { assertUnreachable } from "Helpers/assert-unreachable";
import { IconsEvent } from "DataManagement/Icons/EventStore/types";
import { getInstance as getIconsUpdaterInstance } from "DataManagement/Icons/AppServices/icons-updater-instance";
export const iconsUpdatesHook = async (event: IconsEvent): Promise<boolean> => {
  const iconsUpdater = getIconsUpdaterInstance();
  if (!iconsUpdater) {
    return false;
  }
  switch (event.type) {
    case "breachUpdates":
      return iconsUpdater.handleBreachesUpdates(event.breachesIds);
    case "credentialUpdates":
      return iconsUpdater.handleCredentialUpdates(event.credentialIds);
    case "refresh":
      return iconsUpdater.handleRefreshIcons();
    default:
      return assertUnreachable(event);
  }
};

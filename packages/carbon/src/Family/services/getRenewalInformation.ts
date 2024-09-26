import {
  FamilyRenewalInformation,
  FamilyRenewalPlatform,
} from "@dashlane/communication";
import {
  FamilyStopRenewalPlatform,
  FamilyStopRenewalPlatforms,
  FamilyStopRenewalResult,
  FamilyStopRenewalStates,
} from "Libs/DashlaneApi";
const getPlatform = (
  platform: FamilyStopRenewalPlatform
): FamilyRenewalPlatform => {
  if (platform === FamilyStopRenewalPlatforms.IOS_APP_STORE) {
    return FamilyRenewalPlatform.IOS_APP_STORE;
  } else if (platform === FamilyStopRenewalPlatforms.MAC_STORE) {
    return FamilyRenewalPlatform.MAC_STORE;
  } else if (platform === FamilyStopRenewalPlatforms.PLAY_STORE) {
    return FamilyRenewalPlatform.PLAY_STORE;
  }
  return null;
};
export const getRenewalInformation = (
  stopRenewalResult?: FamilyStopRenewalResult
): FamilyRenewalInformation => {
  if (
    !stopRenewalResult ||
    stopRenewalResult.state === FamilyStopRenewalStates.STOPPED
  ) {
    return {
      showRenewalMessage: false,
    };
  }
  const platformValue = getPlatform(stopRenewalResult.platform);
  if (platformValue) {
    return {
      showRenewalMessage: true,
      platform: platformValue,
    };
  }
  return {
    showRenewalMessage: false,
  };
};

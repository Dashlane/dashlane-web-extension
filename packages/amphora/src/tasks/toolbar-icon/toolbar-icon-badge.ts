import {
  actionSetBadgeBackgroundColor,
  actionSetBadgeText,
} from "@dashlane/webextensions-apis";
import { ApplicationBuildType } from "@dashlane/communication";
import { getApplicationBuildType } from "../../communication/carbon/get-application-build-type";
import { logger } from "../../logs/app-logger";
interface Badge {
  text: string;
  color: string;
}
const BETA_COLOR = "#FFB81C";
function getBadge(applicationBuildType: ApplicationBuildType): Badge | null {
  if (applicationBuildType === "BETA") {
    return {
      text: "BETA",
      color: BETA_COLOR,
    };
  }
  return null;
}
export async function initToolbarIconBadge(): Promise<void> {
  try {
    const applicationBuildType = await getApplicationBuildType();
    const badge = getBadge(applicationBuildType);
    if (badge) {
      void actionSetBadgeText({ text: badge.text });
      void actionSetBadgeBackgroundColor({ color: badge.color });
    }
  } catch (error) {
    logger.warn("Error on initialization of icon toolbar icon badge", {
      error,
    });
  }
}

import { useEffect } from "react";
import {
  changeUser as changeBrazeUser,
  initialize as initializeBraze,
  openSession as openBrazeSession,
  showInAppMessage,
  subscribeToInAppMessage,
} from "@braze/web-sdk";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { useFeatureFlip } from "@dashlane/framework-react";
import { SESSION_FEATURE_FLIPS } from "@dashlane/session-contracts";
import { usePublicUserId } from "../carbon/hooks/usePublicUserId";
import { useIsBrazeContentDisabled } from "../braze/use-is-braze-content-disabled";
export const useBraze = () => {
  const publicUserIdQuery = usePublicUserId();
  const publicUserId =
    publicUserIdQuery.status === DataStatus.Success
      ? publicUserIdQuery.data
      : null;
  const hasBrazeFF = useFeatureFlip(
    SESSION_FEATURE_FLIPS.BrazeWithDesignSystemDev
  );
  const brazeKillSwitchResponse = useIsBrazeContentDisabled();
  const brazeKillSwitchEnabled =
    brazeKillSwitchResponse.status === DataStatus.Success &&
    !!brazeKillSwitchResponse.data;
  useEffect(() => {
    if (publicUserId && hasBrazeFF === false && !brazeKillSwitchEnabled) {
      const brazeApiKey = "__REDACTED__";
      const baseUrl = "__REDACTED__";
      initializeBraze(brazeApiKey, {
        baseUrl,
        allowUserSuppliedJavascript: true,
      });
      subscribeToInAppMessage(function (inAppMessage) {
        showInAppMessage(inAppMessage);
      });
      changeBrazeUser(publicUserId);
      openBrazeSession();
    }
  }, [publicUserId, hasBrazeFF]);
};

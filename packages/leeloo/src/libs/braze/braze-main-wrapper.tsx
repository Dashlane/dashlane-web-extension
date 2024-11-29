import { useEffect, useState } from "react";
import { ControlMessage, ModalMessage, SlideUpMessage } from "@braze/web-sdk";
import { DataStatus, useFeatureFlip } from "@dashlane/framework-react";
import { SESSION_FEATURE_FLIPS } from "@dashlane/session-contracts";
import { BrazeModalWrapper } from "./braze-modal-wrapper";
import { useBraze } from "./braze-provider";
import { BrazeSlideupWrapper } from "./braze-slideup-wrapper";
import { useIsBrazeContentDisabled } from "./use-is-braze-content-disabled";
export const CustomBrazeWrapper = () => {
  const brazeContext = useBraze();
  const [shouldRender, setShouldRender] = useState(false);
  const hasBrazeFF = useFeatureFlip(
    SESSION_FEATURE_FLIPS.BrazeWithDesignSystemDev
  );
  const brazeKillSwitchResponse = useIsBrazeContentDisabled();
  const brazeKillSwitchEnabled =
    brazeKillSwitchResponse.status === DataStatus.Success &&
    !!brazeKillSwitchResponse.data;
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  if (
    !brazeContext.brazeData ||
    brazeContext.brazeData instanceof ControlMessage ||
    !shouldRender ||
    !hasBrazeFF ||
    brazeKillSwitchEnabled
  ) {
    return null;
  }
  const {
    brazeData,
    logBodyClick,
    logButtonClick,
    logImpression,
    messageType,
    flushBrazeData,
  } = brazeContext;
  if (messageType === "modal") {
    return (
      <BrazeModalWrapper
        inAppMessage={brazeData as ModalMessage}
        logButtonClick={logButtonClick}
        logImpression={logImpression}
        flushBrazeData={flushBrazeData}
      />
    );
  }
  if (brazeContext.messageType === "slideup") {
    return (
      <BrazeSlideupWrapper
        inAppMessage={brazeData as SlideUpMessage}
        logBodyClick={logBodyClick}
        logImpression={logImpression}
        flushBrazeData={flushBrazeData}
      />
    );
  }
  brazeContext.showMessage(brazeData);
  return null;
};

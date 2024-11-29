import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  changeUser as changeBrazeUser,
  ControlMessage,
  InAppMessage,
  initialize as initializeBraze,
  logInAppMessageButtonClick,
  logInAppMessageClick,
  logInAppMessageImpression,
  ModalMessage,
  openSession as openBrazeSession,
  removeSubscription,
  showInAppMessage,
  SlideUpMessage,
  subscribeToInAppMessage,
} from "@braze/web-sdk";
import { useModuleQuery } from "@dashlane/framework-react";
import { featureFlipsApi } from "@dashlane/framework-contracts";
import { SESSION_FEATURE_FLIPS } from "@dashlane/session-contracts";
import { usePublicUserId } from "../carbon/hooks/usePublicUserId";
type InAppMessageType = "modal" | "slideup" | "other";
export interface BrazeContextType {
  brazeData: InAppMessage | ControlMessage | null;
  logBodyClick: typeof logInAppMessageClick;
  messageType: InAppMessageType;
  logButtonClick: typeof logInAppMessageButtonClick;
  logImpression: typeof logInAppMessageImpression;
  showMessage: typeof showInAppMessage;
  flushBrazeData: Dispatch<SetStateAction<boolean>>;
}
interface Props {
  children: ReactNode;
}
const defaultValue: BrazeContextType = {
  brazeData: null,
  messageType: "other",
  logBodyClick: logInAppMessageClick,
  logButtonClick: logInAppMessageButtonClick,
  logImpression: logInAppMessageImpression,
  showMessage: showInAppMessage,
  flushBrazeData: () => {},
};
const BrazeContext = createContext<BrazeContextType>(defaultValue);
export const BrazeProvider = ({ children }: Props) => {
  const [brazeData, setBrazeData] = useState<
    InAppMessage | ControlMessage | null
  >(null);
  const [shouldFlushBrazeData, setShouldFlushBrazeData] = useState(false);
  useEffect(() => {
    if (shouldFlushBrazeData) {
      setBrazeData(null);
      setShouldFlushBrazeData(false);
    }
  }, [shouldFlushBrazeData]);
  const publicUserId = usePublicUserId()?.data;
  const { data: featureFlipsData } = useModuleQuery(
    featureFlipsApi,
    "userFeatureFlip",
    { featureFlip: SESSION_FEATURE_FLIPS.BrazeWithDesignSystemDev },
    { initialSkip: !publicUserId },
  );
  const hasBrazeFF = Boolean(featureFlipsData);
  useEffect(() => {
    if (publicUserId && hasBrazeFF) {
      const brazeApiKey = "__REDACTED__";
      const baseUrl = "__REDACTED__";
      initializeBraze(brazeApiKey, {
        baseUrl,
        allowUserSuppliedJavascript: true,
      });
      const subscription = subscribeToInAppMessage(function (inAppMessage) {
        setBrazeData(inAppMessage);
      });
      changeBrazeUser(publicUserId);
      openBrazeSession();
      return () => {
        if (subscription) {
          removeSubscription(subscription);
        }
      };
    }
  }, [publicUserId, hasBrazeFF]);
  const messageType: InAppMessageType =
    brazeData instanceof ModalMessage
      ? "modal"
      : brazeData instanceof SlideUpMessage
        ? "slideup"
        : "other";
  const contextValue = useMemo(
    () => ({
      brazeData,
      messageType,
      logBodyClick: logInAppMessageClick,
      logButtonClick: logInAppMessageButtonClick,
      logImpression: logInAppMessageImpression,
      showMessage: showInAppMessage,
      flushBrazeData: setShouldFlushBrazeData,
    }),
    [brazeData],
  );
  return (
    <BrazeContext.Provider value={contextValue}>
      {children}
    </BrazeContext.Provider>
  );
};
export const useBraze = (): BrazeContextType => {
  return useContext(BrazeContext);
};

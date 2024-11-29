import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  DataStatus,
  useFeatureFlips,
  useModuleQuery,
} from "@dashlane/framework-react";
import {
  PASSWORD_LIMIT_FEATURE_FLIPS,
  passwordLimitApi,
} from "@dashlane/vault-contracts";
import { useLocation } from "../router";
import { PaywallManager, PaywallName } from "../../webapp/paywall";
import { PaywallProps } from "../../webapp/paywall/paywall/generic-paywall";
import { PAYWALL_ROUTES } from "../../webapp/paywall/manager/paywall-manager";
const PASSWORD_NEAR_LIMIT_THRESHOLD = 5;
export interface PaywallInterface {
  openPaywall: (name: PaywallName, mode?: PaywallProps["mode"]) => void;
}
export const PaywallContext = createContext<PaywallInterface>({
  openPaywall: () => {},
});
const DEFAULT_MODE = "popup";
export const usePaywall = () => useContext(PaywallContext);
export type UsePasswordLimitPaywall =
  | {
      isLoading: true;
    }
  | {
      isLoading: false;
      shouldShowNearLimitContent: boolean;
      shouldShowAtOrOverLimitContent: boolean;
      passwordsLeft?: number;
    };
export const usePasswordLimitPaywall = (): UsePasswordLimitPaywall => {
  const retrievedFFs = useFeatureFlips();
  const passwordLimitStatus = useModuleQuery(
    passwordLimitApi,
    "getPasswordLimitStatus"
  );
  if (
    retrievedFFs.status !== DataStatus.Success ||
    passwordLimitStatus.status !== DataStatus.Success
  ) {
    return { isLoading: true };
  }
  const hasFreeFrozenStateFF =
    retrievedFFs.data[PASSWORD_LIMIT_FEATURE_FLIPS.B2CFreeUserFrozenState];
  const { hasLimit } = passwordLimitStatus.data;
  if (!hasLimit) {
    return {
      isLoading: false,
      shouldShowAtOrOverLimitContent: false,
      shouldShowNearLimitContent: false,
    };
  }
  const { passwordsLeft } = passwordLimitStatus.data;
  const shouldShowNearLimitContent =
    passwordsLeft > 0 && passwordsLeft <= PASSWORD_NEAR_LIMIT_THRESHOLD;
  const getShouldShowAtOrOverLimitContent = () => {
    if (hasFreeFrozenStateFF) {
      return passwordsLeft === 0;
    }
    return passwordsLeft <= 0;
  };
  return {
    isLoading: false,
    shouldShowNearLimitContent,
    shouldShowAtOrOverLimitContent: getShouldShowAtOrOverLimitContent(),
    passwordsLeft,
  };
};
export const PaywallProvider: FC = ({ children }) => {
  const location = useLocation();
  const [mode, setMode] = useState<PaywallProps["mode"]>(DEFAULT_MODE);
  const [paywallName, setPaywallName] = useState<PaywallName | undefined>(
    undefined
  );
  const closePaywall = useCallback(() => {
    setPaywallName(undefined);
    if (mode) {
      setMode(DEFAULT_MODE);
    }
  }, [mode]);
  useEffect(() => {
    if (
      !paywallName ||
      Object.values(PAYWALL_ROUTES).includes(location.pathname)
    ) {
      return;
    }
    closePaywall();
  }, [paywallName, location, mode, closePaywall]);
  const { current: contextValue } = useRef({
    openPaywall: (name: PaywallName, mode?: PaywallProps["mode"]) => {
      setPaywallName(name);
      if (mode) {
        setMode(mode);
      }
    },
  });
  return (
    <PaywallContext.Provider value={contextValue}>
      {children}
      <PaywallManager
        paywall={paywallName}
        closePaywall={closePaywall}
        mode={mode}
      />
    </PaywallContext.Provider>
  );
};

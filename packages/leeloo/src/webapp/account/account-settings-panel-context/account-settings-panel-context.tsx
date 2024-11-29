import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useHistory,
  useLocation,
  useRouterGlobalSettingsContext,
} from "../../../libs/router";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Lee } from "../../../lee";
import { removeFromUrl } from "../../../libs/url-utils";
import { logCurrentRoutePageView } from "../../../libs/logs/pageViewUtils";
import { Account } from "../account";
import cssVariables from "../../variables.css";
import accountPanelTransitionStyles from "./account-panel-transition.css";
import styles from "./styles.css";
const panelAnimationDurationMs = parseInt(
  cssVariables["--edit-panel-animation-duration-enter"],
  10
);
export interface Context {
  openAccountPanel: () => void;
  closeAccountPanel: () => void;
}
interface Provider {
  children: ReactNode;
  lee: Lee;
}
const AccountSettingsPanelContext = createContext<Context>({} as Context);
const AccountSettingsPanelProvider = ({ children, lee }: Provider) => {
  const { routes } = useRouterGlobalSettingsContext();
  const { pathname } = useLocation();
  const history = useHistory();
  const [isAccountPanelOpen, setAccountPanelOpen] = useState(false);
  const contextValue = useMemo(
    () => ({
      openAccountPanel: () => setAccountPanelOpen(true),
      closeAccountPanel: () => setAccountPanelOpen(false),
    }),
    []
  );
  useEffect(() => {
    if (pathname.includes("/account-settings")) {
      setAccountPanelOpen(true);
    }
  }, [pathname]);
  const userClosedAccountPanel = (userWasRedirectedToAnotherPage?: boolean) => {
    if (!userWasRedirectedToAnotherPage) {
      logCurrentRoutePageView(pathname, routes);
    }
    if (pathname.includes("/account-settings")) {
      history.push(removeFromUrl(pathname, "/account-settings"));
    }
    setAccountPanelOpen(false);
  };
  const handleClickFamilyDashboard = () => history.push(routes.familyDashboard);
  return (
    <AccountSettingsPanelContext.Provider value={contextValue}>
      {children}

      <TransitionGroup className={styles.sideMenuTransitionGroup}>
        {isAccountPanelOpen && (
          <CSSTransition
            classNames={accountPanelTransitionStyles}
            timeout={panelAnimationDurationMs}
          >
            {isAccountPanelOpen && (
              <Account
                key="for-CSSTransition-account-panel"
                onNavigateOut={userClosedAccountPanel}
                onClickFamilyDashboard={handleClickFamilyDashboard}
                lee={lee}
              />
            )}
          </CSSTransition>
        )}
      </TransitionGroup>
    </AccountSettingsPanelContext.Provider>
  );
};
const useAccountSettingsPanelContext = () =>
  useContext(AccountSettingsPanelContext);
export { AccountSettingsPanelProvider, useAccountSettingsPanelContext };

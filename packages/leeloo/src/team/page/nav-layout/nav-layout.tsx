import React, { useEffect, useState } from "react";
import { throttle } from "lodash";
import { Lee } from "../../../lee";
import { getCurrentTeam } from "../../../libs/carbon/spaces";
import { ExtendTrialDialogFlow } from "../../../libs/trial/trial-dialogs/extend-trial-dialog-flow";
import { FrozenStateDialogProvider } from "../../../libs/frozen-state/frozen-state-dialog-context";
import { useRouterGlobalSettingsContext } from "../../../libs/router";
import { Header } from "../header/Header";
import { Layout } from "../layout/layout";
import { TeamAccountDropdown } from "../account-dropdown/account-dropdown";
import { TeamAdminSidenav } from "../team-admin-sidenav/team-admin-sidenav";
import { TeamAdminSidenavHeader } from "../team-admin-sidenav/TeamAdminSidenavHeader";
import { BottomButton } from "../team-admin-sidenav/components/bottom-button";
import { BannerController } from "../../../libs/banners";
import { AddSeatsSuccessProvider } from "../../account/upgrade-success/upsell-success-context";
const COLLAPSE_THRESHOLD = 1371;
const RESIZE_THROTTLE = 100;
const isUnderCollapseThreshold = () =>
  document.documentElement.clientWidth < COLLAPSE_THRESHOLD;
const initialContextValue = (() => {}) as React.Dispatch<
  React.SetStateAction<JSX.Element | null | undefined>
>;
export const NavBarContext = React.createContext(initialContextValue);
export interface Props {
  lee: Lee;
}
export const NavLayout = ({
  children,
  lee,
}: React.PropsWithChildren<Props>) => {
  const [isCollapsed, setIsCollapsed] = useState(isUnderCollapseThreshold());
  const [navBarChildren, setNavBarChildren] = useState<JSX.Element | null>();
  const { routes } = useRouterGlobalSettingsContext();
  const adminAccess = lee.permission.adminAccess;
  const hasBillingOrFullAccess =
    adminAccess.hasBillingAccess || adminAccess.hasFullAccess;
  useEffect(() => {
    const windowResizeListener = throttle(() => {
      const shouldBeCollapsed = isUnderCollapseThreshold();
      if (shouldBeCollapsed && !isCollapsed) {
        setIsCollapsed(true);
      } else if (!shouldBeCollapsed && isCollapsed) {
        setIsCollapsed(false);
      }
    }, RESIZE_THROTTLE);
    window.addEventListener("resize", windowResizeListener);
    return () => window.removeEventListener("resize", windowResizeListener);
  }, [isCollapsed]);
  const team = getCurrentTeam(lee.globalState);
  const header = (
    <Header>
      {navBarChildren}
      <TeamAccountDropdown lee={lee} />
    </Header>
  );
  const brand = <TeamAdminSidenavHeader isCollapsed={isCollapsed} />;
  const sideNav = (
    <TeamAdminSidenav
      isCollapsed={isCollapsed}
      permissionChecker={lee.permission}
      routes={routes}
      teamNotifications={team?.notifications}
    />
  );
  const bottomButton = <BottomButton isCollapsed={isCollapsed} />;
  const banner = <BannerController adminAccess={lee.permission.adminAccess} />;
  const trialDialogFlow = hasBillingOrFullAccess ? (
    <ExtendTrialDialogFlow />
  ) : null;
  return (
    <NavBarContext.Provider value={setNavBarChildren}>
      <FrozenStateDialogProvider adminAccess={adminAccess}>
        <AddSeatsSuccessProvider>
          <Layout
            brand={brand}
            header={header}
            sideNav={sideNav}
            bottomButton={bottomButton}
            banner={banner}
            dialog={trialDialogFlow}
          >
            {children}
          </Layout>
        </AddSeatsSuccessProvider>
      </FrozenStateDialogProvider>
    </NavBarContext.Provider>
  );
};

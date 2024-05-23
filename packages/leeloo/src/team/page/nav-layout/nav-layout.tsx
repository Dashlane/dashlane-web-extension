import React, { useEffect, useState } from 'react';
import { throttle } from 'lodash';
import { Lee } from 'lee';
import { getCurrentSpace, getCurrentTeam } from 'libs/carbon/spaces';
import { ExtendTrialDialogFlow } from 'libs/trial/trial-dialogs/extend-trial-dialog-flow';
import { B2BTrialDaysLeftBanner } from 'libs/trial/banners/b2b-days-left-banner';
import { useB2BTrialBannerConditions } from 'libs/hooks/use-b2b-trial-banner-conditions';
import { TrialDiscontinuedDialogProvider } from 'libs/trial/trialDiscontinuationDialogContext';
import { useRouterGlobalSettingsContext } from 'libs/router';
import { Header } from 'team/page/header/Header';
import { Layout } from 'team/page/layout/layout';
import { TeamAccountDropdown } from 'team/page/account-dropdown/account-dropdown';
import { TeamAdminSidenav } from 'team/page/team-admin-sidenav/team-admin-sidenav';
import { TeamAdminSidenavHeader } from 'team/page/team-admin-sidenav/TeamAdminSidenavHeader';
import { BottomButton } from 'team/page/team-admin-sidenav/components/bottom-button';
import { TacTabs } from 'team/types';
const COLLAPSE_THRESHOLD = 1371;
const RESIZE_THROTTLE = 100;
const isUnderCollapseThreshold = () => document.documentElement.clientWidth < COLLAPSE_THRESHOLD;
export interface NavBarContextProps {
    navBarChildren?: JSX.Element | null;
    setNavBarChildren: (children: JSX.Element | null) => void;
}
export const NavBarContext = React.createContext<NavBarContextProps>({
    navBarChildren: null,
    setNavBarChildren: () => { },
});
export interface Props {
    selectedTab: string;
    lee: Lee;
}
export const NavLayout = ({ selectedTab, children, lee, }: React.PropsWithChildren<Props>) => {
    const [isCollapsed, setIsCollapsed] = useState(isUnderCollapseThreshold());
    const [navBarChildren, setNavBarChildren] = useState<JSX.Element | null>();
    const { routes } = useRouterGlobalSettingsContext();
    const adminAccess = lee.permission.adminAccess;
    const canShowB2BTrialBanner = useB2BTrialBannerConditions(adminAccess) &&
        selectedTab !== TacTabs.GET_STARTED;
    const hasBillingOrFullAccess = adminAccess.hasBillingAccess || adminAccess.hasFullAccess;
    useEffect(() => {
        const windowResizeListener = throttle(() => {
            const shouldBeCollapsed = isUnderCollapseThreshold();
            if (shouldBeCollapsed && !isCollapsed) {
                setIsCollapsed(true);
            }
            else if (!shouldBeCollapsed && isCollapsed) {
                setIsCollapsed(false);
            }
        }, RESIZE_THROTTLE);
        window.addEventListener('resize', windowResizeListener);
        return () => window.removeEventListener('resize', windowResizeListener);
    }, [isCollapsed]);
    const team = getCurrentTeam(lee.globalState);
    const teamSpace = getCurrentSpace(lee.globalState);
    const header = (<Header>
      {navBarChildren}
      <TeamAccountDropdown lee={lee}/>
    </Header>);
    const brand = <TeamAdminSidenavHeader isCollapsed={isCollapsed}/>;
    const sideNav = (<TeamAdminSidenav isCollapsed={isCollapsed} permissionChecker={lee.permission} routes={routes} selectedTab={selectedTab} teamNotifications={team?.notifications} teamSettings={teamSpace?.details.info}/>);
    const bottomButton = <BottomButton isCollapsed={isCollapsed}/>;
    const navBarChildrenState = {
        navBarChildren,
        setNavBarChildren,
    };
    const trialBannerWarning = canShowB2BTrialBanner ? (<B2BTrialDaysLeftBanner />) : null;
    const trialDialogFlow = hasBillingOrFullAccess ? (<ExtendTrialDialogFlow />) : null;
    return (<NavBarContext.Provider value={navBarChildrenState}>
      <TrialDiscontinuedDialogProvider adminAccess={adminAccess}>
        <Layout brand={brand} header={header} sideNav={sideNav} bottomButton={bottomButton} banner={trialBannerWarning} dialog={trialDialogFlow}>
          {children}
        </Layout>
      </TrialDiscontinuedDialogProvider>
    </NavBarContext.Provider>);
};

import * as React from "react";
import * as DashlaneAPIv2 from "@dashlane/dashlane-api";
import { Lee } from "../lee";
import { DirectorySyncKeyDialog } from "./directory-sync-key/dialog";
import { AlertQueue } from "./alerts";
import { NotificationList } from "./notification-list/notification-list";
import { redirectToUrl } from "../libs/external-urls";
import { useLogout } from "../libs/hooks/useLogout";
import { useBraze } from "../libs/hooks/useBraze";
import { useAccountInfo } from "../libs/carbon/hooks/useAccountInfo";
import { AlertQueueProvider } from "./alerts/alert-queue-provider";
import { TeamSpaceContextProvider } from "./settings/components/TeamSpaceContext";
import { SideNavNotificationProvider } from "./side-nav-notifications/side-nav-notification-provider";
import { WEBAPP_CONSOLE } from "./urls";
import styles from "./styles.css";
import { EventsReportingAccessProvider } from "./events-reporting-access/events-reporting-access-provider";
import { NavLayout } from "./page/nav-layout/nav-layout";
interface Props {
  lee: Lee;
}
export const Container = (props: React.PropsWithChildren<Props>) => {
  const [isExtensionInstalled, setIsExtensionInstalled] = React.useState(false);
  useBraze();
  const logout = useLogout(props.lee.dispatchGlobal);
  const accountInfo = useAccountInfo();
  const isReadyToRenderTAC = (): boolean => {
    const loggedIn = props.lee.globalState.carbon.loginStatus?.loggedIn;
    const login = props.lee.globalState.user.session.login;
    const uki = props.lee.globalState.user.session.uki;
    const premiumStatus = accountInfo?.premiumStatus;
    const tacAccessPermissions =
      props.lee.globalState.user.session.permissions?.tacAccessPermissions;
    return (
      loggedIn &&
      Boolean(login && uki) &&
      Boolean(premiumStatus) &&
      Boolean(tacAccessPermissions)
    );
  };
  const userCanAccessTAC = (): boolean => {
    const tacAccessPermissions =
      props.lee.globalState.user.session.permissions?.tacAccessPermissions;
    return Boolean(tacAccessPermissions?.size);
  };
  const logoutUserIfNeeded = (): boolean => {
    if (isReadyToRenderTAC() && !userCanAccessTAC()) {
      logout();
      return true;
    }
    return false;
  };
  React.useEffect(() => {
    const sessionClosed = logoutUserIfNeeded();
    if (sessionClosed) {
      return;
    }
    if (!APP_PACKAGED_IN_EXTENSION && !isExtensionInstalled) {
      DashlaneAPIv2.isInstalled().then((extIsInstalled: unknown) => {
        setIsExtensionInstalled(Boolean(extIsInstalled));
      });
    }
  }, [isExtensionInstalled]);
  if (!isReadyToRenderTAC() || !userCanAccessTAC()) {
    return <div />;
  }
  if (!APP_PACKAGED_IN_EXTENSION && isExtensionInstalled) {
    redirectToUrl(WEBAPP_CONSOLE);
  }
  return (
    <AlertQueueProvider globalReportError={props.lee.reportError}>
      <TeamSpaceContextProvider lee={props.lee}>
        <SideNavNotificationProvider>
          <EventsReportingAccessProvider>
            <NavLayout lee={props.lee}>
              <div>
                {props.children}
                <AlertQueue />
                <NotificationList lee={props.lee} />

                {props.lee.globalState.directorySyncKey.displayDialog ? (
                  <DirectorySyncKeyDialog lee={props.lee} />
                ) : null}

                <div className={styles.alertPopup} id="alert-popup-portal" />
              </div>
            </NavLayout>
          </EventsReportingAccessProvider>
        </SideNavNotificationProvider>
      </TeamSpaceContextProvider>
    </AlertQueueProvider>
  );
};

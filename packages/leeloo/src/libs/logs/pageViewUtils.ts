import { PageView } from "@dashlane/hermes";
import { NamedRoutes } from "../../app/routes/types";
import { logPageView } from "./logEvent";
export const logCurrentRoutePageView = (
  pathname: string,
  routes: NamedRoutes
) => {
  const routeToPageView: Record<string, PageView> = {
    [routes.userCredentials]: PageView.ItemCredentialList,
    [routes.userSecureNotes]: PageView.ItemSecureNoteList,
    [routes.userSecrets]: PageView.ItemSecureNoteList,
    [routes.userPersonalInfo]: PageView.ItemPersonalInfoList,
    [routes.userPayments]: PageView.ItemPaymentList,
    [routes.userIdsDocuments]: PageView.ItemIdList,
    [routes.userPasswordHealth]: PageView.ToolsPasswordHealthOverview,
    [routes.darkWebMonitoring]: PageView.ToolsDarkWebMonitoringList,
    [routes.importData]: PageView.ImportSelectPasswordSource,
  };
  const matchingRoute = Object.keys(routeToPageView).find((route) =>
    pathname.startsWith(route)
  );
  if (matchingRoute) {
    logPageView(routeToPageView[matchingRoute]);
  }
};

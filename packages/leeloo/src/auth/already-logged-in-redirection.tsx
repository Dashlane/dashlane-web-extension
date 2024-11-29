import {
  Redirect,
  useLocation,
  useRouterGlobalSettingsContext,
} from "../libs/router";
import {
  ACCOUNT_CREATION_TAC_URL_SEGMENT,
  LOGIN_TAC_URL_SEGMENT,
} from "../app/routes/constants";
import { Lee } from "../lee";
import { isInitialSyncAnimationPendingSelector } from "./initial-sync-progress/selectors";
export const AlreadyLoggedInRedirection = ({ lee }: { lee: Lee }) => {
  const { pathname } = useLocation();
  const {
    routes: { teamRoutesBasePath, clientRoutesBasePath },
  } = useRouterGlobalSettingsContext();
  const isTACRoute =
    pathname === ACCOUNT_CREATION_TAC_URL_SEGMENT ||
    pathname === LOGIN_TAC_URL_SEGMENT;
  const isAdmin = lee.permission.adminAccess.hasTACAccess;
  if (
    lee.permission.loggedIn &&
    !isInitialSyncAnimationPendingSelector(lee.globalState)
  ) {
    if (isTACRoute && isAdmin) {
      return <Redirect to={teamRoutesBasePath} />;
    } else {
      return <Redirect to={clientRoutesBasePath} />;
    }
  }
  return null;
};

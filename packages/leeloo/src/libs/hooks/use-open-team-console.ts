import { TacTabs } from "../../team/types";
import { TAC_URL } from "../../app/routes/constants";
import {
  getUrlSearchParams,
  useHistory,
  useRouterGlobalSettingsContext,
} from "../router";
import { openUrl } from "../external-urls";
export const useOpenTeamConsole = () => {
  const { routes } = useRouterGlobalSettingsContext();
  const history = useHistory();
  return {
    openTeamConsole: ({
      routeInExtension,
      routeInWebapp,
      email,
    }: {
      routeInExtension?: string;
      routeInWebapp?: TacTabs;
      email?: string;
    }) => {
      if (APP_PACKAGED_IN_EXTENSION || APP_PACKAGED_IN_DESKTOP) {
        return history.push(routeInExtension ?? routes.teamRoutesBasePath);
      }
      const queryParams = getUrlSearchParams();
      if (email) {
        queryParams.append("email", email);
      }
      if (routeInWebapp) {
        queryParams.append("redirect", "/" + routeInWebapp);
      }
      const urlToTac = `${TAC_URL}/#/login?${queryParams}`;
      return openUrl(urlToTac);
    },
  };
};

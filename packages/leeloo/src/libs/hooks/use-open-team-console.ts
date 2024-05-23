import { useHistory, useRouterGlobalSettingsContext } from 'libs/router';
export const useOpenTeamConsole = () => {
    const { routes } = useRouterGlobalSettingsContext();
    const history = useHistory();
    return {
        openTeamConsole: () => history.push(routes.teamRoutesBasePath),
    };
};

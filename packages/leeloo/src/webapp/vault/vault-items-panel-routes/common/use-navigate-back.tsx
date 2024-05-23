import { redirect, useHistory, useRouterGlobalSettingsContext, } from 'libs/router';
export const useNavigateBack = () => {
    const history = useHistory();
    const { routes } = useRouterGlobalSettingsContext();
    const navigateBack = (defaultRoute: string) => {
        if (history.length > 1 && !defaultRoute) {
            history.goBack();
        }
        else {
            redirect(defaultRoute);
        }
    };
    return { navigateBack, routes };
};

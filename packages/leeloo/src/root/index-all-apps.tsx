import './wdyr';
import { getAllAppsRoutes } from 'app/routes/routes-all';
import { RoutingSchemeOptions } from 'app/routes/constants';
import initApp from './index';
initApp(RoutingSchemeOptions.ALL_APPS, getAllAppsRoutes);
if (module.hot) {
    module.hot.accept(() => {
        initApp(RoutingSchemeOptions.ALL_APPS, getAllAppsRoutes);
    });
}

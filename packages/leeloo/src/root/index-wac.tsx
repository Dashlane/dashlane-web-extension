import { getWacRoutes } from 'app/routes/routes-wac';
import { RoutingSchemeOptions } from 'app/routes/constants';
import initApp from './index';
initApp(RoutingSchemeOptions.WEB_ACCOUNT_CREATION, getWacRoutes);

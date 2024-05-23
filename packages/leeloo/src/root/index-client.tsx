import { getClientRoutes } from 'app/routes/routes-client';
import { RoutingSchemeOptions } from 'app/routes/constants';
import initApp from './index';
initApp(RoutingSchemeOptions.CLIENT, getClientRoutes);

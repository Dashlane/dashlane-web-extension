import { getTacRoutes } from 'app/routes/routes-tac';
import { RoutingSchemeOptions } from 'app/routes/constants';
import initApp from './index';
initApp(RoutingSchemeOptions.TEAM_ADMIN_CONSOLE, getTacRoutes);

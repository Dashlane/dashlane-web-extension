import initLogging from './init/logging';
import { initApp } from './services';
import { iframe } from '@dashlane/browser-utils';
import { RoutingSchemeOptions } from 'app/routes/constants';
import { getNamedRoutes } from 'app/routes/services';
import { NamedRoutes } from 'app/routes/types';
import { faviconSelector } from './favicons/favicon-selector';
export default (routingSchemeOptions: RoutingSchemeOptions, getRoutes: (nr: NamedRoutes, routingSchemeOptions?: RoutingSchemeOptions) => JSX.Element): void => {
    if (iframe.isInsideIframe()) {
        throw new Error('Leeloo should not be run in an iframe');
    }
    require('setimmediate');
    require('../libs/touch-detection');
    require('what-input');
    initLogging();
    const namedRoutes = getNamedRoutes(routingSchemeOptions);
    const routes = getRoutes(namedRoutes, routingSchemeOptions);
    initApp(routes, namedRoutes);
    faviconSelector();
};

import { makeRootCursor } from 'redux-cursor';
import { Lee, LeeWithStorage } from 'lee';
import makeLee from 'app/createElement/makeLee';
import makeLeeWithStorage from 'app/createElement/makeLeeWithStorage';
import { CustomRouteProps, RouterGlobalSettings } from 'libs/router/types';
import { makeCursor, registerPathAndReducer, } from 'libs/router/helpers/makeCursorForRoute';
export const makeLeeForRoute = (routerGlobalSettings: RouterGlobalSettings, routeProps: CustomRouteProps): Lee | LeeWithStorage<any> => {
    const rootCursor = makeRootCursor(routerGlobalSettings.store, routerGlobalSettings.reducer);
    const globalState = routerGlobalSettings.store.getState();
    const leeOptions = {
        carbonState: globalState.carbon,
        cursor: rootCursor,
        translate: routerGlobalSettings.translate,
        routes: routerGlobalSettings.routes,
    };
    const paths: string | string[] | null = (routeProps?.path as string | string[] | undefined) ?? null;
    if (routeProps.reducer) {
        registerPathAndReducer(paths, routeProps.reducer);
        return makeLeeWithStorage({
            ...leeOptions,
            cursor: makeCursor(rootCursor, paths),
        });
    }
    return makeLee(leeOptions);
};

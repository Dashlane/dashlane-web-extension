import * as userActions from 'user/reducer';
import { Cursor, DispatchGlobal, GlobalState } from 'store/types';
import { State as CarbonState } from 'libs/carbon/types';
import errorAction from 'libs/logs/errorActions';
import { makePermissionChecker, PermissionChecker } from 'user/permissions';
import { TranslatorInterface } from 'libs/i18n/types';
import { ApiMiddlewareMethods, makeApiMiddleware } from 'api/makeApiMiddleware';
import { NamedRoutes } from 'app/routes/types';
import styleVars from 'libs/styleVariables';
import { redirect } from 'libs/router';
export const LEE_INCORRECT_AUTHENTICATION = 'Incorrect authentication';
export interface Lee {
    carbon: CarbonState;
    dispatchGlobal: DispatchGlobal;
    globalState: GlobalState;
    apiMiddleware: ApiMiddlewareMethods;
    permission: PermissionChecker;
    reportError: (error: Error, message?: string) => void;
    routes: NamedRoutes;
    styleVars: typeof styleVars;
    translate: TranslatorInterface;
}
export interface Options {
    cursor: Cursor<{}>;
    routes: NamedRoutes;
    translate: TranslatorInterface;
}
export default function makeLee(options: Options): Lee {
    return {
        carbon: options.cursor.globalState.carbon,
        dispatchGlobal: options.cursor.dispatchGlobal,
        globalState: options.cursor.globalState,
        reportError: (error: Error, message?: string) => {
            const action = message ? errorAction(message, error) : errorAction(error);
            if (error.message === LEE_INCORRECT_AUTHENTICATION ||
                (error['data'] &&
                    error['data']['content'] === LEE_INCORRECT_AUTHENTICATION)) {
                options.cursor.dispatchGlobal(userActions.userLoggedOut());
                redirect('/login');
            }
            else {
                options.cursor.dispatchGlobal(action);
            }
        },
        apiMiddleware: makeApiMiddleware(options.cursor.globalState),
        permission: makePermissionChecker(options.cursor.globalState),
        routes: options.routes,
        styleVars,
        translate: options.translate,
    };
}

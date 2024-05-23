import { jsx } from '@dashlane/ui-components';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { Lee } from 'lee';
import { CustomRoute, Redirect, Route, RoutesProps, useLocation, useRouterGlobalSettingsContext, } from 'libs/router';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import { getLogin } from 'user';
import { ACCOUNT_CREATION_TAC_URL_SEGMENT, ACCOUNT_CREATION_URL_SEGMENT, EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT, LOGIN_TAC_URL_SEGMENT, LOGIN_URL_SEGMENT, } from 'app/routes/constants';
import { Auth, AuthOptions, MarketingContentType } from './auth';
import LoginPanel from './login-panel/login-panel-proxy';
import { AccountCreationPanel } from './account-creation-panel/account-creation-panel';
import { isInitialSyncAnimationPendingSelector } from './initial-sync-progress/selectors';
const AuthRedirect = ({ lee }: {
    lee: Lee;
}) => {
    const { search, pathname } = useLocation();
    const premiumStatus = usePremiumStatus();
    const { routes: { teamRoutesBasePath }, } = useRouterGlobalSettingsContext();
    const searchParams = new URLSearchParams(search);
    const toEmail = searchParams.get('email') ?? '';
    const currentEmail = getLogin(lee.globalState);
    const sameEmail = toEmail === currentEmail;
    if (premiumStatus.status !== DataStatus.Success || !premiumStatus.data) {
        return null;
    }
    const isAdmin = lee.permission.adminAccess.hasTACAccess;
    if (lee.permission.loggedIn &&
        !isInitialSyncAnimationPendingSelector(lee.globalState)) {
        if (sameEmail && pathname === LOGIN_TAC_URL_SEGMENT && isAdmin) {
            return <Redirect to={teamRoutesBasePath}/>;
        }
        else {
            return <Redirect to="/"/>;
        }
    }
    return null;
};
const Routes = ({ options, path, }: Omit<RoutesProps<string[], AuthOptions>, 'basePath'>) => {
    const isTACFlow = options?.marketingContentType === MarketingContentType.DashlaneBusiness;
    return (<Route path={path}>
      <CustomRoute component={AuthRedirect} path={path}/>
      <Auth options={options}>
        <CustomRoute path={[LOGIN_URL_SEGMENT, LOGIN_TAC_URL_SEGMENT]} options={options} component={LoginPanel}/>
        <CustomRoute options={{
            isTACFlow,
        }} path={[
            ACCOUNT_CREATION_URL_SEGMENT,
            ACCOUNT_CREATION_TAC_URL_SEGMENT,
            EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT,
        ]} component={AccountCreationPanel}/>
      </Auth>
    </Route>);
};
export default Routes;

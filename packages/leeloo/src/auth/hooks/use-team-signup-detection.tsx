import { useEffect } from 'react';
import { ParsedURL } from '@dashlane/url-parser';
import { cookiesGetAll, cookiesRemove, tabsQuery, tabsRemove, } from '@dashlane/webextensions-apis';
import { DASHLANE_DOMAIN, EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT, } from 'app/routes/constants';
import { TEAM_SIGN_UP_PAGE_COOKIE } from 'auth/types';
import { getUrlSearchParams, useHistory, useLocation } from 'libs/router';
export const useTeamSignUpDetection = () => {
    const history = useHistory();
    const { pathname } = useLocation();
    const isEmployeeSignUpPage = pathname === EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT;
    useEffect(() => {
        if (APP_PACKAGED_IN_EXTENSION) {
            const checkTeamSignUpRedirect = async () => {
                const tabs = await tabsQuery({
                    url: `*://*.${DASHLANE_DOMAIN}/*`,
                });
                const teamSignUpTab = tabs.find((tab) => {
                    return (tab.url &&
                        new ParsedURL(tab.url).getRootDomain() === DASHLANE_DOMAIN &&
                        tab.url?.includes(EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT) &&
                        !tab.active);
                });
                const cookies = await cookiesGetAll({
                    domain: DASHLANE_DOMAIN,
                    name: TEAM_SIGN_UP_PAGE_COOKIE,
                });
                const teamSignUpCookie = cookies[0];
                if (teamSignUpCookie || teamSignUpTab) {
                    const [cookieEmail, cookieTeam] = teamSignUpCookie?.value?.split(',') ?? [];
                    const teamSignUpTabUrl = teamSignUpTab?.url
                        ? teamSignUpTab?.url
                        : undefined;
                    const parsedEmail = cookieEmail ??
                        getUrlSearchParams(teamSignUpTabUrl).get('email') ??
                        '';
                    const parsedTeam = cookieTeam ??
                        getUrlSearchParams(teamSignUpTabUrl).get('team') ??
                        '';
                    if (teamSignUpCookie) {
                        await cookiesRemove({
                            url: `*****${DASHLANE_DOMAIN}`,
                            name: TEAM_SIGN_UP_PAGE_COOKIE,
                        });
                    }
                    if (!isEmployeeSignUpPage) {
                        if (teamSignUpTab?.id) {
                            await tabsRemove([teamSignUpTab.id]);
                        }
                        history.push(`${EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT}?email=${parsedEmail}&team=${parsedTeam}`);
                    }
                }
            };
            checkTeamSignUpRedirect();
        }
    }, [history, isEmployeeSignUpPage]);
};

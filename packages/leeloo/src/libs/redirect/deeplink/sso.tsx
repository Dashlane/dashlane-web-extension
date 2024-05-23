import * as React from 'react';
import { Redirect, RoutesProps, useLocation } from 'libs/router';
import { SSO_URL_SEGMENT } from 'app/routes/constants';
const getSsoRedirectUrl = (pathname: string) => {
    return pathname.includes('ssoToken=') && !pathname.includes(SSO_URL_SEGMENT)
        ? `${SSO_URL_SEGMENT}?${pathname.slice(1)}`
        : '';
};
export const Sso = (props: RoutesProps) => {
    const location = useLocation();
    const url = `${location.pathname}${location.search}`;
    const redirectUrl = getSsoRedirectUrl(url);
    return redirectUrl ? <Redirect to={redirectUrl}/> : null;
};

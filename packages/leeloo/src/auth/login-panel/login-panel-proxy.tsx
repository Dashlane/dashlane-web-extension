import * as React from 'react';
import { LeeWithStorage } from 'lee';
import { AuthOptions, MarketingContentType } from 'auth/auth';
import { AuthLocationState } from 'auth/auth-panel-navigation/auth-panel-navigation';
import { useIsLegacyAuthenticationFlowForced } from 'auth/login-panel/authentication-flow/hooks/use-is-legacy-authentication-flow-forced';
import { AuthenticationFlowLoginPanel } from 'auth/login-panel/authentication-flow-login-panel';
import LoginPanelLegacy from 'auth/login-panel/login-panel';
import { EXT_NG_AUTHENTICATION_FLOW_KEY } from './constants';
import { useLogout } from 'libs/hooks/useLogout';
export interface State {
    noLocalAccountHasBeenRedirectToSignUpPanel: boolean;
}
export interface Props {
    lee: LeeWithStorage<State>;
    options?: AuthOptions;
    location: AuthLocationState;
}
const LoginPanel = (props: Props) => {
    const { options } = props;
    const isTACFlow = options?.marketingContentType === MarketingContentType.DashlaneBusiness;
    const { loading, data: isKillSwitchOn } = useIsLegacyAuthenticationFlowForced();
    const extngLoginFlowOption = window.localStorage.getItem(EXT_NG_AUTHENTICATION_FLOW_KEY);
    const logoutHandler = useLogout(props.lee.dispatchGlobal);
    const isForceLoginFlowFallbackOptionEnabled = extngLoginFlowOption && extngLoginFlowOption === 'true';
    const isNewLoginFlowEnabled = !isForceLoginFlowFallbackOptionEnabled && !isKillSwitchOn;
    return !loading ? (isNewLoginFlowEnabled ? (<AuthenticationFlowLoginPanel location={props.location} isTacFlow={isTACFlow} logoutHandler={logoutHandler}/>) : (<LoginPanelLegacy {...props}/>)) : null;
};
export default LoginPanel;

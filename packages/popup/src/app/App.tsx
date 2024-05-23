import React from 'react';
import { useIsNewAuthenticationFlowDisabled } from '../libs/api/killswitch/useIsNewAuthenticationFlowDisabled';
import { EXT_NG_AUTHENTICATION_FLOW_KEY } from '../libs/local-storage-constants';
import { AuthenticationFlowWrapper } from './authentication-flow-wrapper';
import { LegacyLoginWrapper } from './legacy-login-wrapper';
import { useLoginDeviceLimitFlow } from './login/DeviceLimitFlow';
import UIStateProvider from './UIState/UIStateProvider';
import { AppComponent, AppProps } from '.';
export const App = ({ kernel }: AppProps) => {
    const { loading, data: isKillSwitchOn } = useIsNewAuthenticationFlowDisabled();
    const extngLoginFlowOption = window.localStorage.getItem(EXT_NG_AUTHENTICATION_FLOW_KEY);
    const deviceLimitFlow = useLoginDeviceLimitFlow();
    const isForceLoginFlowFallbackOptionEnabled = extngLoginFlowOption && extngLoginFlowOption === 'true';
    const isNewLoginFlowEnabled = !isForceLoginFlowFallbackOptionEnabled && !isKillSwitchOn;
    const Component = () => {
        return (<UIStateProvider>
        <AppComponent kernel={kernel}/>
      </UIStateProvider>);
    };
    if (loading) {
        return null;
    }
    return isNewLoginFlowEnabled && !deviceLimitFlow ? (<AuthenticationFlowWrapper Component={<Component />}/>) : (<LegacyLoginWrapper Component={<Component />}/>);
};

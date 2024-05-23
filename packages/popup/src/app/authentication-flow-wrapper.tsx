import * as React from 'react';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { jsx } from '@dashlane/design-system';
import { ReactivationStatus } from '@dashlane/communication';
import { AuthenticationStatus, UserOpenExtensionEvent } from '@dashlane/hermes';
import { AuthenticationFlowContainer } from './authentication-flow/authentication-flow-container';
import { useLoginStatus } from 'src/libs/hooks/useLoginStatus';
import { logEvent } from 'src/libs/logs/logEvent';
import { carbonConnector } from 'src/carbonConnector';
import { useIsAllowed } from './authentication-flow/hooks/use-is-allowed';
interface Props {
    Component: JSX.Element;
}
export const AuthenticationFlowWrapper = ({ Component }: Props) => {
    const displayApp = () => {
        window.dispatchEvent(new Event('display-app'));
    };
    const loginStatus = useLoginStatus();
    const isUserAllowed = useIsAllowed();
    React.useEffect(() => {
        displayApp();
    }, []);
    React.useEffect(() => {
        const sendOpenExtensionLog = async () => {
            if (loginStatus.status === DataStatus.Success) {
                const reactivationStatus = await carbonConnector.getReactivationStatus();
                void logEvent(new UserOpenExtensionEvent({
                    authenticationStatus: loginStatus.data.loggedIn
                        ? AuthenticationStatus.LoggedIn
                        : reactivationStatus === ReactivationStatus.WEBAUTHN
                            ? AuthenticationStatus.LockedOut
                            : AuthenticationStatus.LoggedOut,
                }));
            }
        };
        void sendOpenExtensionLog();
    }, [loginStatus.status]);
    if (isUserAllowed.status === DataStatus.Loading) {
        return null;
    }
    return (<div>
      {isUserAllowed.data ? (Component) : (<div sx={{
                position: 'relative',
                height: '561px',
                backgroundColor: 'ds.background.default',
            }}>
          <AuthenticationFlowContainer />
        </div>)}
    </div>);
};

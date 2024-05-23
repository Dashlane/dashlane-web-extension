import { useEffect, useRef, useState } from 'react';
import queryString from 'query-string';
import { jsx } from '@dashlane/ui-components';
import { InvitationLinkClickOrigin, PageView, SignupFlowStep, UserSignupToDashlaneEvent, } from '@dashlane/hermes';
import { DataStatus } from '@dashlane/framework-react';
import { LoginNotificationType } from '@dashlane/communication';
import { Lee } from 'lee';
import { carbonConnector } from 'libs/carbon/connector';
import { augmentUrlWithProperSsoQueryParameters, redirectToUrl, } from 'libs/external-urls';
import { useLocation } from 'libs/router';
import { useInviteLinkData } from 'team/settings/hooks/useInviteLinkData';
import { EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT } from 'app/routes/constants';
import { VerifyInviteLinkEmail } from './verify-invite-link-email';
import { logEvent, logPageView } from 'libs/logs/logEvent';
import { useGetLoginNotifications } from 'auth/login-notifications/use-get-login-notifications';
import { EmailInputForm } from './email-input-form';
export interface InfoSubmitOptions {
    login: string | null;
}
interface InfoFormProps {
    lee: Lee;
    onSubmit: (info: InfoSubmitOptions) => void;
    isB2BFlow: boolean;
    hasBeenRedirected: boolean;
    setHasBeenRedirected: (hasBeenRedirected: boolean) => void;
}
export enum LoginErrorTypes {
    SSO_USER_NON_PROVISIONED = 'sso_user_non_provisioned',
    INVALID_EMAIL = 'invalid_email',
    FAILED = 'failed',
    USER_NOT_PROPOSED = 'user_non_proposed',
    TEAM_ACCEPTANCE_NEEDED = 'team_acceptance_needed',
    TEAM_ACCEPTANCE_FAILED = 'team_acceptance_failed'
}
export const InfoForm = (props: InfoFormProps) => {
    const { search, pathname } = useLocation();
    const queryParams = queryString.parse(search);
    const emailQueryParam = `${queryParams.email ?? ''}`;
    const prefilledTeamKey = `${queryParams.team ?? ''}`;
    const [teamAcceptanceNeeded, setTeamAcceptanceNeeded] = useState(false);
    const [loginValue, setLoginValue] = useState<string | undefined>(emailQueryParam);
    const [loginErrorType, setLoginErrorType] = useState<LoginErrorTypes | null>(null);
    const emailField = useRef<HTMLInputElement>(null);
    const unsubscribeFns = useRef<Array<() => void>>([]);
    const { getInviteLinkData, inviteLinkData } = useInviteLinkData();
    const isEmployeeSignUpFlow = pathname === EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT;
    const isInviteLinkFlow = isEmployeeSignUpFlow && !!prefilledTeamKey;
    const inviteLinkDisabled = isInviteLinkFlow && inviteLinkData?.disabled === true;
    const loginNotifications = useGetLoginNotifications();
    useEffect(() => {
        emailField.current?.focus?.();
    }, []);
    useEffect(() => {
        if (isEmployeeSignUpFlow) {
            logPageView(PageView.JoinDashlaneTeamEnterEmailAddress);
            logEvent(new UserSignupToDashlaneEvent({
                invitationLinkClickOrigin: isInviteLinkFlow
                    ? InvitationLinkClickOrigin.SharedInvitationLink
                    : InvitationLinkClickOrigin.InvitationEmail,
                signupFlowStep: SignupFlowStep.EnterEmailAddress,
            }));
        }
    }, [isEmployeeSignUpFlow, isInviteLinkFlow]);
    useEffect(() => {
        unsubscribeFns.current = unsubscribeFns.current.concat([
            carbonConnector.liveServiceProviderUrl.on((url: string) => {
                redirectToUrl(augmentUrlWithProperSsoQueryParameters(url));
            }),
        ]);
        return () => {
            unsubscribeFns.current.forEach((unsubscribe) => unsubscribe());
            unsubscribeFns.current = [];
        };
    }, []);
    useEffect(() => {
        if (prefilledTeamKey) {
            getInviteLinkData(prefilledTeamKey);
        }
    }, [getInviteLinkData, prefilledTeamKey]);
    useEffect(() => {
        const notificationList = loginNotifications.status === DataStatus.Success
            ? loginNotifications.data ?? []
            : [];
        const teamAcceptanceSuccess = notificationList.some((notification) => notification.type === LoginNotificationType.TEAM_ACCEPTANCE_SUCCESS);
        if (teamAcceptanceSuccess) {
            setTeamAcceptanceNeeded(false);
            setLoginErrorType(null);
        }
        else if (loginErrorType === LoginErrorTypes.TEAM_ACCEPTANCE_NEEDED) {
            setTeamAcceptanceNeeded(true);
        }
    }, [loginErrorType, loginNotifications]);
    const emailVerificationNeeded = !inviteLinkDisabled &&
        teamAcceptanceNeeded &&
        loginValue &&
        inviteLinkData?.teamUuid;
    return emailVerificationNeeded ? (<VerifyInviteLinkEmail teamUuid={inviteLinkData.teamUuid} login={loginValue}/>) : (<EmailInputForm {...props} loginValue={loginValue} setLoginValue={setLoginValue} loginErrorType={loginErrorType} setLoginErrorType={setLoginErrorType}/>);
};

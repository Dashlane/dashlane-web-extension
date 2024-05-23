import * as React from 'react';
import { FamilyRenewalInformation, JoinFamilyError, JoinFamilyUserStatus, } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
import { CustomRoute, redirect } from 'libs/router';
import { Form } from 'family/form/form';
import { Confirm } from 'family/confirm/confirm';
import { Failed } from 'family/failed/failed';
interface JoinFamilyProps {
    basePath: string;
    location: Location;
}
const errorCodes = new Set<JoinFamilyError>([
    'BAD_LOGIN',
    'CANNOT_JOIN_MULTIPLE_FAMILIES',
    'ALREADY_JOINED_THIS_FAMILY',
    'USER_SUBSCRIPTION_IS_UP_FOR_RENEWAL',
    'USER_MUST_CANCEL_PREMIUM_PLUS_RENEWAL_TO_DOWNGRADE_TO_FAMILY',
]);
const isGenericErrorCode = (errorCode: JoinFamilyError): boolean => {
    if (!errorCode) {
        return false;
    }
    if (errorCode === 'UNKNOWN_ERROR') {
        return true;
    }
    return !errorCodes.has(errorCode);
};
interface Confirmation {
    userStatus: JoinFamilyUserStatus;
    renewalInformation: FamilyRenewalInformation;
}
export const JoinFamilyContainer = ({ basePath, location, }: JoinFamilyProps) => {
    const [joinToken, setJoinToken] = React.useState<string>('');
    const [confirmation, setConfirmation] = React.useState<Confirmation | undefined>();
    const [errorCode, setErrorCode] = React.useState<JoinFamilyError | null>(null);
    React.useEffect(() => {
        if (!errorCode) {
            return;
        }
        if (errorCode === 'FAMILY_FULL' ||
            errorCode === 'JOIN_FAMILY_TOKEN_NOT_FOUND' ||
            isGenericErrorCode(errorCode)) {
            redirect(`${basePath}/failed`);
        }
    }, [basePath, errorCode]);
    React.useEffect(() => {
        if (!confirmation) {
            return;
        }
        redirect(`${basePath}/confirm`);
    }, [basePath, confirmation]);
    React.useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const accept = searchParams.get('accept');
        if (accept) {
            setJoinToken(accept);
        }
    }, [location.search]);
    const handleJoinFamily = async (login: string): Promise<void> => {
        try {
            const result = await carbonConnector.joinFamily({
                login,
                joinToken,
            });
            if (!result.success) {
                setErrorCode(result.error.code);
                return;
            }
            const { userStatus, renewalInformation } = result.response;
            setConfirmation({ userStatus, renewalInformation });
        }
        catch (err) {
            setErrorCode('UNKNOWN_ERROR');
        }
    };
    const handleResetErrorCode = (): void => {
        setErrorCode(null);
    };
    return (<>
      <CustomRoute path={basePath} exact component={Form} additionalProps={{
            errorCode,
            handleJoinFamily,
            handleResetErrorCode,
        }}/>
      <CustomRoute path={`${basePath}/confirm`} component={Confirm} additionalProps={confirmation}/>
      <CustomRoute path={`${basePath}/failed`} component={Failed} additionalProps={{
            errorCode,
        }}/>
    </>);
};

import { AccountCreationCode, CheckLoginResponse, } from '@dashlane/communication';
import { Result } from '@dashlane/framework-types';
import { LoginUserWithEnclaveSSOCommandFailure, LoginUserWithEnclaveSSOCommandParam, } from '@dashlane/sso-scim-contracts';
import { Lee } from 'lee';
import { carbonConnector } from 'libs/carbon/connector';
import { websiteLogAction } from 'libs/logs';
import { redirect } from 'libs/router';
import { isValidEmail } from 'libs/validators';
import { InfoSubmitOptions, LoginErrorTypes } from './info-form';
export interface InfoFormFields {
    email: string | null;
    isB2B: boolean;
}
export interface HandleInfoFormSubmittedParams {
    lee: Lee;
    onSubmit: (info: InfoSubmitOptions) => void;
    fields: InfoFormFields;
    setIsLoading: (isLoading: boolean) => void;
    setLoginErrorType: (type: LoginErrorTypes | null) => void;
    loginUserWithEnclaveSSO: (command: LoginUserWithEnclaveSSOCommandParam) => Promise<Result<undefined, LoginUserWithEnclaveSSOCommandFailure>>;
    isInviteLinkFlow: boolean;
}
export const isFormValid = (fields: InfoFormFields) => isValidEmail(fields.email);
export const handleInfoFormSubmitted = ({ lee, onSubmit, fields, setIsLoading, setLoginErrorType, loginUserWithEnclaveSSO, isInviteLinkFlow, }: HandleInfoFormSubmittedParams) => {
    setLoginErrorType(isValidEmail(fields.email) ? null : LoginErrorTypes.INVALID_EMAIL);
    if (!isFormValid(fields)) {
        return;
    }
    setIsLoading(true);
    const currentLogin = fields.email ?? '';
    carbonConnector
        .checkLogin(currentLogin)
        .then(({ accountCreationCode, isUserProposed, isUserAccepted, }: CheckLoginResponse) => {
        const info = {
            login: currentLogin,
            isSsoUser: accountCreationCode === AccountCreationCode.USER_SSO_PROVISIONED ||
                accountCreationCode ===
                    AccountCreationCode.USER_DOESNT_EXIST_SSO_NON_PROVISIONED,
            isNitroSsoUser: accountCreationCode ===
                AccountCreationCode.USER_NITRO_SSO_PROVISIONED,
            isSsoNonProvisioned: accountCreationCode ===
                AccountCreationCode.USER_DOESNT_EXIST_SSO_NON_PROVISIONED,
            alreadyExists: accountCreationCode === AccountCreationCode.USER_EXISTS,
            isValid: accountCreationCode !==
                AccountCreationCode.USER_DOESNT_EXIST_INVALID_MX,
        };
        let loginErrorType: LoginErrorTypes | null = null;
        let isLoading = false;
        const inviteLinkUserNotProposed = isInviteLinkFlow &&
            isUserProposed === false &&
            isUserAccepted === false;
        const teamAcceptanceNeeded = isInviteLinkFlow &&
            isUserProposed === true &&
            isUserAccepted === false;
        if (!info.isValid) {
            loginErrorType = LoginErrorTypes.INVALID_EMAIL;
        }
        if (info.isNitroSsoUser) {
            loginUserWithEnclaveSSO({ userEmailAddress: info.login });
            isLoading = true;
        }
        if (info.isSsoUser) {
            if (info.isSsoNonProvisioned) {
                loginErrorType = LoginErrorTypes.SSO_USER_NON_PROVISIONED;
            }
            else {
                isLoading = true;
            }
        }
        else if (info.alreadyExists) {
            redirect(`/login?email=${fields.email}`);
            return;
        }
        else if (inviteLinkUserNotProposed &&
            (!info.isNitroSsoUser || !info.isSsoUser)) {
            loginErrorType = LoginErrorTypes.USER_NOT_PROPOSED;
        }
        else if (teamAcceptanceNeeded) {
            loginErrorType = LoginErrorTypes.TEAM_ACCEPTANCE_NEEDED;
        }
        setIsLoading(isLoading);
        setLoginErrorType(loginErrorType);
        if (!info.isSsoUser &&
            !info.isNitroSsoUser &&
            !loginErrorType &&
            info.isValid) {
            onSubmit({
                login: fields.email,
            });
        }
    })
        .catch((error) => {
        setIsLoading(false);
        setLoginErrorType(LoginErrorTypes.FAILED);
        lee.dispatchGlobal(websiteLogAction.error({
            message: 'Login validation failed',
            content: { error: error.message },
        }));
    });
};

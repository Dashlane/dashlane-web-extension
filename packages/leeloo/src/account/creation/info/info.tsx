import { createRef, FormEvent, KeyboardEvent, MouseEvent, useEffect, useRef, useState, } from 'react';
import { Button, jsx, TextInput } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { AccountCreationCode, CheckLoginResponse, } from '@dashlane/communication';
import DashlaneExtension from 'libs/DashlaneExtension';
import { Lee } from 'lee';
import { carbonConnector } from 'libs/carbon/connector';
import { websiteLogAction } from 'libs/logs';
import { isValidEmail } from 'libs/validators';
import * as flow from 'account/creation/flow';
import Header from 'account/creation/header';
import { augmentUrlWithProperSsoQueryParameters, redirectToUrl, } from 'libs/external-urls';
import LoadingSpinner from 'libs/dashlane-style/loading-spinner';
import accountCreationStyles from '../styles/index.css';
const isFormValid = (fields: InfoFormFields) => isValidEmail(fields.email);
interface InfoFormFields {
    email: string;
    isEu: boolean;
}
export interface InfoSubmitOptions {
    login: string;
}
export interface InfoProps {
    lockedLoginValue: string;
    preFilledLoginValue: string;
    onSubmit: (options: InfoSubmitOptions) => void;
    lee: Lee;
    options: {
        flowIndicator: flow.Indicator;
    };
}
type LoginErrorType = null | 'invalid_email' | 'account_already_exists' | 'sso_non_provisioned' | 'nitro_sso_extension_needed' | 'non_proposed';
let loginStored = '';
try {
    loginStored = window.sessionStorage?.['accountCreationInfoLogin'];
}
catch {
}
export const Info = ({ lockedLoginValue, preFilledLoginValue, onSubmit, lee, options, }: InfoProps) => {
    const { translate } = useTranslate();
    const [isLoading, setIsLoading] = useState(false);
    const [loginValue, setLoginValue] = useState(lockedLoginValue ?? preFilledLoginValue ?? '');
    const [loginErrorType, setLoginErrorType] = useState<LoginErrorType>(null);
    const infoEmailInput = createRef<HTMLInputElement>();
    const unsubscribeFns = useRef<Array<() => void>>([]);
    const getEmail = () => infoEmailInput.current?.value.toLowerCase() ?? '';
    const isEu = () => lee.carbon.currentLocation.isEu === null
        ? true
        : lee.carbon.currentLocation.isEu;
    const login = loginValue || loginStored;
    const i18nNamespace = flow.accountCreationPrefixMap[options.flowIndicator];
    useEffect(() => {
        unsubscribeFns.current = unsubscribeFns.current.concat([
            carbonConnector.liveServiceProviderUrl.on((url: string) => {
                redirectToUrl(augmentUrlWithProperSsoQueryParameters(url));
            }),
        ]);
        DashlaneExtension.webAccountCreation.started({
            anonymouscomputerid: lee.globalState.logs.websiteTrackingId,
        });
    }, []);
    useEffect(() => {
        if (!loginValue) {
            setLoginValue(loginStored);
        }
    }, [loginStored]);
    useEffect(() => {
        return () => {
            setIsLoading(false);
            unsubscribeFns.current.forEach((unsubscribe) => unsubscribe());
            unsubscribeFns.current = [];
        };
    }, []);
    const makeInfoFormFields = (): InfoFormFields => {
        return {
            email: getEmail(),
            isEu: isEu(),
        };
    };
    const getErrorText = (errorType: LoginErrorType): string | undefined => {
        if (!errorType) {
            return undefined;
        }
        let error: string;
        if (errorType === 'sso_non_provisioned') {
            const userEmail = loginValue;
            const domain = userEmail.slice(userEmail.indexOf('@') + 1);
            error = translate(flow.accountCreationPrefixMap[options.flowIndicator] +
                'error_' +
                errorType, {
                domain,
            });
        }
        else if (errorType === 'nitro_sso_extension_needed') {
            error = 'You must use the Dashlane Extension to create your account.';
        }
        else {
            error = translate(flow.accountCreationPrefixMap[options.flowIndicator] +
                'error_' +
                errorType);
        }
        return error;
    };
    const handleLoginBlurred = () => {
        setLoginErrorType(!loginValue || isValidEmail(loginValue) ? null : 'invalid_email');
    };
    const handleLoginChanged = () => {
        setLoginErrorType(null);
        setLoginValue(getEmail());
        if (window.sessionStorage) {
            window.sessionStorage['accountCreationInfoLogin'] = getEmail();
        }
    };
    const handleFormSubmitted = (event: FormEvent<HTMLFormElement> | MouseEvent<HTMLElement> | KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        event.preventDefault();
        const fields = makeInfoFormFields();
        setLoginErrorType(isValidEmail(loginValue) ? null : 'invalid_email');
        if (!isFormValid(fields)) {
            return;
        }
        setIsLoading(true);
        const currentLogin = fields.email;
        carbonConnector
            .checkLogin(currentLogin)
            .then(({ accountCreationCode }: CheckLoginResponse) => {
            const info = {
                login: currentLogin,
                alreadyExists: accountCreationCode === AccountCreationCode.USER_EXISTS,
                isValid: accountCreationCode !==
                    AccountCreationCode.USER_DOESNT_EXIST_INVALID_MX,
                isSsoNonProvisioned: accountCreationCode ===
                    AccountCreationCode.USER_DOESNT_EXIST_SSO_NON_PROVISIONED,
                isSsoUser: accountCreationCode === AccountCreationCode.USER_SSO_PROVISIONED ||
                    accountCreationCode ===
                        AccountCreationCode.USER_DOESNT_EXIST_SSO_NON_PROVISIONED,
                isNitroSsoUser: accountCreationCode ===
                    AccountCreationCode.USER_NITRO_SSO_PROVISIONED,
            };
            let errorMessageType: LoginErrorType = null;
            if (!info.isValid) {
                errorMessageType = 'invalid_email';
            }
            if (info.isSsoNonProvisioned) {
                errorMessageType = 'sso_non_provisioned';
            }
            if (info.alreadyExists) {
                errorMessageType = 'account_already_exists';
            }
            if (info.isNitroSsoUser) {
                errorMessageType = 'nitro_sso_extension_needed';
            }
            setLoginErrorType(errorMessageType);
            if (!info.alreadyExists &&
                !info.isSsoNonProvisioned &&
                !info.isSsoUser &&
                !info.isNitroSsoUser &&
                info.isValid) {
                onSubmit({
                    login: currentLogin,
                });
            }
        })
            .catch((error: Error) => {
            lee.dispatchGlobal(websiteLogAction.error({
                message: 'Login validation failed',
                content: { error: error.message },
            }));
        })
            .finally(() => {
            setIsLoading(false);
        });
    };
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (event.key === 'Enter') {
            handleFormSubmitted(event);
        }
    };
    return (<div className={accountCreationStyles.wrapper}>
      <Header />
      <div className={accountCreationStyles.content}>
        <div className={accountCreationStyles.inner}>
          <h1 className={accountCreationStyles.heading}>
            {translate(i18nNamespace + 'info_content_heading')}
          </h1>
          <h2 className={accountCreationStyles.subHeading + ' e2e-createSubHeading'}>
            {translate(i18nNamespace + 'info_content_subheading')}
          </h2>

          <form className={accountCreationStyles.form} onSubmit={handleFormSubmitted}>
            <TextInput id="primaryEmailInput" fullWidth disabled={!!lockedLoginValue} type="email" placeholder={translate(i18nNamespace + 'email_hint_text')} label={translate(i18nNamespace + 'email_floating_label')} ref={infoEmailInput} autoFocus={!loginStored} onBlur={handleLoginBlurred} onChange={handleLoginChanged} onKeyDown={handleKeyDown} defaultValue={login} key={lockedLoginValue ? 'predefined' : 'real'} feedbackText={getErrorText(loginErrorType)} feedbackType={getErrorText(loginErrorType) ? 'error' : undefined}/>

            <div className={accountCreationStyles.formAction}>
              <Button type="submit" sx={{ minWidth: '190px' }} size="large" onClick={handleFormSubmitted} disabled={isLoading}>
                {isLoading ? (<LoadingSpinner size={30} mode="dark"/>) : (translate(i18nNamespace + 'button_next'))}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>);
};

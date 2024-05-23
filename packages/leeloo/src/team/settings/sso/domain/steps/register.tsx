import * as React from 'react';
import classnames from 'classnames';
import { Button, TextInput } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import styles from 'team/settings/sso/domain/steps/styles.css';
const I18N_KEYS = {
    INPUT_PLACEHOLDER: 'team_settings_domain_url_placeholder',
    BUTTON_TEXT: 'team_settings_domain_button_add',
};
interface RegisterDomainProps {
    disabled: boolean;
    registerDomain?: (url: string) => void;
    registrationError?: string;
    domainLoadError?: string;
    clearRegistrationErrors?: () => void;
}
export const RegisterDomain = ({ registerDomain = () => { }, disabled, registrationError, clearRegistrationErrors = () => { }, domainLoadError, }: RegisterDomainProps) => {
    const { translate } = useTranslate();
    const [input, setInput] = React.useState('');
    const onTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (registrationError) {
            clearRegistrationErrors();
        }
        setInput(event.target.value);
    };
    const placeholder = domainLoadError
        ? ''
        : translate(I18N_KEYS.INPUT_PLACEHOLDER);
    return (<>
      <div className={styles.domainUrlInput}>
        <TextInput value={input} placeholder={placeholder} fullWidth feedbackText={registrationError} feedbackType={registrationError ? 'error' : undefined} onChange={onTextInputChange} disabled={!!domainLoadError || disabled}/>
        {domainLoadError && (<p className={styles.domainLoadErrorText}>{domainLoadError}</p>)}
      </div>
      <Button type="button" className={classnames(styles.domainUrlButton, {
            [styles.domainLoadError]: domainLoadError,
        })} disabled={disabled} nature="secondary" onClick={() => registerDomain(input)}>
        {translate(I18N_KEYS.BUTTON_TEXT)}
      </Button>
    </>);
};

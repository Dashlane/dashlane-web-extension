import * as React from 'react';
import FormWrapper from 'app/login/FormWrapper';
import { FormActionsProps } from 'app/login/FormWrapper/FormActions';
import styles from 'app/login/WelcomeStep/styles.css';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    CREATE_ACCOUNT: 'login/welcome_create_account_button',
    DESCRIPTION: 'login/welcome_description',
    HEADING: 'login/welcome_heading',
    LOG_IN: 'login/welcome_log_in_button',
};
interface WelcomeStepProps {
    onCreateAccountClick: () => void;
    onLoginClick: () => void;
}
const WelcomeStep: React.FunctionComponent<WelcomeStepProps> = (props: WelcomeStepProps) => {
    const { translate } = useTranslate();
    const formActionProps: FormActionsProps = {
        isLoading: false,
        primaryButtonText: translate(I18N_KEYS.LOG_IN),
        secondaryButtonText: translate(I18N_KEYS.CREATE_ACCOUNT),
        onSecondaryButtonClick: props.onCreateAccountClick,
    };
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.onLoginClick();
    };
    return (<FormWrapper formActionsProps={formActionProps} handleSubmit={handleFormSubmit}>
      <h1 className={styles.title}>{translate(I18N_KEYS.HEADING)}</h1>
      <p className={styles.description}>{translate(I18N_KEYS.DESCRIPTION)}</p>
    </FormWrapper>);
};
export default React.memo(WelcomeStep);

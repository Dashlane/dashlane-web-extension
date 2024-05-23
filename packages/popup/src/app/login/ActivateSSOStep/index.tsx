import * as React from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import { DASHLANE_SSO_LOGGING_IN_URL, openExternalUrl, } from 'src/libs/externalUrls';
import styles from 'app/login/ActivateSSOStep/styles.css';
import FormWrapper from 'app/login/FormWrapper';
import { FormActionsProps } from 'app/login/FormWrapper/FormActions';
const I18N_KEYS = {
    DESCRIPTION: 'login/activate_sso_description',
    HEADING: 'login/activate_sso_title',
    LEARN_MORE: 'login/activate_sso_button_secondary',
    LOG_IN_WITH_SSO: 'login/activate_sso_button_primary',
};
interface ActivateSSOStepProps {
    onActivateSSOClicked: () => void;
}
const ActivateSSOStep: React.FunctionComponent<ActivateSSOStepProps> = (props: ActivateSSOStepProps) => {
    const { translate } = useTranslate();
    const [loading, setLoading] = React.useState(false);
    const formActionProps: FormActionsProps = {
        isLoading: loading,
        primaryButtonText: translate(I18N_KEYS.LOG_IN_WITH_SSO),
        primaryButtonIsDisabled: false,
        secondaryButtonText: translate(I18N_KEYS.LEARN_MORE),
        onSecondaryButtonClick: () => {
            void openExternalUrl(DASHLANE_SSO_LOGGING_IN_URL);
        },
    };
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        props.onActivateSSOClicked();
    };
    return (<FormWrapper formActionsProps={formActionProps} handleSubmit={handleFormSubmit}>
      <h1 className={styles.title}>{translate(I18N_KEYS.HEADING)}</h1>
      <p className={styles.description}>{translate(I18N_KEYS.DESCRIPTION)}</p>
    </FormWrapper>);
};
export default React.memo(ActivateSSOStep);

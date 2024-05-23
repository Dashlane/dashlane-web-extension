import * as React from 'react';
import { Checkbox, Paragraph, TextInput } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { useAccountContactInfo } from 'webapp/account/hooks/use-contact-info';
import { ChangePlanCard } from '../layout/change-plan-card';
import { isValidEmail } from 'libs/validators';
const I18N_KEYS = {
    HEADER: 'team_account_teamplan_changeplan_billing_contact_header',
    BODY: 'team_account_teamplan_changeplan_billing_contact_copy_markup',
    CHECKBOX: 'team_account_teamplan_changeplan_billing_contact_checkbox_label',
    WARNING: 'team_account_teamplan_changeplan_billing_contact_input_warning',
};
interface Props {
    email: string;
    emailValid: boolean;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    setEmailValid: React.Dispatch<React.SetStateAction<boolean>>;
}
export const BillingContact = ({ email, emailValid, setEmail, setEmailValid, }: Props) => {
    const { translate } = useTranslate();
    const contactInfo = useAccountContactInfo();
    const [isChecked, setIsChecked] = React.useState<boolean>(false);
    const validateEmail = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (isValidEmail(e.currentTarget.value)) {
            setEmailValid(true);
        }
        else {
            setEmailValid(false);
        }
    };
    return contactInfo?.email ? (<ChangePlanCard title={translate(I18N_KEYS.HEADER)}>
      <br />
      
      <Paragraph size="medium" color="ds.text.neutral.quiet" className="automation-tests-tac-billing">
        {translate.markup(I18N_KEYS.BODY, {
            billContactEmail: contactInfo.email,
        })}
      </Paragraph>
      <div style={{ margin: '20px 0px' }}>
        <Checkbox data-testid="additionalEmailCheckbox" label={translate(I18N_KEYS.CHECKBOX)} checked={isChecked} onChange={(e) => {
            setEmail('');
            setEmailValid(true);
            setIsChecked(e.currentTarget.checked);
        }}/>
      </div>

      {isChecked ? (<TextInput data-testid="additionalEmailInput" type="text" onChange={(e) => setEmail(e.currentTarget.value)} onBlur={(e) => validateEmail(e)} value={email} feedbackType={emailValid ? undefined : 'error'} feedbackText={emailValid ? '' : translate(I18N_KEYS.WARNING)} autoFocus/>) : null}
    </ChangePlanCard>) : null;
};

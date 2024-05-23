import React from 'react';
import { colors, DialogTitle, FlexContainer, jsx, Paragraph, Select, TextInput, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { useAllCallingCodesSelectOptions } from 'webapp/utils/hooks/use-calling-codes';
const I18N_KEYS = {
    TITLE: 'webapp_account_security_settings_two_factor_authentication_turn_on_backup_phone_title',
    CONTENT: 'webapp_account_security_settings_two_factor_authentication_turn_on_backup_phone_content',
    COUNTRY_CODE_LABEL: '_common_input_label_country_code',
    PHONE_NUMBER_LABEL: '_common_input_label_backup_phone_number',
};
interface Props {
    setFieldValue: (field: string, value: string) => void;
    countryCode: string;
    phoneNumber: string;
    errorMessage?: string;
    setErrorMessage?: React.Dispatch<React.SetStateAction<string | undefined>>;
}
export const BackupPhoneNumberForm = ({ setFieldValue, countryCode, phoneNumber, errorMessage, setErrorMessage, }: Props) => {
    const { translate } = useTranslate();
    const callingCodeSelectOptions = useAllCallingCodesSelectOptions();
    const onCountryCodeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { target: { value }, } = event;
        setFieldValue('countryCode', value);
    };
    const onPhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { target: { value }, } = event;
        const filteredValue = value.replace(/\D/g, '');
        setFieldValue('phoneNumber', filteredValue);
        setErrorMessage?.(undefined);
    };
    return (<div sx={{
            maxWidth: '480px',
        }}>
      <DialogTitle title={<span sx={{
                display: 'inline-block',
                marginBottom: '16px',
                fontWeight: '500',
                fontSize: '25px',
            }}>
            {translate(I18N_KEYS.TITLE)}
          </span>}/>
      <Paragraph color={colors.grey00} sx={{
            marginBottom: '26px',
        }}>
        {translate(I18N_KEYS.CONTENT)}
      </Paragraph>
      <FlexContainer gap={4} flexWrap="nowrap">
        <Select feedbackId="select2faBackupPhoneCountryCode" data-testid="two-factor-authentication-backup-phone-country-code" value={countryCode} label={translate(I18N_KEYS.COUNTRY_CODE_LABEL)} options={callingCodeSelectOptions} onChange={onCountryCodeChange} sx={{ width: 'auto' }}/>
        <div sx={{
            flex: '1 1 auto',
        }}>
          <TextInput autoFocus={true} type="text" data-testid="two-factor-authentication-backup-phone-number" fullWidth label={translate(I18N_KEYS.PHONE_NUMBER_LABEL)} value={phoneNumber} onChange={onPhoneNumberChange} feedbackType={errorMessage ? 'error' : undefined} feedbackText={errorMessage}/>
        </div>
      </FlexContainer>
    </div>);
};

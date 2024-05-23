import qs from 'query-string';
import { useRef, useState } from 'react';
import { DialogFooter, GridContainer, TextInput, } from '@dashlane/ui-components';
import { jsx } from '@dashlane/design-system';
import { Lee, LEE_INCORRECT_AUTHENTICATION } from 'lee';
import { getAuth } from 'user';
import { Auth } from 'user/types';
import { SimpleDialog } from 'libs/dashlane-style/dialogs/simple/simple-dialog';
import { openUrl } from 'libs/external-urls';
import useTranslate from 'libs/i18n/useTranslate';
import { useAlertQueue } from 'team/alerts/use-alert-queue';
import { useGetTeamName } from 'team/hooks/use-get-team-name';
const I18N_KEYS = {
    RECIPIENT_IS_REQUIRED: 'team_account_past_receipts_dialog_recipient_is_required',
    TITLE: 'team_account_past_receipts_dialog_title',
    BUTTON_GENERATE: 'team_account_past_receipts_dialog_button_generate',
    RECIPIENT: 'team_account_past_receipts_dialog_recipient',
    RECIPIENT_HINT: 'team_account_past_receipts_dialog_recipient_hint',
    COMPANY: 'team_account_past_receipts_dialog_company',
    COMPANY_HINT: 'team_account_past_receipts_dialog_company_hint',
    BILLING_ADDRESS: 'team_account_past_receipts_dialog_billing_address',
    BILLING_ADDRESS_HINT: 'team_account_past_receipts_dialog_billing_address_hint',
    VAT: 'team_account_past_receipts_dialog_vat',
    VAT_HINT: 'team_account_past_receipts_dialog_vat_hint',
};
interface Props {
    isOpen: boolean;
    lee: Lee;
    onClose: () => void;
}
export const PastReceiptsDialog = ({ isOpen, lee, onClose }: Props) => {
    const recipient = useRef<HTMLInputElement>();
    const company = useRef<HTMLInputElement>();
    const billingAddress = useRef<HTMLInputElement>();
    const vat = useRef<HTMLInputElement>();
    const { translate } = useTranslate();
    const { reportTACError } = useAlertQueue();
    const [showRecipientErrorText, setShowRecipientErrorText] = useState(false);
    const teamName = useGetTeamName();
    if (!teamName) {
        return null;
    }
    const closeDialog = () => {
        setShowRecipientErrorText(false);
        onClose();
    };
    const getPdfGenerationOptionsAsSearchParams = (auth: Auth) => {
        const formData = {
            ...auth,
            recipient: recipient.current?.value,
            company: company.current?.value,
            address: billingAddress.current?.value,
            vatNumber: vat.current?.value,
        };
        return qs.stringify(formData);
    };
    const onGenerateReceipts = () => {
        const auth = getAuth(lee.globalState);
        if (!auth) {
            reportTACError(new Error(LEE_INCORRECT_AUTHENTICATION));
            return;
        }
        if (recipient.current?.value) {
            closeDialog();
            try {
                openUrl('*****' +
                    getPdfGenerationOptionsAsSearchParams(auth));
            }
            catch (error) {
                reportTACError(error);
            }
        }
        else {
            setShowRecipientErrorText(true);
        }
    };
    const onKeyDownInRecipientField = () => {
        if (showRecipientErrorText && recipient.current?.value !== '') {
            setShowRecipientErrorText(false);
        }
    };
    const inputFeedbackProps = showRecipientErrorText
        ? {
            feedbackText: translate(I18N_KEYS.RECIPIENT_IS_REQUIRED),
            feedbackType: 'error' as const,
        }
        : {};
    return (<SimpleDialog title={translate(I18N_KEYS.TITLE)} showCloseIcon isOpen={isOpen} onRequestClose={closeDialog} footer={<DialogFooter primaryButtonTitle={translate(I18N_KEYS.BUTTON_GENERATE)} primaryButtonOnClick={onGenerateReceipts}/>}>
      <GridContainer as="form" onSubmit={onGenerateReceipts} gap="1em">
        <TextInput fullWidth label={translate(I18N_KEYS.RECIPIENT) + ' *'} placeholder={translate(I18N_KEYS.RECIPIENT_HINT)} onKeyDown={onKeyDownInRecipientField} ref={recipient} {...inputFeedbackProps}/>

        <TextInput fullWidth label={translate(I18N_KEYS.COMPANY)} defaultValue={teamName} placeholder={translate(I18N_KEYS.COMPANY_HINT)} ref={company}/>

        <TextInput fullWidth label={translate(I18N_KEYS.BILLING_ADDRESS)} placeholder={translate(I18N_KEYS.BILLING_ADDRESS_HINT)} ref={billingAddress}/>

        <TextInput fullWidth label={translate(I18N_KEYS.VAT)} placeholder={translate(I18N_KEYS.VAT_HINT)} ref={vat}/>
      </GridContainer>
    </SimpleDialog>);
};

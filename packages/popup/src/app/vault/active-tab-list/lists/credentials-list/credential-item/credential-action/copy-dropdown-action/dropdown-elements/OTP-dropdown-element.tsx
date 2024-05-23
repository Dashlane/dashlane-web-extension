import * as React from 'react';
import { Field } from '@dashlane/hermes';
import { VaultItemType } from '@dashlane/vault-contracts';
import { DataStatus } from 'src/libs/api/types';
import { CopyDropdownElement } from 'src/app/vault/active-tab-list/lists/common';
import { useCredentialOTPData } from 'src/libs/api';
const I18N_KEYS = {
    COPY_OTP: 'tab/all_items/credential/view/action/copy_otp',
    OTP_COPIED_TO_CLIPBOARD: 'tab/all_items/credential/actions/otp_copied_to_clipboard',
};
interface OTPDropdownElementProps {
    credentialId: string;
}
const OTPDropdownElement = ({ credentialId }: OTPDropdownElementProps) => {
    const credentialOTPData = useCredentialOTPData(credentialId);
    return credentialOTPData.status === DataStatus.Success &&
        credentialOTPData.data &&
        credentialOTPData.data.code ? (<CopyDropdownElement copyValue={credentialOTPData.data.code} credentialId={credentialId} field={Field.OtpSecret} I18N_KEY_text={I18N_KEYS.COPY_OTP} I18N_KEY_notification={I18N_KEYS.OTP_COPIED_TO_CLIPBOARD} itemType={VaultItemType.Credential}/>) : null;
};
export default OTPDropdownElement;

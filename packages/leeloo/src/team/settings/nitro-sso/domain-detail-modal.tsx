import { Dialog, Infobox, jsx, Paragraph } from '@dashlane/design-system';
import { DataStatus, useModuleCommands, useModuleQuery, } from '@dashlane/framework-react';
import { confidentialSSOApi, DomainPendingReason, DomainVerificationStatus, } from '@dashlane/sso-scim-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import { InputWithCopyButton } from 'libs/dashlane-style/text-input-with-action-button/input-with-copy-button.ds';
import { useState } from 'react';
const I18N_KEYS = {
    CLOSE: '_common_dialog_dismiss_button',
    TITLE: 'sso_confidential_verify_domain_modal_title',
    SUBDOMAIN_LABEL: 'sso_confidential_verify_domain_modal_subdomain_label',
    TXT_LABEL: 'sso_confidential_verify_domain_modal_txt_label',
    INSTRUCTION_1: 'sso_confidential_verify_domain_modal_instruction_1',
    INSTRUCTION_2: 'sso_confidential_verify_domain_modal_instruction_2',
    INSTUCTION_3: 'sso_confidential_verify_domain_modal_instruction_3',
    INFOBOX_TITLE: 'sso_confidential_verify_domain_modal_infobox_title',
    VERIFY_DOMAIN_BUTTON: 'sso_confidential_verify_domain_modal_verify_domain_button',
    VERIFY_DOMAIN_BUTTON_RETRY: 'sso_confidential_verify_domain_modal_verify_domain_button_retry',
    VERIFY_DOMAIN_CLOSE: 'sso_confidential_verify_domain_modal_verify_domain_button_close',
    ERROR_INFOBOX_TITLE_INVALID_TOKEN: 'sso_confidential_verify_domain_modal_error_infobox_title_invalid_token',
    ERROR_INFOBOX_TITLE_TOKEN_NOT_FOUND: 'sso_confidential_verify_domain_modal_error_infobox_title_token_not_found',
    ERROR_INFOBOX_DESCRIPTION_TOKEN_NOT_FOUND: 'sso_confidential_verify_domain_modal_error_infobox_description_token_not_found',
    ERROR_INFOBOX_TITLE_GENERIC_ERROR: 'sso_confidential_verify_domain_modal_error_infobox_title_generic_error',
};
type DomainDetailModalProps = {
    domainName: string;
    showModal: boolean;
    onClose: () => void;
};
export const DomainDetailModal = ({ domainName, showModal, onClose, }: DomainDetailModalProps) => {
    const { translate } = useTranslate();
    const ssoProvisioningState = useModuleQuery(confidentialSSOApi, 'ssoProvisioning');
    const { checkDNSValidation } = useModuleCommands(confidentialSSOApi);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    if (ssoProvisioningState.status !== DataStatus.Success) {
        return null;
    }
    const domainInfo = domainName
        ? ssoProvisioningState.data.domainVerificationInfo[domainName]
        : undefined;
    if (!domainInfo) {
        return null;
    }
    const verifyDomain = async () => {
        setIsLoading(true);
        try {
            await checkDNSValidation({ domainName });
        }
        finally {
            setIsLoading(false);
            onClose();
        }
    };
    let buttonCopy = translate(I18N_KEYS.VERIFY_DOMAIN_BUTTON);
    if (domainInfo.verificationStatus === 'valid') {
        buttonCopy = translate(I18N_KEYS.VERIFY_DOMAIN_CLOSE);
    }
    else if ((domainInfo.verificationStatus === 'pending' && domainInfo.pendingReason) ||
        domainInfo.verificationStatus === 'invalid') {
        buttonCopy = translate(I18N_KEYS.VERIFY_DOMAIN_BUTTON_RETRY);
    }
    return (<Dialog closeActionLabel={translate(I18N_KEYS.CLOSE)} title={translate(I18N_KEYS.TITLE, { domainName })} isOpen={showModal} onClose={onClose} actions={{
            primary: {
                children: buttonCopy,
                onClick: domainInfo.verificationStatus === 'valid' ? onClose : verifyDomain,
                isLoading,
            },
        }}>
      <ol sx={{
            listStyleType: 'decimal',
            ml: '20px',
        }}>
        <Paragraph as="li" textStyle="ds.body.standard.regular" color="ds.text.neutral.standard">
          {translate(I18N_KEYS.INSTRUCTION_1)}
        </Paragraph>
        <Paragraph as="li" textStyle="ds.body.standard.regular" color="ds.text.neutral.standard">
          {translate(I18N_KEYS.INSTRUCTION_2)}
        </Paragraph>
        <Paragraph as="li" textStyle="ds.body.standard.regular" color="ds.text.neutral.standard">
          {translate(I18N_KEYS.INSTUCTION_3)}
        </Paragraph>
      </ol>
      <Infobox title={translate(I18N_KEYS.INFOBOX_TITLE)} mood="brand"/>
      <InputWithCopyButton label={translate(I18N_KEYS.SUBDOMAIN_LABEL)} value={domainInfo.subdomainValue ?? ''} readOnly/>
      <InputWithCopyButton label={translate(I18N_KEYS.TXT_LABEL)} value={domainInfo.txtValue ?? ''} readOnly/>
      {domainInfo.verificationStatus ===
            DomainVerificationStatus.enum.pending &&
            domainInfo.pendingReason === DomainPendingReason.enum.invalidToken ? (<Infobox title={translate(I18N_KEYS.ERROR_INFOBOX_TITLE_INVALID_TOKEN)} description={domainInfo.tokenFound} mood="danger" size="medium"/>) : null}
      {domainInfo.verificationStatus ===
            DomainVerificationStatus.enum.pending &&
            domainInfo.pendingReason === DomainPendingReason.enum.tokenNotFound ? (<Infobox title={translate(I18N_KEYS.ERROR_INFOBOX_TITLE_TOKEN_NOT_FOUND)} description={translate(I18N_KEYS.ERROR_INFOBOX_DESCRIPTION_TOKEN_NOT_FOUND)} mood="danger" size="medium"/>) : null}
      {domainInfo.verificationStatus ===
            DomainVerificationStatus.enum.invalid ? (<Infobox title={translate(I18N_KEYS.ERROR_INFOBOX_TITLE_GENERIC_ERROR)} mood="danger" size="medium"/>) : null}
    </Dialog>);
};

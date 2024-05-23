import { memo } from 'react';
import { jsx, useToast } from '@dashlane/design-system';
import { Credential, VaultItemType } from '@dashlane/vault-contracts';
import { Field } from '@dashlane/hermes';
import useTranslate from 'libs/i18n/useTranslate';
import { PasswordField } from 'src/app/vault/detail-views/credential-detail-view/form-fields/password-field';
import { useCopyAction } from 'src/app/vault/detail-views/credential-detail-view/useCopyAction';
import { CopyIconButton } from 'src/app/vault/detail-views/credential-detail-view/form-fields/copy-icon-button';
import { OTP } from 'src/app/vault/detail-views/credential-detail-view/form-fields/OTP/OTP';
import Input from 'src/components/inputs/common/input/input';
import TextareaInput from 'src/components/inputs/common/text-area-input/text-area-input';
import LinkedWebsitesCount from 'src/app/vault/detail-views/credential-detail-view/linked-websites-count/linked-websites-count';
import { OpenWebsiteIconButton } from 'src/app/vault/detail-views/credential-detail-view/form-fields/open-website-icon-button';
import { openCredentialWebsite } from '../helpers';
export const I18N_KEYS = {
    EMAIL_COPIED: 'tab/all_items/credential/actions/email_copied_to_clipboard',
    LOGIN_COPIED: 'tab/all_items/credential/actions/login_copied_to_clipboard',
    SECONDARY_LOGIN_COPIED: 'tab/all_items/credential/actions/secondary_login_copied_to_clipboard',
    NOTE_COPIED: 'tab/all_items/credential/actions/note_copied_to_clipboard',
    EMAIL_LABEL: 'tab/all_items/credential/view/label/email',
    EMAIL_COPY: 'tab/all_items/credential/view/action/copy_email',
    LOGIN_LABEL: 'tab/all_items/credential/view/label/login',
    LOGIN_COPY: 'tab/all_items/credential/view/action/copy_login',
    SECONDARY_LOGIN_LABEL: 'tab/all_items/credential/view/label/secondary_login',
    SECONDARY_LOGIN_COPY: 'tab/all_items/credential/view/action/copy_secondary_login',
    WEBSITE_LABEL: 'tab/all_items/credential/view/label/website',
    WEBSITE_OPEN: 'tab/all_items/credential/view/action/go_to_website',
    WEBSITE_OPEN_A11Y: 'tab/all_items/credential/view/action/go_to_website_a11y',
    LINKED_WEBSITE_COUNT_SINGLE: 'tab/all_items/credential/view/sublabel/linked_websites_one_item',
    LINKED_WEBSITE_COUNT_MULTI: 'tab/all_items/credential/view/sublabel/linked_websites_count',
    LINKED_WEBSITES_TITLE: 'tab/all_items/credential/linked_websites_view/title',
    NOTE_LABEL: 'tab/all_items/credential/view/label/note',
    NOTE_COPY: 'tab/all_items/credential/view/action/copy_note',
};
interface CredentialDetailFormProps {
    credential: Credential;
    dashlaneDefinedLinkedWebsites: string[];
    openLinkedWebsites: () => void;
}
const CredentialDetailFormComponent = ({ credential, dashlaneDefinedLinkedWebsites, openLinkedWebsites, }: CredentialDetailFormProps) => {
    const { translate } = useTranslate();
    const { showToast } = useToast();
    const numberOfUserAddedLinkedWebsites = credential.linkedURLs.length;
    const numberOfDashlaneAddedLinkedWebsites = dashlaneDefinedLinkedWebsites.length;
    let totalNumberOfLinkedWebsites = 0;
    if (numberOfDashlaneAddedLinkedWebsites > 1) {
        totalNumberOfLinkedWebsites =
            numberOfDashlaneAddedLinkedWebsites + numberOfUserAddedLinkedWebsites;
    }
    else {
        totalNumberOfLinkedWebsites = numberOfUserAddedLinkedWebsites;
    }
    const linkedWebsitesTranslation = totalNumberOfLinkedWebsites === 1
        ? translate(I18N_KEYS.LINKED_WEBSITE_COUNT_SINGLE)
        : translate(I18N_KEYS.LINKED_WEBSITE_COUNT_MULTI, {
            count: totalNumberOfLinkedWebsites,
        });
    const emailCopyAction = useCopyAction({
        toastString: translate(I18N_KEYS.EMAIL_COPIED),
        showToast,
        itemType: VaultItemType.Credential,
        field: Field.Email,
        itemId: credential.id,
        itemUrl: credential.URL,
        isProtected: false,
        value: credential.email,
    });
    const loginCopyAction = useCopyAction({
        toastString: translate(I18N_KEYS.LOGIN_COPIED),
        showToast,
        itemType: VaultItemType.Credential,
        field: Field.Login,
        itemId: credential.id,
        itemUrl: credential.URL,
        isProtected: false,
        value: credential.username,
    });
    const secondaryLoginCopyAction = useCopyAction({
        toastString: translate(I18N_KEYS.SECONDARY_LOGIN_COPIED),
        showToast,
        itemType: VaultItemType.Credential,
        field: Field.SecondaryLogin,
        itemId: credential.id,
        itemUrl: credential.URL,
        isProtected: false,
        value: credential.alternativeUsername ?? '',
    });
    const noteCopyAction = useCopyAction({
        toastString: translate(I18N_KEYS.NOTE_COPIED),
        showToast,
        itemType: VaultItemType.Credential,
        field: Field.Note,
        itemId: credential.id,
        itemUrl: credential.URL,
        isProtected: false,
        value: credential.note ?? '',
    });
    return (<div sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            padding: '16px 16px 0',
            overflowY: 'auto',
        }}>
      {credential.email ? (<Input id={'email'} label={translate(I18N_KEYS.EMAIL_LABEL)} value={credential.email} readonly={true} actions={<CopyIconButton text={translate(I18N_KEYS.EMAIL_COPY)} copyAction={() => {
                    void emailCopyAction();
                }}/>} inputType={'text'}/>) : null}
      {credential.username ? (<Input id={'login'} label={translate(I18N_KEYS.LOGIN_LABEL)} value={credential.username} readonly={true} actions={<CopyIconButton text={translate(I18N_KEYS.LOGIN_COPY)} copyAction={() => {
                    void loginCopyAction();
                }}/>} inputType={'text'}/>) : null}
      {credential.alternativeUsername ? (<Input id={'secondary_login'} label={translate(I18N_KEYS.SECONDARY_LOGIN_LABEL)} value={credential.alternativeUsername} readonly={true} actions={<CopyIconButton text={translate(I18N_KEYS.SECONDARY_LOGIN_COPY)} copyAction={() => {
                    void secondaryLoginCopyAction();
                }}/>} inputType={'text'}/>) : null}
      {credential.password ? <PasswordField credential={credential}/> : null}
      {credential.otpURL ? (<OTP credentialUrl={credential.URL} credentialId={credential.id}/>) : null}
      {credential.URL ? (<Input id={'website'} label={translate(I18N_KEYS.WEBSITE_LABEL)} value={credential.URL} inputType={'text'} actions={<OpenWebsiteIconButton text={translate(I18N_KEYS.WEBSITE_OPEN)} onClick={() => {
                    void openCredentialWebsite(credential.id, credential.URL);
                }} ariaLabel={translate(I18N_KEYS.WEBSITE_OPEN_A11Y, {
                    value: credential.URL,
                })}/>} readonly={true}/>) : null}
      {credential.linkedURLs && totalNumberOfLinkedWebsites ? (<LinkedWebsitesCount linkedWebsitesTitle={translate(I18N_KEYS.LINKED_WEBSITES_TITLE)} value={linkedWebsitesTranslation} onClick={() => openLinkedWebsites()}/>) : null}
      {credential.note ? (<TextareaInput id={'note'} label={translate(I18N_KEYS.NOTE_LABEL)} value={credential.note} actions={<CopyIconButton text={translate(I18N_KEYS.NOTE_COPY)} copyAction={() => {
                    void noteCopyAction();
                }}/>}/>) : null}
    </div>);
};
export const CredentialDetailForm = memo(CredentialDetailFormComponent);

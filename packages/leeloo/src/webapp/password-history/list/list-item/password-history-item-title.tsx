import * as React from 'react';
import { ParsedURL } from '@dashlane/url-parser';
import { AllowedThumbnailIcons } from '@dashlane/ui-components';
import { PasswordHistoryItemType, PasswordHistoryItemView, } from '@dashlane/communication';
import { VaultItemType } from '@dashlane/vault-contracts';
import { CredentialInfo } from 'libs/dashlane-style/credential-info/credential-info';
import useTranslate from 'libs/i18n/useTranslate';
import { logSelectCredential } from 'libs/logs/events/vault/select-item';
import { useHistory, useLocation, useRouterGlobalSettingsContext, } from 'libs/router';
import styles from '../../styles.css';
const I18N_KEYS = {
    GENERATED_WITHOUT_URL: 'webapp_password_history_item_no_url_main',
    GENERATED_WITH_URL: 'webapp_password_history_item_some_url_main',
    SUBTITLE_GENERATED_WITHOUT_URL: 'webapp_password_history_item_no_url_subtitle',
    SUBTITLE_NO_LOGIN: 'webapp_password_history_item_some_url_subtitle',
};
export const PasswordHistoryItemTitle = (props: {
    item: PasswordHistoryItemView;
    onCreateNewCredential: (generatedPassword: string, website?: string) => void;
}) => {
    const { item, onCreateNewCredential } = props;
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const history = useHistory();
    const { pathname } = useLocation();
    if (item.type === PasswordHistoryItemType.Credential) {
        const onClick = () => {
            history.push(routes.userVaultItem(item.credentialId, VaultItemType.Credential, pathname));
            logSelectCredential(item.credentialId);
        };
        const subtitle = item.secondaryInfo || translate(I18N_KEYS.SUBTITLE_NO_LOGIN);
        return (<div className={styles.primaryInfo} onClick={onClick}>
        <CredentialInfo title={item.primaryInfo} login={subtitle} shared={item.sharingStatus.isShared} sxProps={{
                maxWidth: '350px',
                minWidth: 0,
                marginRight: '8px',
            }} domain={item.domain}/>
      </div>);
    }
    if (new ParsedURL(item.primaryInfo).isUrlValid()) {
        const onClick = () => onCreateNewCredential(item.password, item.primaryInfo);
        const title = translate(I18N_KEYS.GENERATED_WITH_URL, {
            domain: item.primaryInfo,
        });
        const subtitle = translate(I18N_KEYS.SUBTITLE_NO_LOGIN);
        return (<div className={styles.primaryInfo} onClick={onClick}>
        <CredentialInfo title={title} login={subtitle} sxProps={{
                maxWidth: '350px',
                minWidth: 0,
                marginRight: '8px',
            }} nativeIcon={AllowedThumbnailIcons.Generator}/>
      </div>);
    }
    const title = translate(I18N_KEYS.GENERATED_WITHOUT_URL);
    const subtitle = translate(I18N_KEYS.SUBTITLE_GENERATED_WITHOUT_URL);
    const onClick = () => onCreateNewCredential(item.password);
    return (<div className={styles.primaryInfo} onClick={onClick}>
      <CredentialInfo title={title} login={subtitle} sxProps={{
            maxWidth: '350px',
            minWidth: 0,
            marginRight: '8px',
        }} nativeIcon={AllowedThumbnailIcons.Generator}/>
    </div>);
};

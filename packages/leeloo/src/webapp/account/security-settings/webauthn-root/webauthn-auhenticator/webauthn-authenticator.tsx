import React from 'react';
import { colors, DotsIcon, DropdownElement, DropdownMenu, FlexContainer, IconButton, Paragraph, TrashIcon, } from '@dashlane/ui-components';
import { AuthenticatorDetails } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import styles from './webauthn-authenticator.css';
export interface Props {
    authenticator: AuthenticatorDetails;
    onRemoveAuthenticator: (credentialId: string) => void;
}
const I18N_KEYS = {
    METHODS_MENU_TITLE: 'webapp_account_security_settings_passwordless_login_methods_menu_title',
    METHODS_MENU_DELETE: 'webapp_account_security_settings_passwordless_login_methods_menu_delete',
    METHODS_MENU_RENAME: 'webapp_account_security_settings_passwordless_login_methods_menu_rename',
    METHODS_MENU_ACTIVITY: 'webapp_account_security_settings_passwordless_login_methods_menu_activity',
};
export const WebAuthnAuthenticator = ({ authenticator, onRemoveAuthenticator, }: Props) => {
    const { credentialId, name } = authenticator;
    const { translate } = useTranslate();
    const [dropdownIsOpen, setDropdownIsOpen] = React.useState(false);
    const onToggleDropdown: React.MouseEventHandler = (e) => {
        e.stopPropagation();
        setDropdownIsOpen(!dropdownIsOpen);
    };
    const onRemove: React.MouseEventHandler = () => {
        onRemoveAuthenticator(credentialId);
    };
    const dropdownActionButtons = (<DropdownElement onClick={onRemove}>
      <FlexContainer flexDirection="row" flexWrap="nowrap" alignItems="center">
        <TrashIcon size={16} aria-hidden="true"/>
        <Paragraph size="small" color={colors.dashGreen00} bold>
          {translate(I18N_KEYS.METHODS_MENU_DELETE)}
        </Paragraph>
      </FlexContainer>
    </DropdownElement>);
    return (<li className={styles.authenticator}>
      <FlexContainer justifyContent="space-between" alignItems="center" gap="30px">
        <Paragraph>{name}</Paragraph>
        <div className={styles.dropdownContainer}>
          <DropdownMenu offset={[0, 4]} placement="bottom-end" content={dropdownActionButtons}>
            <IconButton type="button" size="small" onClick={onToggleDropdown} aria-label={translate(I18N_KEYS.METHODS_MENU_TITLE)} title={translate(I18N_KEYS.METHODS_MENU_TITLE)} icon={<DotsIcon size={20} rotate={90}/>}/>
          </DropdownMenu>
        </div>
      </FlexContainer>
    </li>);
};

import React from 'react';
import classnames from 'classnames';
import { ArrowDownIcon, Button, RefreshIcon, SettingsIcon, } from '@dashlane/ui-components';
import { Dropdown, DropdownAlignment, DropdownPosition, } from 'libs/dashlane-style/dropdown';
import ButtonDropdown from 'libs/dashlane-style/buttons/modern/dropdown';
import useTranslate from 'libs/i18n/useTranslate';
import styles from './styles.css';
const I18N_KEYS = {
    SETTINGS: 'webapp_family_dashboard_settings',
    MY_ACCOUNT: 'webapp_family_dashboard_settings_my_account',
    RESET_INVITATION_LINK: 'webapp_family_dashboard_settings_reset_invitation_link',
};
interface Props {
    onMyAccountClick: () => void;
    onResetLinkClick: () => void;
}
export const FamilySettings = ({ onMyAccountClick, onResetLinkClick, }: Props) => {
    const { translate } = useTranslate();
    const [dropdownIsOpen, setDropdownIsOpen] = React.useState(false);
    const renderButton = (toggle: () => void) => (<Button type="button" nature="ghost" className={styles.dropdownButton} onClick={toggle}>
      {translate(I18N_KEYS.SETTINGS)}
      <span className={classnames(styles.dropdownButtonIcon, {
            [styles.dropdownButtonIconReversed]: dropdownIsOpen,
        })}>
        <ArrowDownIcon />
      </span>
    </Button>);
    const renderDropdownContent = () => (<div className={styles.list}>
      <ButtonDropdown label={translate(I18N_KEYS.MY_ACCOUNT)} data-close-dropdown icon={<SettingsIcon />} onClick={onMyAccountClick}/>
      <ButtonDropdown label={translate(I18N_KEYS.RESET_INVITATION_LINK)} data-close-dropdown icon={<RefreshIcon />} onClick={onResetLinkClick}/>
    </div>);
    return (<div className={styles.familySettings}>
      <Dropdown alignment={DropdownAlignment.End} position={DropdownPosition.Bottom} onToggle={() => setDropdownIsOpen(!dropdownIsOpen)} withBackdrop={false} renderRoot={(toggle) => renderButton(toggle)}>
        {renderDropdownContent()}
      </Dropdown>
    </div>);
};

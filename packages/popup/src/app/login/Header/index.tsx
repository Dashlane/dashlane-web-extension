import * as React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Lockup, LockupColor, LockupSize } from '@dashlane/ui-components';
import DropdownMenu, { MenuItem, } from 'src/components/dropdown/dropdown-menu/dropdown';
import useTranslate from 'libs/i18n/useTranslate';
import { ThemeEnum } from 'libs/helpers-types';
import lockupTransition from 'app/login/lockup-transition.css';
import styles from './styles.css';
import { useLogout } from 'src/libs/hooks/useLogout';
export interface HeaderProps {
    login: string;
    localAccountsLogin: string[];
    onSelectLogin: (newLogin: string) => void;
    onOtherAccountClick: () => void;
    onNewAccountClick: () => void;
    hideDropdown?: boolean;
    setAnimationRunning: (animationRunning: boolean) => void;
    showLogoutDropdown: boolean;
}
const animationTimeMs = 300;
const I18N_KEYS = {
    LOG_OUT: 'login/log_out',
    NEW_ACCOUNT: 'login/action_new_account',
    OTHER_ACCOUNT: 'login/action_other_account',
    LOGO: 'login/logo_a11y',
};
const Header: React.FunctionComponent<HeaderProps> = ({ login, localAccountsLogin, onSelectLogin, onOtherAccountClick, onNewAccountClick, hideDropdown, setAnimationRunning, showLogoutDropdown, }: HeaderProps) => {
    const { translate } = useTranslate();
    const logout = useLogout();
    const loginItems: MenuItem[] = localAccountsLogin.sort().map((localLogin) => {
        return {
            label: localLogin,
            onClick: () => {
                onSelectLogin(localLogin);
            },
            isSecondaryOption: false,
        };
    });
    const menuItems: MenuItem[] = loginItems.concat([
        {
            label: translate(I18N_KEYS.OTHER_ACCOUNT),
            onClick: onOtherAccountClick,
            isSecondaryOption: true,
        },
        {
            label: translate(I18N_KEYS.NEW_ACCOUNT),
            onClick: onNewAccountClick,
            isSecondaryOption: true,
        },
    ]);
    const handleLogoutClick = React.useCallback(() => {
        logout();
    }, []);
    const logoutDropdownMenuItems: MenuItem[] = [
        {
            label: translate(I18N_KEYS.LOG_OUT),
            onClick: handleLogoutClick,
            isSecondaryOption: false,
        },
    ];
    return (<div className={styles.header}>
      <div className={styles.lockupContainer} tabIndex={0} aria-label={translate(I18N_KEYS.LOGO)} role="img">
        <CSSTransition appear in={true} classNames={{ ...lockupTransition }} timeout={animationTimeMs} onEnter={() => {
            setAnimationRunning(true);
            setTimeout(() => setAnimationRunning(false), animationTimeMs + 20);
        }}>
          <Lockup color={LockupColor.White} size={LockupSize.Size39}/>
        </CSSTransition>
      </div>
      {showLogoutDropdown ? (<DropdownMenu title={login} items={logoutDropdownMenuItems} theme={ThemeEnum.Dark}/>) : null}
      {!hideDropdown ? (<DropdownMenu title={login} items={menuItems} theme={ThemeEnum.Dark}/>) : null}
    </div>);
};
export default React.memo(Header);

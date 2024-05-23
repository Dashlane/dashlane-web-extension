import { MouseEvent, useState } from 'react';
import classnames from 'classnames';
import { browser } from '@dashlane/browser-utils';
import { Button, Icon, jsx } from '@dashlane/design-system';
import { colors } from '@dashlane/ui-components';
import { DataStatus } from '@dashlane/framework-react';
import { Lee } from 'lee';
import { openUrl } from 'libs/external-urls';
import { useIsPersonalSpaceDisabled } from 'libs/hooks/use-is-personal-space-disabled';
import useTranslate from 'libs/i18n/useTranslate';
import { redirect, useRouterGlobalSettingsContext } from 'libs/router';
import { TEAM_CONSOLE_URL_SEGMENT } from 'app/routes/constants';
import { DOWNLOAD_DASHLANE } from 'team/urls';
import { accountPanelIgnoreClickOutsideClassName, editPanelIgnoreClickOutsideClassName, } from 'webapp/variables';
import { OpenAdminConsoleDialog } from 'webapp/open-admin-console-dialog/open-admin-console-dialog';
import OnboardingIcon from './images/lightbulb.svg?inline';
import { useSideMenuCollapsedContext } from './side-menu-collapsed-context';
import { CollectionsMenu } from './collections-menu';
import { Search } from './search/search';
import { SpacesSwitch } from './spaces-switch/spaces-switch';
import { SidemenuSection } from './section';
import { MenuItem, Props as MenuItemProps } from './menu-item';
import styles from './styles.css';
interface Props {
    centerMenu: MenuItemProps[];
    hasOnboardingPage: () => boolean;
    hasSpaceId: boolean;
    internallyCollapsedForSearch: boolean;
    isMaintenanceCategoryEnabled: boolean;
    lee: Lee;
    setInternallyCollapsedForSearch: (value: boolean) => void;
    topMenu: MenuItemProps[];
}
const I18N_KEYS = {
    ACCOUNT: 'webapp_sidemenu_item_account',
    MAINTENANCE: 'webapp_sidemenu_category_maintenance',
    ONBOARDING: 'webapp_sidemenu_item_onboarding',
    ACCOUNT_RECOVERY_TITLE: 'webapp_account_recovery_activation_sidemenu_notification_title',
    ACCOUNT_RECOVERY_DESCRIPTION: 'webapp_account_recovery_activation_sidemenu_notification_description_markup',
    ACCOUNT_RECOVERY_CONFIRMATION_LABEL: 'webapp_account_recovery_activation_sidemenu_notification_confirmation_label',
    TOGGLE_NAV: 'webapp_sidemenu_toggle_navigation',
    INSTALL_EXTENSION_BUTTON: 'webapp_sidemenu_install_extension_navigation_cta',
    OPEN_ADMIN_CONSOLE_BUTTON: 'webapp_sidemenu_open_admin_console_btn',
};
export const Menu = (props: Props) => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const isPersonalSpaceDisabled = useIsPersonalSpaceDisabled();
    const { isSideMenuCollapsed, toggleSideMenu, openSideMenu } = useSideMenuCollapsedContext();
    const [openModal, setOpenModal] = useState(false);
    const isAdmin = props.lee.permission.adminAccess.hasTACAccess;
    const containerClasses = classnames(styles.wrapper, {
        [styles.collapsed]: isSideMenuCollapsed,
        [styles.collapsedForSearch]: props.internallyCollapsedForSearch,
    });
    const isInExtensionOrDesktop = APP_PACKAGED_IN_EXTENSION || APP_PACKAGED_IN_DESKTOP;
    const handleNavigateClickAction = (e?: MouseEvent<HTMLButtonElement>) => {
        e?.preventDefault();
        if (!isAdmin && !isInExtensionOrDesktop) {
            openUrl(DOWNLOAD_DASHLANE);
        }
        else if (!isInExtensionOrDesktop && isAdmin) {
            setOpenModal(true);
        }
        else if (isAdmin) {
            redirect(TEAM_CONSOLE_URL_SEGMENT);
        }
    };
    return (<nav className={containerClasses}>
      <div sx={{ marginBottom: '80px' }}>
        
        <div className={classnames(styles.topRow, {
            [styles.collapsed]: isSideMenuCollapsed,
        })}>
          <button type="button" sx={{
            outlineColor: 'ds.oddity.focus',
        }} className={classnames(styles.collapseButton, editPanelIgnoreClickOutsideClassName, accountPanelIgnoreClickOutsideClassName)} aria-label={translate(I18N_KEYS.TOGGLE_NAV)} onClick={toggleSideMenu}/>

          <Search disabled={isSideMenuCollapsed} lee={props.lee} onInputChange={(hasContent) => props.setInternallyCollapsedForSearch(hasContent)} onInputFocus={openSideMenu} handleClickOutsideSearch={() => props.setInternallyCollapsedForSearch(false)}/>
        </div>
        <div className={styles.menuWrapper}>
          {props.hasOnboardingPage() ? (<MenuItem to={routes.userOnboarding} wrapperClass={styles.onboarding} icon={OnboardingIcon} text={I18N_KEYS.ONBOARDING}/>) : null}

          {props.hasSpaceId &&
            isPersonalSpaceDisabled.status === DataStatus.Success &&
            !isPersonalSpaceDisabled.isDisabled ? (<SpacesSwitch lee={props.lee}/>) : null}

          <SidemenuSection>
            {props.topMenu.map((menu) => (<MenuItem {...menu} key={menu.to}/>))}
          </SidemenuSection>

          {props.isMaintenanceCategoryEnabled ? (<SidemenuSection isCollapsed={isSideMenuCollapsed || props.internallyCollapsedForSearch} title={translate(I18N_KEYS.MAINTENANCE)} className={classnames({
                [styles.securityCategoryCollapsed]: isSideMenuCollapsed || props.internallyCollapsedForSearch,
            })}>
              {props.centerMenu.map((menu) => (<MenuItem {...menu} key={menu.to}/>))}
            </SidemenuSection>) : null}

          {!props.internallyCollapsedForSearch && <CollectionsMenu />}
          <OpenAdminConsoleDialog showAdminConsoleModal={openModal} setShowAdminConsoleModal={setOpenModal}/>
          {isAdmin || (!isInExtensionOrDesktop && !browser.isSafari()) ? (<div sx={{
                display: 'flex',
                justifyContent: isSideMenuCollapsed ? 'left' : 'center',
                marginTop: '25px',
                borderTopWidth: '1px',
                borderTopStyle: 'solid',
                borderTopColor: colors.midGreen04,
                paddingRight: '4px',
                position: 'fixed',
                bottom: '0',
                margin: '0 auto',
                width: '320px',
                backgroundColor: colors.midGreen05,
            }}>
              <Button layout={isSideMenuCollapsed
                ? 'iconOnly'
                : isAdmin
                    ? 'iconLeading'
                    : 'iconTrailing'} aria-label={translate(I18N_KEYS.INSTALL_EXTENSION_BUTTON)} onClick={handleNavigateClickAction} sx={{
                margin: isSideMenuCollapsed
                    ? '20px 4px 20px 4px'
                    : '20px 25px',
            }} icon={isAdmin ? (<Icon name="DashboardOutlined" size="large" color="ds.text.inverse.catchy"/>) : (<Icon name="ActionOpenExternalLinkOutlined" size="large" color="ds.text.inverse.catchy"/>)} mood="brand" intensity="catchy" fullsize={!isSideMenuCollapsed}>
                {isAdmin
                ? translate(I18N_KEYS.OPEN_ADMIN_CONSOLE_BUTTON)
                : translate(I18N_KEYS.INSTALL_EXTENSION_BUTTON)}
              </Button>
            </div>) : null}
        </div>
      </div>
    </nav>);
};

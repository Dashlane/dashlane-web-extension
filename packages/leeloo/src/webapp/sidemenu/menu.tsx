import { MouseEvent, useState } from "react";
import classnames from "classnames";
import { browser } from "@dashlane/browser-utils";
import { Button, DSStyleObject, Icon, mergeSx } from "@dashlane/design-system";
import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
import { DataStatus, useFeatureFlip } from "@dashlane/framework-react";
import { Lee } from "../../lee";
import { openUrl } from "../../libs/external-urls";
import { useIsPersonalSpaceDisabled } from "../../libs/hooks/use-is-personal-space-disabled";
import useTranslate from "../../libs/i18n/useTranslate";
import { redirect, useRouterGlobalSettingsContext } from "../../libs/router";
import { TEAM_CONSOLE_URL_SEGMENT } from "../../app/routes/constants";
import { DOWNLOAD_DASHLANE } from "../../team/urls";
import {
  accountPanelIgnoreClickOutsideClassName,
  editPanelIgnoreClickOutsideClassName,
} from "../variables";
import { logOpenAdminConsoleFromVaultOnClick } from "../navigate-tac-vault-dialog/logs";
import { NavigateTacVaultDialog } from "../navigate-tac-vault-dialog/navigate-tac-vault-dialog";
import { useSideMenuCollapsedContext } from "./side-menu-collapsed-context";
import { CollectionsMenu } from "./collections-menu";
import { SearchMenuItem } from "./search/search-menu-item";
import { Search } from "./search/search";
import { SpacesSwitch } from "./spaces-switch/spaces-switch";
import { SidemenuSection } from "./section";
import { MenuItem, Props as MenuItemProps } from "./menu-item";
import styles from "./styles.css";
interface Props {
  centerMenu: MenuItemProps[];
  hasOnboardingPage: boolean;
  hasSpaceId: boolean;
  internallyCollapsedForSearch: boolean;
  lee: Lee;
  setInternallyCollapsedForSearch: (value: boolean) => void;
  topMenu: MenuItemProps[];
}
const config = {
  width: 320,
  padding: 0,
};
const SX_STYLES: Record<string, Partial<DSStyleObject>> = {
  ROOT: {
    backgroundColor: "ds.container.agnostic.neutral.standard",
    width: `${config.width}px`,
    padding: `${config.padding}px`,
    boxSizing: "border-box",
  },
  INSTALL_EXTENSION: {
    position: "fixed",
    bottom: "0",
    width: `calc(${config.width}px - (2 * ${config.padding}px))`,
    display: "flex",
    margin: "0 auto",
    backgroundColor: "ds.container.agnostic.neutral.standard",
    borderTop: "1px solid ds.border.neutral.quiet.idle",
  },
};
const I18N_KEYS = {
  ACCOUNT: "webapp_sidemenu_item_account",
  MAINTENANCE: "webapp_sidemenu_category_maintenance",
  ONBOARDING: "webapp_sidemenu_item_onboarding",
  ACCOUNT_RECOVERY_TITLE:
    "webapp_account_recovery_activation_sidemenu_notification_title",
  ACCOUNT_RECOVERY_DESCRIPTION:
    "webapp_account_recovery_activation_sidemenu_notification_description_markup",
  ACCOUNT_RECOVERY_CONFIRMATION_LABEL:
    "webapp_account_recovery_activation_sidemenu_notification_confirmation_label",
  TOGGLE_NAV: "webapp_sidemenu_toggle_navigation",
  INSTALL_EXTENSION_BUTTON: "webapp_sidemenu_install_extension_navigation_cta",
  OPEN_ADMIN_CONSOLE_BUTTON: "webapp_sidemenu_open_admin_console_btn",
};
export const Menu = (props: Props) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const isPersonalSpaceDisabled = useIsPersonalSpaceDisabled();
  const { isSideMenuCollapsed, toggleSideMenu, openSideMenu } =
    useSideMenuCollapsedContext();
  const [openModal, setOpenModal] = useState(false);
  const isAdmin = props.lee.permission.adminAccess.hasTACAccess;
  const containerClasses = classnames(styles.wrapper, {
    [styles.collapsed]: isSideMenuCollapsed,
    [styles.collapsedForSearch]: props.internallyCollapsedForSearch,
  });
  const isInExtensionOrDesktop =
    APP_PACKAGED_IN_EXTENSION || APP_PACKAGED_IN_DESKTOP;
  const isSearchRevampEnabled = useFeatureFlip(
    FEATURE_FLIPS_WITHOUT_MODULE.SearchRevamp
  );
  const handleNavigateClickAction = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    if (!isAdmin && !isInExtensionOrDesktop) {
      openUrl(DOWNLOAD_DASHLANE);
    } else if (!isInExtensionOrDesktop && isAdmin) {
      logOpenAdminConsoleFromVaultOnClick();
      setOpenModal(true);
    } else if (isAdmin) {
      redirect(TEAM_CONSOLE_URL_SEGMENT);
    }
  };
  return (
    <nav className={containerClasses} sx={SX_STYLES.ROOT}>
      <div sx={{ marginBottom: "80px" }}>
        <div
          className={classnames(styles.topRow, {
            [styles.collapsed]: isSideMenuCollapsed,
          })}
        >
          <div
            className={classnames(
              styles.collapseButton,
              editPanelIgnoreClickOutsideClassName,
              accountPanelIgnoreClickOutsideClassName
            )}
          >
            <Button
              mood="neutral"
              intensity="supershy"
              layout="iconOnly"
              icon="MenuOutlined"
              aria-label={translate(I18N_KEYS.TOGGLE_NAV)}
              onClick={toggleSideMenu}
              data-testid="sidemenu-collapse-button"
              sx={{
                "&:focus,&:active,&:hover": {
                  backgroundColor: "unset",
                },
              }}
            />
          </div>

          {isSearchRevampEnabled ? (
            <SearchMenuItem />
          ) : (
            <Search
              disabled={isSideMenuCollapsed}
              lee={props.lee}
              onInputChange={(hasContent) =>
                props.setInternallyCollapsedForSearch(hasContent)
              }
              onInputFocus={openSideMenu}
              handleClickOutsideSearch={() =>
                props.setInternallyCollapsedForSearch(false)
              }
            />
          )}
        </div>
        <div className={styles.menuWrapper}>
          {props.hasOnboardingPage ? (
            <MenuItem
              to={routes.userOnboarding}
              wrapperClass={styles.onboarding}
              iconName={"TipOutlined"}
              text={I18N_KEYS.ONBOARDING}
            />
          ) : null}

          {props.hasSpaceId &&
          isPersonalSpaceDisabled.status === DataStatus.Success &&
          !isPersonalSpaceDisabled.isDisabled ? (
            <SpacesSwitch lee={props.lee} />
          ) : null}

          <SidemenuSection>
            {props.topMenu.map((menu) => (
              <MenuItem {...menu} key={menu.to} />
            ))}
          </SidemenuSection>

          <SidemenuSection
            isCollapsed={
              isSideMenuCollapsed || props.internallyCollapsedForSearch
            }
            title={translate(I18N_KEYS.MAINTENANCE)}
            className={classnames({
              [styles.securityCategoryCollapsed]:
                isSideMenuCollapsed || props.internallyCollapsedForSearch,
            })}
          >
            {props.centerMenu.map((menu) => (
              <MenuItem {...menu} key={menu.to} />
            ))}
          </SidemenuSection>

          {!props.internallyCollapsedForSearch && <CollectionsMenu />}
          <NavigateTacVaultDialog
            isShown={openModal}
            setIsShown={setOpenModal}
            isFromVault={true}
          />
          {isAdmin || (!isInExtensionOrDesktop && !browser.isSafari()) ? (
            <div
              sx={mergeSx([
                SX_STYLES.INSTALL_EXTENSION,
                {
                  justifyContent: isSideMenuCollapsed ? "left" : "center",
                },
              ])}
            >
              <Button
                layout={
                  isSideMenuCollapsed
                    ? "iconOnly"
                    : isAdmin
                    ? "iconLeading"
                    : "iconTrailing"
                }
                aria-label={translate(I18N_KEYS.INSTALL_EXTENSION_BUTTON)}
                onClick={handleNavigateClickAction}
                sx={{
                  margin: isSideMenuCollapsed
                    ? "20px 4px 20px 4px"
                    : "20px 25px",
                }}
                icon={
                  isAdmin ? (
                    <Icon
                      name="DashboardOutlined"
                      size="large"
                      color="ds.text.inverse.catchy"
                    />
                  ) : (
                    <Icon
                      name="ActionOpenExternalLinkOutlined"
                      size="large"
                      color="ds.text.inverse.catchy"
                    />
                  )
                }
                mood="brand"
                intensity="catchy"
                fullsize={!isSideMenuCollapsed}
              >
                {isAdmin
                  ? translate(I18N_KEYS.OPEN_ADMIN_CONSOLE_BUTTON)
                  : translate(I18N_KEYS.INSTALL_EXTENSION_BUTTON)}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

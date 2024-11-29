import { useEffect } from "react";
import { Dialog } from "@dashlane/design-system";
import { PageView } from "@dashlane/hermes";
import { openUrl } from "../../libs/external-urls";
import useTranslate from "../../libs/i18n/useTranslate";
import { logPageView } from "../../libs/logs/logEvent";
import { useUserLogin } from "../../libs/hooks/useUserLogin";
import { useOpenTeamConsole } from "../../libs/hooks/use-open-team-console";
import { useRouterGlobalSettingsContext } from "../../libs/router";
import { TacTabs } from "../../team/types";
import { DOWNLOAD_DASHLANE, WEBAPP_BASE } from "../../team/urls";
import { useSignUpCookie } from "../../account-creation/hooks/use-signup-cookie";
import { AccountCreationFlowType } from "../../account-creation/types";
import {
  logOpenAdminConsoleModalClose,
  logOpenAdminConsoleModalInstall,
  logOpenAdminConsoleModalSkip,
} from "./logs";
import { DialogDescriptionItem } from "./dialog-description";
import { DialogInstallExtensionImage } from "./dialog-install-svg";
const I18N_KEYS = {
  DIALOG_TITLE: "webapp_onb_extension_installation_modal_title",
  DIALOG_SUBTITLE: "webapp_onb_extension_installation_modal_subtitle",
  INSTALL_BUTTON:
    "webapp_onb_extension_installation_modal_action_install_button",
  MAYBE_LATER_BUTTON:
    "webapp_onb_extension_installation_modal_action_maybe_button",
  CLOSE: "_common_dialog_dismiss_button",
  PROTIP_ITEM_TITLE_AUTOFILL:
    "webapp_onb_extension_installation_modal_protip_autofill",
  PROTIP_ITEM_TITLE_SAVE_LOGINS:
    "webapp_onb_extension_installation_modal_protip_save_logins",
  PROTIP_ITEM_TITLE_SEAMLESS_SWITCHING:
    "webapp_onb_extension_installation_modal_protip_seamless_switching",
};
interface NavigateTacVaultDialogProps {
  isShown: boolean;
  setIsShown: (isDialogShow: boolean) => void;
  onBeforeNavigate?: () => void;
  isFromVault?: boolean;
}
export const NavigateTacVaultDialog = ({
  isShown,
  setIsShown,
  onBeforeNavigate,
  isFromVault,
}: NavigateTacVaultDialogProps) => {
  const { routes } = useRouterGlobalSettingsContext();
  const { translate } = useTranslate();
  const { setCookie } = useSignUpCookie();
  const { openTeamConsole } = useOpenTeamConsole();
  const userLogin = useUserLogin() ?? "";
  useEffect(() => {
    if (isShown) {
      logPageView(PageView.InstallExtensionModal);
    }
  }, [isShown]);
  const handleSkipNow = () => {
    if (isFromVault) {
      openTeamConsole({
        email: userLogin,
        routeInExtension: routes.teamAccountRoutePath,
        routeInWebapp: TacTabs.ACCOUNT,
      });
    } else {
      openUrl(WEBAPP_BASE);
    }
    logOpenAdminConsoleModalSkip();
    setIsShown(false);
    onBeforeNavigate?.();
  };
  const handleClose = () => {
    logOpenAdminConsoleModalClose();
    setIsShown(false);
  };
  const handleInstallClick = () => {
    setCookie(AccountCreationFlowType.ADMIN);
    logOpenAdminConsoleModalInstall();
    onBeforeNavigate?.();
    openUrl(DOWNLOAD_DASHLANE);
  };
  return (
    <Dialog
      isOpen={isShown}
      title={translate(I18N_KEYS.DIALOG_TITLE)}
      actions={{
        primary: {
          children: translate(I18N_KEYS.INSTALL_BUTTON),
          onClick: handleInstallClick,
          icon: "ActionOpenExternalLinkOutlined",
          layout: "iconTrailing",
        },
        secondary: {
          children: translate(I18N_KEYS.MAYBE_LATER_BUTTON),
          onClick: handleSkipNow,
        },
      }}
      closeActionLabel={translate(I18N_KEYS.CLOSE)}
      onClose={handleClose}
    >
      <div
        sx={{
          paddingBottom: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <DialogDescriptionItem
          iconName={"ActionRefreshOutlined"}
          title={I18N_KEYS.PROTIP_ITEM_TITLE_SEAMLESS_SWITCHING}
        />
        <DialogDescriptionItem
          iconName={"FeatureAutofillOutlined"}
          title={I18N_KEYS.PROTIP_ITEM_TITLE_AUTOFILL}
        />
        <DialogDescriptionItem
          iconName={"LockOutlined"}
          title={I18N_KEYS.PROTIP_ITEM_TITLE_SAVE_LOGINS}
        />
      </div>
      <div
        sx={{
          height: "265px",
          backgroundColor: "ds.container.expressive.brand.quiet.idle",
          borderRadius: "12px",
          display: "flex",
          padding: "18px 0px",
          alignItems: "center",
        }}
      >
        <DialogInstallExtensionImage />
      </div>
    </Dialog>
  );
};

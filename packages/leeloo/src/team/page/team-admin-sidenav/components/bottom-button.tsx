import { useState } from "react";
import { Button } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { redirectToUrl } from "../../../../libs/external-urls";
import { WEBAPP_ONBOARDING } from "../../../urls";
import { NavigateTacVaultDialog } from "../../../../webapp/navigate-tac-vault-dialog/navigate-tac-vault-dialog";
import { logOpenVaultFromAdminConsoleClick } from "../../../../webapp/navigate-tac-vault-dialog/logs";
const I18N_KEYS = {
  OPEN_VAULT_BUTTON: "webapp_sidemenu_open_vault_cta",
};
interface Props {
  isCollapsed: boolean;
}
export const BottomButton = ({ isCollapsed }: Props) => {
  const { translate } = useTranslate();
  const [openNavigationModal, setOpenNavigationModal] = useState(false);
  const handleClickOnOpenVault = () => {
    if (!APP_PACKAGED_IN_EXTENSION) {
      logOpenVaultFromAdminConsoleClick();
      setOpenNavigationModal(true);
    } else {
      redirectToUrl(WEBAPP_ONBOARDING);
    }
  };
  return (
    <div
      sx={{
        display: "flex",
        justifyContent: "center",
        borderTop: "1px solid",
        position: "fixed",
        bottom: "0",
        borderTopColor: "ds.border.neutral.quiet.idle",
        backgroundColor: "ds.container.agnostic.inverse.standard",
        width: isCollapsed ? "96px" : "256px",
      }}
    >
      <Button
        layout={isCollapsed ? "iconOnly" : "iconLeading"}
        aria-label={translate(I18N_KEYS.OPEN_VAULT_BUTTON)}
        fullsize={!isCollapsed}
        sx={{ margin: "20px 25px" }}
        icon="VaultOutlined"
        mood="brand"
        intensity="catchy"
        onClick={handleClickOnOpenVault}
      >
        {translate(I18N_KEYS.OPEN_VAULT_BUTTON)}
      </Button>
      {openNavigationModal ? (
        <NavigateTacVaultDialog
          isShown={openNavigationModal}
          setIsShown={setOpenNavigationModal}
          isFromVault={false}
        />
      ) : null}
    </div>
  );
};

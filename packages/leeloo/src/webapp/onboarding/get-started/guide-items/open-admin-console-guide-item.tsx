import { useState } from "react";
import { TaskAction } from "../types/action.types";
import { ActionType, GuideItemComponentProps } from "../types/item.types";
import { logTaskOpenAdminConsoleClick } from "../logs";
import { useGetStartedTaskCompletion } from "../hooks/use-get-started-task-completion";
import { NavigateTacVaultDialog } from "../../../navigate-tac-vault-dialog/navigate-tac-vault-dialog";
import { TEAM_CONSOLE_URL_SEGMENT } from "../../../../app/routes/constants";
import { redirect } from "../../../../libs/router";
import { GuideItemComponent } from "./components/guide-item-component";
const I18N_KEYS = {
  TITLE: "onb_vault_get_started_task_open_tac",
  ACTION: "onb_vault_get_started_btn_open_tac",
};
export const OpenAdminConsoleGuideItem = ({
  status,
}: GuideItemComponentProps) => {
  const isInExtensionOrDesktop =
    APP_PACKAGED_IN_EXTENSION || APP_PACKAGED_IN_DESKTOP;
  const [openInstallExtensionModal, setOpenInstallExtensionModal] =
    useState(false);
  const { markAdminConsoleOpened } = useGetStartedTaskCompletion();
  const handleOpenAdminConsole = () => {
    logTaskOpenAdminConsoleClick();
    if (isInExtensionOrDesktop) {
      markAdminConsoleOpened();
      redirect(TEAM_CONSOLE_URL_SEGMENT);
    } else {
      setOpenInstallExtensionModal(true);
    }
  };
  const action: TaskAction = {
    icon: "ActionOpenExternalLinkOutlined",
    label: I18N_KEYS.ACTION,
    type: ActionType.TASK,
    layout: "iconTrailing",
    handler: handleOpenAdminConsole,
  };
  return (
    <>
      <GuideItemComponent
        icon="ActionOpenExternalLinkOutlined"
        title={I18N_KEYS.TITLE}
        action={action}
        status={status}
      />

      <NavigateTacVaultDialog
        isShown={openInstallExtensionModal}
        setIsShown={setOpenInstallExtensionModal}
        isFromVault={true}
      />
    </>
  );
};

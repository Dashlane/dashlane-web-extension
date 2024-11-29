import { WebOnboardingLeelooStep } from "@dashlane/communication";
import { TaskAction } from "../types/action.types";
import { ActionType, GuideItemComponentProps } from "../types/item.types";
import { redirect } from "../../../../libs/router";
import { setOnboardingMode } from "../../services";
import { logTaskAddPasswordClick } from "../logs";
import { GuideItemComponent } from "./components/guide-item-component";
const I18N_KEYS = {
  TITLE: "onb_vault_get_started_task_add_passwd",
  BUTTON: "onb_vault_get_started_btn_add_now",
};
export const AddPasswordGuideItem = ({ status }: GuideItemComponentProps) => {
  const handleAddPassword = () => {
    logTaskAddPasswordClick();
    setOnboardingMode({
      activeOnboardingType: "saveWeb",
      leelooStep: WebOnboardingLeelooStep.SHOW_SAVE_SITES_DIALOG,
    });
    redirect("onboarding/add-password");
  };
  const action: TaskAction = {
    icon: "LockOutlined",
    label: I18N_KEYS.BUTTON,
    type: ActionType.TASK,
    handler: handleAddPassword,
  };
  return (
    <GuideItemComponent
      icon="LockOutlined"
      title={I18N_KEYS.TITLE}
      action={action}
      status={status}
    />
  );
};

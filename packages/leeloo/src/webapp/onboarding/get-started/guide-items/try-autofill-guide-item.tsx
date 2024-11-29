import { TaskAction } from "../types/action.types";
import { ActionType, GuideItemComponentProps } from "../types/item.types";
import { redirect } from "../../../../libs/router";
import { setOnboardingMode } from "../../services";
import { logTaskTryAutofillClick } from "../logs";
import { GuideItemComponent } from "./components/guide-item-component";
const I18N_KEYS = {
  TITLE: "onb_vault_get_started_task_try_autofill",
  ACTION: "onb_vault_get_started_btn_try_now",
};
export const TryAutofillGuideItem = ({ status }: GuideItemComponentProps) => {
  const handleTryAutoFill = () => {
    logTaskTryAutofillClick();
    setOnboardingMode({ activeOnboardingType: "tryAutofill" });
    redirect("onboarding/try-autofill");
  };
  const action: TaskAction = {
    icon: "FeatureAutofillOutlined",
    label: I18N_KEYS.ACTION,
    type: ActionType.TASK,
    handler: handleTryAutoFill,
  };
  return (
    <GuideItemComponent
      icon="FeatureAutofillOutlined"
      title={I18N_KEYS.TITLE}
      action={action}
      status={status}
    />
  );
};

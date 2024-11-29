import { TaskAction } from "../types/action.types";
import { ActionType, GuideItemComponentProps } from "../types/item.types";
import { redirect } from "../../../../libs/router";
import { setOnboardingMode } from "../../services";
import { GuideItemComponent } from "./components/guide-item-component";
const I18N_KEYS = {
  TITLE: "web_onboarding_card_add_mobile",
  ACTION: "onb_vault_get_started_btn_download_app",
};
export const GetMobileAppGuideItem = ({ status }: GuideItemComponentProps) => {
  const addMobile = "addMobile";
  const handleAddMobile = () => {
    setOnboardingMode({ activeOnboardingType: addMobile });
    redirect("onboarding/add-mobile");
  };
  const action: TaskAction = {
    icon: "ItemPhoneMobileOutlined",
    label: I18N_KEYS.ACTION,
    type: ActionType.TASK,
    handler: handleAddMobile,
  };
  return (
    <GuideItemComponent
      icon="ItemPhoneMobileOutlined"
      title={I18N_KEYS.TITLE}
      action={action}
      status={status}
    />
  );
};

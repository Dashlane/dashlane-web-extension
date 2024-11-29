import { GuideItemComponentProps } from "../types/item.types";
import { GuideItemComponent } from "./components/guide-item-component";
const I18N_KEYS = {
  TITLE: "web_onboarding_get_dashlane_message",
};
export const CreateAccountGuideItem = ({ status }: GuideItemComponentProps) => {
  return (
    <GuideItemComponent
      icon="UsersOutlined"
      title={I18N_KEYS.TITLE}
      status={status}
    />
  );
};

import { TaskAction } from "../types/action.types";
import { ActionType, GuideItemComponentProps } from "../types/item.types";
import { GuideItemComponent } from "./components/guide-item-component";
const I18N_KEYS = {
  TITLE: "onb_vault_get_started_task_install_extension",
};
export const InstallExtensionGuideItem = ({
  status,
}: GuideItemComponentProps) => {
  const action: TaskAction = {
    type: ActionType.TASK,
    icon: "DownloadOutlined",
    label: "",
    handler: () => {},
  };
  return (
    <GuideItemComponent
      icon="DownloadOutlined"
      title={I18N_KEYS.TITLE}
      action={action}
      status={status}
    />
  );
};

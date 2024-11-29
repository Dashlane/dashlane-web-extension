import {
  TabConfiguration,
  Tabs,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import useTranslate from "../../libs/i18n/useTranslate";
import { PasswordHistoryFilter } from "./list/helpers";
const MenuFiltersStyles: ThemeUIStyleObject = {
  marginLeft: "auto",
  marginRight: "16px",
  paddingBottom: 0,
};
const I18N_KEYS = {
  FILTER_ALL: "webapp_password_history_filter_all",
  FILTER_SAVED: "webapp_password_history_filter_saved",
  FILTER_UNSAVED: "webapp_password_history_filter_unsaved",
};
interface Props {
  onFilterChanged: (filter: PasswordHistoryFilter) => void;
}
export const PasswordHistoryQuickFilters = ({ onFilterChanged }: Props) => {
  const { translate } = useTranslate();
  const tabs: TabConfiguration[] = [
    {
      id: "tab-ph-all",
      contentId: "content-ph-list",
      title: translate(I18N_KEYS.FILTER_ALL),
      onSelect: () => onFilterChanged(PasswordHistoryFilter.All),
    },
    {
      id: "tab-ph-saved",
      contentId: "content-ph-list",
      title: translate(I18N_KEYS.FILTER_SAVED),
      onSelect: () => onFilterChanged(PasswordHistoryFilter.Saved),
    },
    {
      id: "tab-ph-unsaved",
      contentId: "content-ph-list",
      title: translate(I18N_KEYS.FILTER_UNSAVED),
      onSelect: () => onFilterChanged(PasswordHistoryFilter.Unsaved),
    },
  ];
  return <Tabs tabs={tabs} sx={MenuFiltersStyles} />;
};

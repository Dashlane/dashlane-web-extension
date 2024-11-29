import { Icon } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import { EmptyView } from "../../empty-view/empty-view";
const I18N_KEYS = {
  EMPTY_VIEW: "webapp_collections_empty_view",
};
export const CollectionEmptyView = () => {
  const { translate } = useTranslate();
  return (
    <EmptyView
      icon={
        <Icon
          name="FolderOutlined"
          color="ds.text.neutral.standard"
          sx={{ width: "75px", height: "auto", marginBottom: "25px" }}
        />
      }
      title={translate(I18N_KEYS.EMPTY_VIEW)}
    />
  );
};

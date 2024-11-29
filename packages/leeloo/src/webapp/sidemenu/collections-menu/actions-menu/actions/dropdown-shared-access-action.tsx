import { DropdownItem } from "@dashlane/design-system";
import useTranslate from "../../../../../libs/i18n/useTranslate";
interface Props {
  disabled?: boolean;
  onClick: () => void;
}
export const DropdownSharedAccessAction = ({ disabled, onClick }: Props) => {
  const { translate } = useTranslate();
  return (
    <DropdownItem
      disabled={disabled}
      leadingIcon="SharedOutlined"
      label={translate("webapp_sharing_collection_access_dialog_title")}
      onSelect={onClick}
    />
  );
};

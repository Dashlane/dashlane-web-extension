import { Dispatch, SetStateAction } from "react";
import { DropdownItem } from "@dashlane/design-system";
import useTranslate from "../../../../../libs/i18n/useTranslate";
interface Props {
  disabled?: boolean;
  setIsEditDialogOpen: Dispatch<SetStateAction<boolean>>;
}
export const DropdownEditAction = ({
  disabled,
  setIsEditDialogOpen,
}: Props) => {
  const { translate } = useTranslate();
  return (
    <DropdownItem
      disabled={disabled}
      leadingIcon="ActionEditOutlined"
      label={translate("_common_action_edit")}
      onSelect={() => setIsEditDialogOpen(true)}
    />
  );
};

import { Dispatch, SetStateAction } from "react";
import { DropdownItem } from "@dashlane/design-system";
import useTranslate from "../../../../../libs/i18n/useTranslate";
interface Props {
  disabled?: boolean;
  setIsDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
}
export const DropdownDeleteAction = ({
  disabled,
  setIsDeleteDialogOpen,
}: Props) => {
  const { translate } = useTranslate();
  return (
    <DropdownItem
      disabled={disabled}
      leadingIcon="ActionDeleteOutlined"
      label={translate("collections_delete_button_text")}
      onSelect={() => setIsDeleteDialogOpen(true)}
    />
  );
};

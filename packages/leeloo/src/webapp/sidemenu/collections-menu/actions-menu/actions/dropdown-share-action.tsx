import { ReactElement } from "react";
import { DropdownItem } from "@dashlane/design-system";
import useTranslate from "../../../../../libs/i18n/useTranslate";
interface Props {
  disabled?: boolean;
  onClick: () => void;
  badge?: ReactElement;
}
export const DropdownShareAction = ({ disabled, onClick, badge }: Props) => {
  const { translate } = useTranslate();
  return (
    <DropdownItem
      disabled={disabled}
      leadingIcon="ActionShareOutlined"
      label={translate("_common_action_share")}
      onSelect={onClick}
      badge={badge}
    />
  );
};

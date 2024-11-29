import { DropdownItem } from "@dashlane/design-system";
import { BankAccountValue } from "./types";
import useTranslate from "../../../../libs/i18n/useTranslate";
interface DropDownButtonProps {
  isEnabled: boolean;
  onClick: (value: string) => void;
  translationKey: string;
  value: BankAccountValue;
}
export const DropdownButton = ({
  isEnabled,
  onClick,
  translationKey,
  value,
}: DropDownButtonProps) => {
  const { translate } = useTranslate();
  return (
    <DropdownItem
      leadingIcon="ActionCopyOutlined"
      onSelect={() => onClick(value)}
      disabled={!isEnabled}
      label={translate(translationKey)}
    />
  );
};

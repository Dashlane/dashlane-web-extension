import useTranslate from "../../../../libs/i18n/useTranslate";
import { Button, Icon } from "@dashlane/design-system";
interface Props {
  amountLeft: number;
  isOpen: boolean;
  onClick: () => void;
}
export const OverflowButton = ({ amountLeft, isOpen, onClick }: Props) => {
  const { translate } = useTranslate();
  return (
    <Button
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
      intensity="supershy"
      layout="iconTrailing"
      size="small"
      icon={
        <Icon
          name={isOpen ? "CaretUpOutlined" : "CaretDownOutlined"}
          size="small"
        />
      }
    >
      {isOpen
        ? translate("webapp_collections_overflow_button_show_less")
        : translate("webapp_collections_overflow_button_show_more", {
            count: amountLeft,
          })}
    </Button>
  );
};

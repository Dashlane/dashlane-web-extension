import { Button } from "@dashlane/design-system";
interface AddLinkedWebsiteButtonProps {
  disabled?: boolean;
  handleOnClickAddLinkedWebsiteButton: () => void;
  label: string;
}
export const AddLinkedWebsiteButton = ({
  disabled = false,
  handleOnClickAddLinkedWebsiteButton,
  label,
}: AddLinkedWebsiteButtonProps) => {
  return (
    <Button
      sx={{ mt: "8px" }}
      size="small"
      layout="iconTrailing"
      icon="ArrowRightOutlined"
      onClick={handleOnClickAddLinkedWebsiteButton}
      disabled={disabled}
      mood="brand"
      intensity="supershy"
    >
      {label}
    </Button>
  );
};

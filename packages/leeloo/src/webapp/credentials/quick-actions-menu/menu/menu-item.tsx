import { Icon, IconName, Paragraph } from "@dashlane/design-system";
import { DropdownElement, GridContainer } from "@dashlane/ui-components";
interface Props {
  icon: IconName;
  text: string;
  onClick: () => void;
  closeOnClick?: boolean;
  disabled?: boolean;
  hasArrowIcon?: boolean;
}
export const MenuItem = ({
  icon,
  text,
  onClick,
  closeOnClick,
  hasArrowIcon,
  disabled,
}: Props) => {
  const color = "ds.text.neutral.standard";
  const customProps = closeOnClick ? { "data-close-dropdown": true } : {};
  return (
    <DropdownElement
      fullWidth
      onClick={onClick}
      {...customProps}
      disabled={disabled}
      sx={{
        width: "100%",
        padding: "10px 12px",
        borderRadius: "4px",
        border: "none",
        backgroundColor: "ds.container.expressive.neutral.supershy.idle",
        "&:hover": {
          backgroundColor: "ds.container.expressive.neutral.supershy.hover",
        },
      }}
    >
      <GridContainer gridTemplateColumns="1fr auto" gap="8px" role="menuitem">
        <div
          sx={{
            display: "flex",
            gap: "8px",
          }}
        >
          <Icon name={icon} color={color} />
          <Paragraph
            textStyle="ds.body.standard.regular"
            color="ds.text.neutral.catchy"
          >
            {text}
          </Paragraph>
        </div>
        {hasArrowIcon && (
          <div>
            <Icon name="CaretRightOutlined" color={color} />
          </div>
        )}
      </GridContainer>
    </DropdownElement>
  );
};

import { ButtonHTMLAttributes, memo } from "react";
import { jsx, Tooltip } from "@dashlane/ui-components";
import { Button } from "@dashlane/design-system";
interface Props {
  icon: JSX.Element;
  passThrough?: boolean;
  tooltipContent: string;
  tooltipMaxWidth?: number;
}
const IconButtonWithTooltipComponent = ({
  icon,
  passThrough,
  tooltipContent,
  tooltipMaxWidth,
  role,
  "aria-label": ariaLabel,
  ...buttonProps
}: Props & ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <Tooltip
      content={tooltipContent}
      passThrough={passThrough}
      placement="left"
      sx={{
        maxWidth:
          tooltipMaxWidth !== undefined ? `${tooltipMaxWidth}px` : undefined,
      }}
      offset={[0, 16]}
    >
      <Button
        icon={icon}
        aria-label={ariaLabel ?? tooltipContent}
        layout="iconOnly"
        intensity="supershy"
        role={role}
        {...buttonProps}
      />
    </Tooltip>
  );
};
export const IconButtonWithTooltip = memo(IconButtonWithTooltipComponent);

import * as React from "react";
import { Icon } from "@dashlane/design-system";
import { IconButtonWithTooltip } from "../../../../../components/icon-button-with-tooltip/icon-button-with-tooltip";
interface OpenWebsiteIconButtonProps {
  text: string;
  onClick: () => void;
  ariaLabel?: string;
}
const OpenWebsiteIconButtonComponent: React.FC<OpenWebsiteIconButtonProps> = ({
  onClick,
  text,
  ariaLabel,
}) => {
  return (
    <IconButtonWithTooltip
      tooltipContent={text}
      tooltipMaxWidth={162}
      onClick={onClick}
      icon={<Icon name="ActionOpenExternalLinkOutlined" />}
      aria-label={ariaLabel ?? text}
      role="link"
    />
  );
};
export const OpenWebsiteIconButton = React.memo(OpenWebsiteIconButtonComponent);

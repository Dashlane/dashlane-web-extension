import * as React from "react";
import { Button, IconName } from "@dashlane/design-system";
interface Props {
  label: string;
  onClick: () => void;
  ref?: React.Ref<HTMLButtonElement>;
  disabled?: boolean;
  icon?: IconName;
}
export const PrimaryActionButton = ({
  label,
  onClick,
  ref,
  disabled,
  icon,
}: Props) => {
  return (
    <Button
      mood="brand"
      intensity="catchy"
      size="small"
      type="button"
      ref={ref}
      disabled={disabled}
      onClick={onClick}
      data-keyboard-accessible={label}
      icon={icon ?? undefined}
      layout={icon ? "iconLeading" : "labelOnly"}
      aria-label={label}
    >
      {label}
    </Button>
  );
};

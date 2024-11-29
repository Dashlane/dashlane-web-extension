import { forwardRef, MouseEvent } from "react";
import {
  Button,
  ButtonIconLayout,
  ButtonMood,
  ButtonProps,
} from "@dashlane/design-system";
import { HEADER_BREAKPOINT_SIZE } from "./constants";
import { useIsHeaderWidthAboveSize } from "./useIsHeaderWidthAboveSize";
interface VaultHeaderButtonProps {
  children: JSX.Element | string;
  disabled?: boolean;
  icon: JSX.Element | string;
  isPrimary?: boolean;
  role?: string;
  layout?: ButtonIconLayout;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  onMouseEnter?: () => void;
  mood?: ButtonMood;
  intensity?: ButtonProps["intensity"];
}
export const VaultHeaderButton = forwardRef<
  HTMLButtonElement,
  VaultHeaderButtonProps
>((buttonProps, ref) => {
  const isHeaderWidthAboveSize = useIsHeaderWidthAboveSize(
    HEADER_BREAKPOINT_SIZE
  );
  const {
    mood,
    intensity,
    children,
    disabled,
    icon,
    isPrimary,
    layout = "iconLeading",
    onClick,
    onMouseEnter,
    role = "button",
  } = buttonProps;
  return (
    <Button
      ref={ref}
      sx={{ whiteSpace: "nowrap" }}
      mood={mood ? mood : isPrimary ? undefined : "neutral"}
      intensity={intensity ? intensity : isPrimary ? undefined : "quiet"}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      disabled={disabled}
      icon={icon}
      role={role}
      layout={isHeaderWidthAboveSize ? layout : "iconOnly"}
    >
      {children}
    </Button>
  );
});

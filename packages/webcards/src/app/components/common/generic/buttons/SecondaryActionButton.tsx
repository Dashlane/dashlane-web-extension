import * as React from "react";
import { Button, ButtonIntensity } from "@dashlane/design-system";
interface Props {
  label: string;
  onClick: () => void;
  intensity?: ButtonIntensity;
}
export const SecondaryActionButton = ({ label, onClick, intensity }: Props) => {
  return (
    <Button
      mood="neutral"
      intensity={intensity ?? "quiet"}
      size="small"
      type="button"
      onClick={onClick}
      data-keyboard-accessible={label}
      aria-label={label}
    >
      {label}
    </Button>
  );
};

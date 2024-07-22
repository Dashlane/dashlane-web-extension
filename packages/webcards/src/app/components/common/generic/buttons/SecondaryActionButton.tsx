import * as React from "react";
import { Button } from "@dashlane/design-system";
import { Intensity } from "@dashlane/design-system/dist/types/src/types";
interface Props {
  label: string;
  onClick: () => void;
  intensity?: Intensity;
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

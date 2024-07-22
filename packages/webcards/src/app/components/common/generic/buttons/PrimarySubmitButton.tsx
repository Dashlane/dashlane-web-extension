import * as React from "react";
import { Button } from "@dashlane/design-system";
interface Props {
  label: string;
  form: string;
  buttonRef?: React.Ref<HTMLButtonElement>;
  disabled?: boolean;
}
export const PrimarySubmitButton = ({
  label,
  form,
  buttonRef,
  disabled,
}: Props) => {
  return (
    <Button
      mood="brand"
      intensity="catchy"
      size="small"
      type="submit"
      form={form}
      ref={buttonRef}
      disabled={disabled}
      data-keyboard-accessible={label}
    >
      {label}
    </Button>
  );
};

import {
  Button,
  ButtonProps,
  TextField,
  TextFieldProps,
} from "@dashlane/design-system";
import { CopyIcon, Tooltip } from "@dashlane/ui-components";
import { useCallback, useState } from "react";
import useTranslate from "../../i18n/useTranslate";
const FIELD_I18N_KEYS = {
  COPIED: "input_copied_button_feedback",
  COPY: "input_copy_button",
};
interface InputWithCopyButtonProps extends TextFieldProps {
  isLoading?: ButtonProps["isLoading"];
}
export const InputWithCopyButton = (inputProps: InputWithCopyButtonProps) => {
  const { value, isLoading, ...restInputProps } = inputProps;
  const { translate } = useTranslate();
  const [isCopied, setIsCopied] = useState(false);
  const onClick = useCallback(async () => {
    if (!value) {
      return;
    }
    await navigator.clipboard.writeText(`${value}`);
    setIsCopied(true);
  }, [value]);
  const onMouseLeave = useCallback(() => {
    setIsCopied(false);
  }, []);
  return (
    <TextField
      value={value}
      {...restInputProps}
      actions={[
        <Tooltip
          key="copy-button"
          placement="left"
          content={translate(
            isCopied ? FIELD_I18N_KEYS.COPIED : FIELD_I18N_KEYS.COPY
          )}
          passThrough={!value}
        >
          <Button
            isLoading={isLoading}
            disabled={!value}
            aria-label={translate(FIELD_I18N_KEYS.COPY)}
            mood="neutral"
            intensity="supershy"
            onClick={onClick}
            onMouseLeave={onMouseLeave}
            layout="iconOnly"
            icon={<CopyIcon />}
          />
        </Tooltip>,
      ]}
    />
  );
};

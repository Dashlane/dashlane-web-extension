import {
  CopyIcon,
  PasswordInput,
  PropsOf,
  TextInput,
  Tooltip,
} from "@dashlane/ui-components";
import useTranslate from "../../i18n/useTranslate";
import { IconButton } from "../buttons/IconButton";
import { InputWithActionButton } from "./input-with-action-button";
import { Key, useState } from "react";
const I18N_KEYS = {
  COPIED: "input_copied_button_feedback",
  COPY: "input_copy_button",
  HIDE_PASSWORD_LABEL: "_common_password_hide_label",
  SHOW_PASSWORD_LABEL: "_common_password_show_label",
};
interface InputWithCopyButtonProps {
  inputValue: string;
  textInputProps?: Partial<PropsOf<typeof TextInput>> & {
    key?: Key | undefined;
  };
  tooltipProps?: Partial<PropsOf<typeof Tooltip>>;
  passwordInputProps?: Partial<PropsOf<typeof PasswordInput>>;
  iconButtonProps?: Partial<PropsOf<typeof IconButton>>;
}
export const InputWithCopyButton = ({
  inputValue,
  textInputProps,
  tooltipProps,
  passwordInputProps,
  iconButtonProps,
}: InputWithCopyButtonProps) => {
  const { translate } = useTranslate();
  const [isCopied, setIsCopied] = useState(false);
  const passwordActionProps = passwordInputProps
    ? {
        ...passwordInputProps,
        value: inputValue,
        hidePasswordTooltipText: translate(I18N_KEYS.HIDE_PASSWORD_LABEL),
        showPasswordTooltipText: translate(I18N_KEYS.SHOW_PASSWORD_LABEL),
      }
    : undefined;
  return (
    <InputWithActionButton
      passwordInputProps={passwordActionProps}
      textInputProps={{
        ...textInputProps,
        value: inputValue,
      }}
      iconButtonProps={{
        icon: <CopyIcon />,
        onClick: async () => {
          await navigator.clipboard.writeText(inputValue);
          setIsCopied(true);
        },
        onMouseLeave: () => {
          setIsCopied(false);
        },
        ...iconButtonProps,
      }}
      tooltipProps={{
        passThrough: iconButtonProps?.disabled,
        content: translate(isCopied ? I18N_KEYS.COPIED : I18N_KEYS.COPY),
        ...tooltipProps,
      }}
    />
  );
};

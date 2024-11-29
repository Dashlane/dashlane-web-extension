import {
  GridContainer,
  PasswordInput,
  PropsOf,
  TextInput,
  Tooltip,
} from "@dashlane/ui-components";
import { Key, ReactNode } from "react";
import { IconButton } from "../buttons/IconButton";
interface InputWithActionButtonProps {
  replacementActions?: ReactNode;
  iconButtonProps?: Partial<PropsOf<typeof IconButton>> &
    Required<Pick<PropsOf<typeof IconButton>, "icon">>;
  textInputProps?: Partial<PropsOf<typeof TextInput>> & {
    key?: Key | undefined;
  };
  passwordInputProps?: PropsOf<typeof PasswordInput>;
  tooltipProps?: Partial<PropsOf<typeof Tooltip>>;
}
export const InputWithActionButton = ({
  replacementActions,
  iconButtonProps,
  textInputProps,
  passwordInputProps,
  tooltipProps,
}: InputWithActionButtonProps) => {
  return (
    <GridContainer
      gap="8px"
      gridAutoFlow="column"
      gridTemplateColumns="1fr"
      gridAutoColumns="auto"
      fullWidth
    >
      {passwordInputProps ? (
        <PasswordInput {...passwordInputProps} />
      ) : (
        <TextInput {...textInputProps} />
      )}
      {replacementActions ? replacementActions : null}
      {iconButtonProps ? (
        <div
          sx={{
            alignSelf: textInputProps?.readOnly ? "flex-end" : "initial",
          }}
        >
          <Tooltip placement="left" {...tooltipProps}>
            <IconButton
              type="button"
              nature="secondary"
              size="medium"
              {...iconButtonProps}
            />
          </Tooltip>
        </div>
      ) : null}
    </GridContainer>
  );
};

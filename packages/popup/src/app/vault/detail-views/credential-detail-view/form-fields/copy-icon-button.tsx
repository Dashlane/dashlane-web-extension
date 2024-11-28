import * as React from "react";
import { Button } from "@dashlane/design-system";
import { useIsUserFrozen } from "../../../../../libs/hooks/use-is-user-frozen";
interface CopyIconButtonProps {
  text: string;
  copyAction: (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>
  ) => void;
  disabled?: boolean;
}
const CopyIconButtonComponent: React.FC<CopyIconButtonProps> = ({
  copyAction,
  text,
  disabled = false,
}) => {
  const { isUserFrozen } = useIsUserFrozen();
  if (isUserFrozen) {
    return null;
  }
  return (
    <Button
      key="copy"
      title={text}
      aria-label={text}
      tooltip={text}
      disabled={disabled}
      icon="ActionCopyOutlined"
      intensity="supershy"
      layout="iconOnly"
      onClick={(
        event:
          | React.MouseEvent<HTMLButtonElement>
          | React.KeyboardEvent<HTMLButtonElement>
      ) => {
        copyAction(event);
      }}
    />
  );
};
export const CopyIconButton = React.memo(CopyIconButtonComponent);

import * as React from "react";
import { Flex } from "@dashlane/design-system";
import { Button, CloseIcon, colors, Paragraph } from "@dashlane/ui-components";
interface ChipProps {
  onDismiss?: () => void;
  value: string | React.ReactChildren;
  buttonProps: Record<string, unknown>;
}
export const Chip = ({ onDismiss, value, buttonProps }: ChipProps) => {
  return (
    <Flex alignItems="center" gap="6px">
      <Flex
        sx={{
          backgroundColor: colors.midGreen05,
          padding: "4px 8px",
          borderRadius: "4px",
        }}
      >
        {typeof value === "string" ? (
          <Paragraph size="x-small">{value}</Paragraph>
        ) : (
          { value }
        )}
      </Flex>
      {onDismiss ? (
        <Button
          size="small"
          type="button"
          nature="ghost"
          onClick={onDismiss}
          sx={{ padding: 0, minWidth: 0 }}
          {...buttonProps}
        >
          <CloseIcon size={18} />
        </Button>
      ) : null}
    </Flex>
  );
};

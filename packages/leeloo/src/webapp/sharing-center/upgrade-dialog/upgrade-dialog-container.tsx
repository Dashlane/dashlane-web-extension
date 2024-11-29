import React from "react";
import { Heading } from "@dashlane/ui-components";
import { Button, Flex, Icon, IconProps } from "@dashlane/design-system";
interface DialogContainerProps {
  header: string;
  onClose: () => void;
  children: JSX.Element[];
  headerIconName: IconProps["name"];
}
export const DialogContainer = ({
  header,
  onClose,
  children,
  headerIconName,
}: DialogContainerProps) => {
  return (
    <Flex
      flexDirection="column"
      sx={{
        height: "fit-content",
        width: "342px",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "ds.border.neutral.quiet.idle",
        backgroundColor: "ds.container.agnostic.neutral.supershy",
        borderRadius: "8px",
        padding: "16px",
      }}
    >
      <Flex flexWrap="nowrap" gap="16px">
        <div
          sx={{
            padding: "8px",
            backgroundColor: "ds.container.expressive.brand.quiet.idle",
            borderRadius: "8px",
            height: "40px",
            width: "40px",
          }}
        >
          <Icon
            name={headerIconName}
            size="large"
            color="ds.text.brand.standard"
          />
        </div>
        <Heading size="x-small" color="ds.text.neutral.catchy">
          {header}
        </Heading>
        <Button
          layout="iconOnly"
          mood="neutral"
          intensity="supershy"
          icon={
            <Icon
              name="ActionCloseOutlined"
              color="ds.text.neutral.quiet"
              size="small"
            />
          }
          onClick={onClose}
        />
      </Flex>
      {children}
    </Flex>
  );
};

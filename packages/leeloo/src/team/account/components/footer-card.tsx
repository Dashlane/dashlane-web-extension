import { PropsWithChildren, ReactNode } from "react";
import { Flex } from "@dashlane/design-system";
const SX_STYLES = {
  border: "1px solid ds.border.neutral.quiet.idle",
  borderRadius: "8px",
  backgroundColor: "ds.container.agnostic.neutral.supershy",
  padding: "24px",
  flex: "1",
  overflow: "visible",
};
export const FooterCard = ({ children }: PropsWithChildren<ReactNode>) => {
  return (
    <Flex flexDirection="column" sx={SX_STYLES}>
      {children}
    </Flex>
  );
};

import { Flex } from "@dashlane/design-system";
import { PropsWithChildren, ReactNode } from "react";
interface PanelBodyProps {
  input: ReactNode;
}
export const PanelBody = ({
  input,
  children,
}: PropsWithChildren<PanelBodyProps>) => {
  return (
    <Flex
      flexDirection="column"
      flexWrap="nowrap"
      sx={{
        overflow: "auto",
        flexGrow: 1,
        bg: "ds.background.alternate",
        padding: "24px 24px 100px 24px",
      }}
    >
      <div sx={{ padding: "0 0 24px 0" }}> {input}</div>

      {children}
    </Flex>
  );
};

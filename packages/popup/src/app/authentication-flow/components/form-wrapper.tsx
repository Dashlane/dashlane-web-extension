import * as React from "react";
import { Flex, jsx } from "@dashlane/design-system";
interface Props {
  children: React.ReactNode;
}
export const FormWrapper = ({ children }: Props) => (
  <Flex
    flexDirection="column"
    sx={{
      flexGrow: "1",
    }}
  >
    {children}
  </Flex>
);

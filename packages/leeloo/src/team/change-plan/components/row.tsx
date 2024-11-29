import * as React from "react";
import { Flex } from "@dashlane/design-system";
interface RowProps {
  label?: React.ReactNode;
  value?: React.ReactNode;
}
export const Row = ({ label, value }: RowProps) => (
  <Flex justifyContent="flex-end" sx={{ padding: "0 10px" }}>
    {label ? (
      <div sx={{ display: "flex", alignItems: "center", flex: 1 }}>{label}</div>
    ) : null}
    {value ? (
      <div sx={{ display: "flex", alignItems: "center" }}>{value}</div>
    ) : null}
  </Flex>
);

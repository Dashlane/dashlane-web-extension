import React from "react";
import { colors } from "@dashlane/ui-components";
export const HorizontalRule = () => (
  <hr
    style={{
      width: "100%",
      borderTop: `1px solid ${colors.grey02}`,
      borderBottom: "0",
      margin: "0",
    }}
  />
);

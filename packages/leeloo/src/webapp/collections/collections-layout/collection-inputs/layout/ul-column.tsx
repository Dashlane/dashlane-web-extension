import { HTMLProps } from "react";
import { minimalisticScrollbarStyle } from "../../../styles";
export const UlColumn = (props: HTMLProps<HTMLUListElement>) => (
  <ul
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      overflowY: "scroll",
      maxHeight: "25vh",
      padding: "8px",
      ...minimalisticScrollbarStyle,
    }}
    {...props}
  />
);

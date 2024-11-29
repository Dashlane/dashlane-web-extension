import { HTMLProps } from "react";
export const Column = (props: HTMLProps<HTMLDivElement>) => (
  <div
    sx={{
      flex: "1",
      display: "flex",
      flexDirection: "column",
    }}
    {...props}
  />
);

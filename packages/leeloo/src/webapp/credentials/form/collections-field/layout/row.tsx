import { HTMLProps } from "react";
export const Row = (props: HTMLProps<HTMLDivElement>) => (
  <div
    sx={{
      display: "flex",
      flexDirection: "row",
    }}
    {...props}
  />
);

import { HTMLProps } from "react";
export const ArticleCard = (props: HTMLProps<HTMLDivElement>) => (
  <article
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      padding: "4px 4px 12px 12px",
      backgroundColor: "ds.container.expressive.neutral.quiet.idle",
      boxShadow: "0px 1px 1px 0px lightgrey",
      borderRadius: "6px",
      "&:hover": {
        backgroundColor: "ds.container.expressive.neutral.quiet.hover",
      },
      cursor: "pointer",
    }}
    {...props}
  />
);

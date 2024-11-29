import { PropsWithChildren } from "react";
import { Heading } from "@dashlane/design-system";
export const RowGroup = ({
  title,
  children,
}: PropsWithChildren<{
  title: string;
}>) => {
  return (
    <div
      sx={{
        "&:not(:last-child)": {
          marginBottom: "32px",
        },
      }}
    >
      <Heading
        as="h2"
        textStyle="ds.title.section.medium"
        color="ds.text.neutral.catchy"
        sx={{
          marginBottom: "32px",
        }}
      >
        {title}
      </Heading>
      <div
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

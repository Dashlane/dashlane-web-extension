import { PropsWithChildren } from "react";
export const PolicySettingsWrapper = ({
  children,
}: PropsWithChildren<unknown>) => {
  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "32px",
        border: "1px solid ds.border.neutral.quiet.idle",
        borderRadius: "8px",
        padding: "32px",
        backgroundColor: "ds.background.default",
      }}
    >
      {children}
    </div>
  );
};

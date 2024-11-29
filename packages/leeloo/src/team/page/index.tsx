import { PropsWithChildren } from "react";
interface Props {
  header: JSX.Element;
}
export const ConsolePage = ({ header, children }: PropsWithChildren<Props>) => {
  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "32px",
        gap: "16px",
      }}
    >
      {header}
      {children}
    </div>
  );
};

import { HTMLAttributes, ReactNode } from "react";
interface Props extends HTMLAttributes<HTMLElement> {
  startWidgets?: ReactNode;
  endWidget?: ReactNode;
}
export const Header = ({ startWidgets, endWidget, ...rest }: Props) => {
  return (
    <header
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        padding: "16px 0",
        position: "relative",
        zIndex: "2",
      }}
      {...rest}
    >
      <div
        sx={{
          display: "flex",
          gap: "8px",
        }}
      >
        {startWidgets}
      </div>
      {endWidget ? (
        <div
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {endWidget}
        </div>
      ) : null}
    </header>
  );
};

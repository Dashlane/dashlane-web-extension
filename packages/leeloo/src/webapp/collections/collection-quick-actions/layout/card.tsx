import { HTMLProps } from "react";
import { keyframes } from "@dashlane/ui-components";
interface CardProps {
  cardOrientation: string;
}
const easeOut = keyframes({
  from: {
    transform: "scale3d(0, 0, 1)",
  },
  to: {
    transform: "scale3d(1, 1, 1)",
  },
});
export const Card = ({
  cardOrientation,
  ...props
}: HTMLProps<HTMLDivElement> & CardProps) => {
  return (
    <div
      sx={{
        position: "absolute",
        right: "calc(100% + 2px)",
        top: cardOrientation === "top" ? "-38px" : "unset",
        bottom: cardOrientation === "bottom" ? "-8px" : "unset",
        width: "240px",
        backgroundColor: "ds.container.agnostic.neutral.supershy",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
        borderRadius: "4px",
        transformOrigin: "bottom right",
        animation: `${easeOut} 150ms`,
      }}
      {...props}
    />
  );
};

import React from "react";
type HTMLAttributeReferrerPolicy =
  | ""
  | "no-referrer"
  | "no-referrer-when-downgrade"
  | "origin"
  | "origin-when-cross-origin"
  | "same-origin"
  | "strict-origin"
  | "strict-origin-when-cross-origin"
  | "unsafe-url";
interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  disabled?: boolean;
  referrerPolicy?: HTMLAttributeReferrerPolicy;
}
const Link = ({ children, ...props }: Props) => {
  const relAttribute =
    props.target === "_blank" ? { rel: "noopener noreferrer" } : {};
  return (
    <a
      sx={{
        color: "inherit",
        textWrap: "pretty",
        position: "relative",
        backgroundColor: "transparent",
        textDecoration: "underline",
        borderRadius: "3px",
        ":hover": {
          backgroundColor: "color-mix(in srgb, currentColor 20%, transparent);",
          textDecoration: "none",
        },
      }}
      {...props}
      {...relAttribute}
    >
      {children}
    </a>
  );
};
export default Link;

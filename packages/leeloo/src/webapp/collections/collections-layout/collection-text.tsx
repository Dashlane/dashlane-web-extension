import { ThemeUIStyleObject } from "@dashlane/design-system";
type BaseProps = {
  style?: ThemeUIStyleObject;
};
type ElementChildrenProps = BaseProps & {
  children: JSX.Element;
  title: string;
};
type StringChildrenProps = BaseProps & {
  children: string;
  title?: undefined;
};
export type CollectionTextProps = ElementChildrenProps | StringChildrenProps;
export const CollectionText = ({
  children,
  title,
  style,
}: CollectionTextProps) => (
  <span
    title={title ?? children}
    sx={{
      width: "100%",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      fontWeight: "500",
      fontSize: "0.75rem",
      ...style,
    }}
  >
    {children}
  </span>
);

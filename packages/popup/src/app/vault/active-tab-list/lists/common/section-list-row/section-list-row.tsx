import * as React from "react";
import { jsx, ListItem } from "@dashlane/design-system";
import { Content } from "./content";
export interface SectionRowProps {
  thumbnail: JSX.Element;
  title: string;
  onClick: () => void;
  itemSpaceId?: string;
  subtitle?: string;
  actions?: JSX.Element;
  onRowLeave?: React.MouseEventHandler;
}
export const SectionRow = ({
  actions,
  title,
  subtitle = "",
  onClick,
  ...rest
}: SectionRowProps) => {
  return (
    <ListItem
      actions={actions ? actions : undefined}
      onClick={onClick}
      aria-label={title || subtitle}
    >
      <Content subtitle={subtitle} title={title} {...rest} />
    </ListItem>
  );
};

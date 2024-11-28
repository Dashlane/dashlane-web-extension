import * as React from "react";
import { jsx, LinkButton, Paragraph } from "@dashlane/design-system";
interface Props {
  linkedWebsitesTitle: string;
  value: string;
  onClick: () => void;
}
export const LinkedWebsitesCount: React.FunctionComponent<Props> = ({
  linkedWebsitesTitle,
  value,
  onClick,
}) => {
  return (
    <LinkButton
      mood="neutral"
      onClick={onClick}
      sx={{
        width: "100%",
        zIndex: 0,
        justifyContent: "center",
      }}
    >
      <Paragraph
        aria-label={linkedWebsitesTitle}
        textStyle="ds.body.standard.strong"
      >
        {value}
      </Paragraph>
    </LinkButton>
  );
};

import { Flex, Heading, jsx, Paragraph } from "@dashlane/design-system";
import { ReactNode } from "react";
export interface ListItemContentProps {
  icon: ReactNode;
  title: string;
  explanation?: string;
}
export const ListItemContent = ({
  title,
  explanation,
  icon,
}: ListItemContentProps) => (
  <Flex as="article" alignItems="center" gap="16px" flexWrap="nowrap">
    <span>{icon}</span>
    <Flex gap="2px" as="header" flexDirection="column">
      <Heading
        color="ds.text.neutral.catchy"
        as="h2"
        textStyle="ds.title.block.small"
      >
        {title}
      </Heading>
      {explanation ? (
        <Paragraph
          color={"ds.text.neutral.quiet"}
          textStyle="ds.body.standard.regular"
        >
          {explanation}
        </Paragraph>
      ) : null}
    </Flex>
  </Flex>
);

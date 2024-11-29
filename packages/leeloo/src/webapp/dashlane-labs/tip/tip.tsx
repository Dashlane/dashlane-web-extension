import { PropsWithChildren } from "react";
import { Flex, Heading, Paragraph } from "@dashlane/design-system";
interface TipProps {
  emoji: {
    label: string;
    symbol: string;
  };
  title: string;
  description: string;
}
export const Tip = ({
  emoji,
  title,
  description,
  children,
}: PropsWithChildren<TipProps>) => {
  return (
    <Flex
      sx={{
        padding: "32px",
        border: "1px solid transparent",
        borderColor: "ds.border.neutral.quiet.idle",
        backgroundColor: "ds.container.agnostic.neutral.supershy",
        marginBottom: "16px",
        borderRadius: "8px",
      }}
      gap="8px"
      flexDirection="column"
    >
      <Heading
        as="h2"
        textStyle="ds.title.block.medium"
        color="ds.text.neutral.catchy"
      >
        <span
          role="img"
          aria-label={emoji.label + " emoji"}
          sx={{ marginRight: "8px" }}
        >
          {emoji.symbol}
        </span>
        {title}
      </Heading>
      <Paragraph
        color="ds.text.neutral.standard"
        textStyle="ds.body.standard.regular"
      >
        {description}
      </Paragraph>
      {children}
    </Flex>
  );
};

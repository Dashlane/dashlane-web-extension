import { PropsWithChildren } from "react";
import {
  Card,
  Flex,
  Heading,
  IconName,
  Paragraph,
  Tag,
} from "@dashlane/design-system";
interface StepCardProps {
  tag?: {
    leadingIcon: IconName;
    label: string;
  };
  title?: string;
  description?: string;
}
export const StepCard = ({
  tag,
  title,
  description,
  children,
}: PropsWithChildren<StepCardProps>) => {
  return (
    <Card
      sx={{
        padding: "32px",
        maxWidth: "600px",
        width: "100%",
        boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.24)",
      }}
    >
      <Flex
        flexDirection="column"
        alignItems="center"
        sx={{ marginBottom: "24px" }}
      >
        {tag ? (
          <Tag
            label={tag.label}
            leadingDecoration={tag.leadingIcon}
            sx={{
              marginBottom: "24px",
            }}
          />
        ) : null}

        {title ? (
          <Heading
            as="h2"
            textStyle="ds.title.section.medium"
            color="ds.text.neutral.catchy"
            sx={{
              textAlign: "center",
            }}
          >
            {title}
          </Heading>
        ) : null}

        {description ? (
          <Paragraph
            textStyle="ds.body.standard.regular"
            color="ds.text.neutral.standard"
            sx={{
              marginTop: "8px",
              textAlign: "center",
            }}
          >
            {description}
          </Paragraph>
        ) : null}
      </Flex>
      {children}
    </Card>
  );
};

import { Card, Heading, Paragraph } from "@dashlane/design-system";
import { PropsWithChildren } from "react";
interface SettingProps {
  title: string;
  description?: string;
}
export const Setting = ({
  title,
  description,
  children,
}: PropsWithChildren<SettingProps>) => {
  return (
    <Card
      sx={{
        width: "100%",
      }}
    >
      <Heading
        as="h2"
        textStyle="ds.title.section.medium"
        color="ds.text.neutral.catchy"
      >
        {title}
      </Heading>
      {description ? (
        <Paragraph
          textStyle="ds.body.standard.regular"
          color="ds.text.neutral.quiet"
        >
          {description}
        </Paragraph>
      ) : null}
      {children}
    </Card>
  );
};

import { ReactNode } from "react";
import {
  DSStyleObject,
  Heading,
  Icon,
  IconName,
  Paragraph,
} from "@dashlane/design-system";
export interface SharedRecipientProps {
  children: ReactNode;
  title?: string;
  description?: string;
  additionalSx?: DSStyleObject;
  additionalInfo?: {
    content: string;
    icon: IconName;
  } | null;
}
export const ContentCard = ({
  title,
  description,
  children,
  additionalSx,
  additionalInfo,
}: SharedRecipientProps) => {
  return (
    <div
      sx={{
        backgroundColor: "ds.container.agnostic.neutral.supershy",
        borderRadius: "8px",
        padding: "24px",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "ds.border.neutral.quiet.idle",
        ...additionalSx,
      }}
    >
      {title ? (
        <Heading
          as="h3"
          color="ds.text.neutral.catchy"
          textStyle="ds.title.block.medium"
          sx={{
            marginBottom: description ? "8px" : "16px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {title}
          {additionalInfo ? (
            <Paragraph
              color="ds.text.neutral.quiet"
              textStyle="ds.body.standard.regular"
              sx={{ display: "flex", gap: "4px" }}
            >
              <Icon
                color="ds.text.neutral.quiet"
                name={additionalInfo.icon}
                size="small"
              />
              {additionalInfo.content}
            </Paragraph>
          ) : null}
        </Heading>
      ) : null}
      {description ? (
        <Paragraph
          textStyle="ds.body.reduced.regular"
          color="ds.text.neutral.quiet"
          sx={{ marginBottom: "16px" }}
        >
          {description}
        </Paragraph>
      ) : null}
      {children}
    </div>
  );
};

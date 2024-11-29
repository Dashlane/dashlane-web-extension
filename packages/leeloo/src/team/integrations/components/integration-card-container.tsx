import { ReactNode } from "react";
import { Badge, Heading, Paragraph } from "@dashlane/design-system";
interface Props {
  containerTitle: string;
  containerDescription?: string;
  isMainButtonDisabled?: boolean;
  disabledReason?: string;
  mainButtonLink?: string;
  badgeLabel: string;
  isCapable: boolean;
  children: ReactNode;
}
export const IntegrationCardContainer = ({
  containerTitle,
  containerDescription,
  isMainButtonDisabled = false,
  disabledReason,
  mainButtonLink,
  badgeLabel,
  isCapable,
  children,
}: Props) => {
  return (
    <div
      sx={{
        padding: "24px",
        borderColor: "ds.border.neutral.quiet.idle",
        backgroundColor: "ds.container.agnostic.neutral.supershy",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
      }}
    >
      <div sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <Badge
          label={badgeLabel}
          mood={mainButtonLink ? "brand" : "neutral"}
          intensity="quiet"
        />
        <Heading
          as="h2"
          textStyle="ds.title.section.medium"
          color="ds.text.neutral.catchy"
        >
          {containerTitle}
        </Heading>
        {!!containerDescription && (
          <Paragraph
            textStyle="ds.body.standard.regular"
            color="ds.text.neutral.standard"
          >
            {containerDescription}
          </Paragraph>
        )}
      </div>
      {children}
      {!!isMainButtonDisabled && !!disabledReason && isCapable && (
        <Paragraph
          color="ds.text.neutral.quiet"
          sx={{ margin: "-28px 0px 0px 12px" }}
        >
          {disabledReason}
        </Paragraph>
      )}
    </div>
  );
};

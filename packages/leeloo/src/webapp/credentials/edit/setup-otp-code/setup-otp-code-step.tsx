import { Paragraph } from "@dashlane/design-system";
import { GridChild, GridContainer } from "@dashlane/ui-components";
import { ReactNode } from "react";
import { NumberBadge } from "../../../components/number-badge/number-badge";
export interface StepProps {
  content?: string;
  title: ReactNode | string;
  rank: number;
}
export const SetupOtpCodeStep = ({ rank, content, title }: StepProps) => {
  return (
    <GridContainer
      as="li"
      gap="16px"
      gridTemplateColumns="35px 1fr"
      alignItems="center"
      justifyContent="flex-start"
      sx={{
        width: "100%",
        padding: "6px 0",
      }}
    >
      <GridChild alignSelf="flex-start">
        <NumberBadge rank={rank} />
      </GridChild>
      <GridChild>
        <Paragraph
          sx={{
            a: {
              color: "ds.text.brand.standard",
            },
            "a:hover": {
              color: "ds.text.brand.standard",
              textDecoration: "underline",
            },
          }}
          color="ds.text.neutral.catchy"
          textStyle="ds.title.block.medium"
        >
          {title}
        </Paragraph>
        {content ? (
          <Paragraph
            color="ds.text.neutral.quiet"
            textStyle="ds.body.standard.regular"
          >
            {content}
          </Paragraph>
        ) : null}
      </GridChild>
    </GridContainer>
  );
};

import { ReactNode } from "react";
import {
  Button,
  ButtonProps,
  Heading,
  Paragraph,
} from "@dashlane/design-system";
interface NextStepProps {
  title: string;
  description: string | ReactNode;
  button: ButtonProps;
}
export const NextStep = ({ title, description, button }: NextStepProps) => {
  return (
    <div
      sx={{
        backgroundColor: "ds.container.agnostic.neutral.quiet",
        borderRadius: "8px",
        padding: "24px",
        textAlign: "left",
        containerType: "inline-size",
        containerName: "next-step",
        width: "100%",
      }}
    >
      <div
        sx={{
          display: "grid",
          gap: "16px",
          alignItems: "center",
          gridTemplateColumns: "1fr auto",
          gridTemplateAreas: '"content action"',
          "@container next-step (width < 320px)": {
            gridTemplateColumns: "unset",
            gridTemplateAreas: '"content" "action"',
            height: "100%",
            alignContent: "space-between",
          },
        }}
      >
        <div
          sx={{
            gridArea: "content",
          }}
        >
          <Heading as="h4" textStyle="ds.title.block.medium">
            {title}
          </Heading>
          <Paragraph textStyle="ds.body.reduced.regular">
            {description}
          </Paragraph>
        </div>
        <Button
          {...button}
          sx={{
            gridArea: "action",
            "@container next-step (width < 320px)": {
              width: "100%",
            },
          }}
        />
      </div>
    </div>
  );
};

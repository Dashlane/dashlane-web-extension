import { Flex, Paragraph } from "@dashlane/design-system";
export interface TutorialStepNumberProps {
  content: number;
  size: number;
}
export const TutorialStepNumber = ({
  content,
  size,
}: TutorialStepNumberProps) => {
  return (
    <Flex
      as="span"
      sx={{
        bg: "ds.container.expressive.brand.quiet.active",
        borderRadius: "3000px",
        height: size,
        width: size,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Paragraph
        textStyle="ds.title.supporting.small"
        color="ds.text.neutral.quiet"
      >
        {content}
      </Paragraph>
    </Flex>
  );
};

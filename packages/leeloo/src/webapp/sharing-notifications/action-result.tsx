import { FC } from "react";
import { Flex, Icon, Paragraph } from "@dashlane/design-system";
interface ActionResultProps {
  text: string;
  nature: "success" | "failure";
}
export const ActionResult: FC<ActionResultProps> = ({
  text,
  children,
  nature,
}) => {
  const textColor =
    nature === "failure" ? "ds.text.danger.quiet" : "ds.text.neutral.quiet";
  return (
    <Flex
      alignItems="center"
      sx={{ bottom: 0, right: 0, top: 0, height: "100%", position: "absolute" }}
    >
      <span
        sx={{
          height: "100%",
          width: "40px",
        }}
      />
      <Flex
        alignItems="center"
        sx={{
          height: "100%",
          paddingLeft: "24px",
        }}
      >
        {nature === "failure" ? (
          <Icon
            name="FeedbackWarningOutlined"
            size="small"
            color="ds.text.danger.quiet"
          />
        ) : (
          <Icon
            name="CheckmarkOutlined"
            size="small"
            color="ds.text.positive.quiet"
          />
        )}
        <Paragraph
          as="span"
          color={textColor}
          textStyle="ds.body.reduced.regular"
        >
          {text}
        </Paragraph>
      </Flex>
      {children}
    </Flex>
  );
};

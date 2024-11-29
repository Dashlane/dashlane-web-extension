import { Icon, IconProps, Paragraph } from "@dashlane/design-system";
import { PasswordHealth } from "@dashlane/team-admin-contracts";
import { roundToFirstDecimalOrInt } from "../../utils";
interface PasswordHealthScoreProps
  extends Pick<PasswordHealth, "securityIndex"> {
  showPasswordHealthScore: boolean;
  shieldSize: IconProps["size"];
  textSize: "medium" | "small";
}
export const PasswordHealthScore = ({
  showPasswordHealthScore,
  securityIndex,
  shieldSize,
  textSize,
}: PasswordHealthScoreProps) => {
  let color = "";
  const textStyle =
    textSize === "small"
      ? "ds.specialty.spotlight.small"
      : "ds.specialty.spotlight.medium";
  if (!showPasswordHealthScore) {
    color = "ds.text.brand.quiet";
    return (
      <>
        <Icon name="HealthUnknownOutlined" size={shieldSize} color={color} />
        <Paragraph textStyle={textStyle} color="ds.text.neutral.catchy">
          {"-"}
        </Paragraph>
      </>
    );
  }
  if (securityIndex >= 80) {
    color = "ds.text.positive.quiet";
  } else if (securityIndex >= 40) {
    color = "ds.text.warning.quiet";
  } else {
    color = "ds.text.danger.quiet";
  }
  return securityIndex >= 60 ? (
    <>
      <Icon name="HealthPositiveOutlined" size={shieldSize} color={color} />
      <Paragraph textStyle={textStyle} color="ds.text.neutral.catchy">
        {`${roundToFirstDecimalOrInt(securityIndex)}%`}
      </Paragraph>
    </>
  ) : (
    <>
      <Icon name="HealthNegativeOutlined" size={shieldSize} color={color} />
      <Paragraph textStyle={textStyle} color="ds.text.neutral.catchy">
        {`${roundToFirstDecimalOrInt(securityIndex)}%`}
      </Paragraph>
    </>
  );
};

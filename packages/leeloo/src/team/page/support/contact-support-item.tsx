import {
  Button,
  ExpressiveIcon,
  IconProps,
  Paragraph,
} from "@dashlane/design-system";
const SX_STYLES = {
  CONTAINER: {
    display: "flex",
    padding: "16px 8px",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ITEM: { display: "flex", gap: "16px", alignItems: "flex-start" },
};
interface Props {
  title: string;
  description: string;
  iconName: IconProps["name"];
  button: {
    content: string;
    onClick: () => void;
    isUpgradeButton?: boolean;
    isRoleLink?: boolean;
  };
}
export const ContactSupportItem = ({
  title,
  description,
  iconName,
  button,
}: Props) => {
  const { content, onClick, isUpgradeButton, isRoleLink } = button;
  return (
    <div sx={SX_STYLES.CONTAINER}>
      <div sx={SX_STYLES.ITEM}>
        <ExpressiveIcon name={iconName} size="small" mood="brand" />
        <div sx={{ gap: " 4px", maxWidth: "320px" }}>
          <Paragraph
            textStyle="ds.title.block.small"
            color="ds.text.neutral.catchy"
          >
            {title}
          </Paragraph>
          <Paragraph
            textStyle="ds.body.reduced.regular"
            color="ds.text.neutral.quiet"
          >
            {description}
          </Paragraph>
        </div>
      </div>
      <Button
        mood={isUpgradeButton ? "brand" : "neutral"}
        intensity="quiet"
        icon={isUpgradeButton ? "PremiumOutlined" : undefined}
        layout={isUpgradeButton ? "iconLeading" : undefined}
        role={isRoleLink ? "link" : undefined}
        onClick={onClick}
        size="small"
      >
        {content}
      </Button>
    </div>
  );
};

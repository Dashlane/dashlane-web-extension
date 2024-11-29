import {
  Button,
  Icon,
  IconName,
  Infobox,
  Paragraph,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import { Link } from "react-router-dom";
const SX_STYLES: Record<string, ThemeUIStyleObject> = {
  PLAN_PARENT: {
    height: "550px",
    width: "255.33px",
    border: "1px solid",
    borderColor: "ds.border.neutral.quiet.idle",
    borderRadius: "8px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  FEATURES_LIST: {
    display: "flex",
    flexDirection: "column",
    alignSelf: "flex-start",
    gap: "8px",
    maxHeight: "192px",
  },
};
interface Props {
  planTitle: string;
  price: string;
  periodicity?: string | null;
  button: {
    label: string;
    onClick: () => void;
    intensity?: "catchy" | "quiet" | "supershy" | null;
    isLink?: boolean;
    route?: string;
  };
  featuresTitle: string;
  featureList: {
    label: string;
    icon: IconName;
  }[];
  infoBox?: {
    mood: "brand" | "neutral" | "danger" | "warning" | "positive";
    title: string;
    description: string;
  };
}
export const PlanContainer = ({
  planTitle,
  price,
  periodicity,
  button,
  featuresTitle,
  featureList,
  infoBox,
}: Props) => {
  return (
    <div sx={SX_STYLES.PLAN_PARENT}>
      <Paragraph textStyle="ds.title.block.medium" sx={{ height: "40px" }}>
        {planTitle}
      </Paragraph>

      <div
        sx={{
          height: "96px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          justifyContent: "center",
        }}
      >
        <Paragraph textStyle="ds.specialty.spotlight.medium">{price}</Paragraph>
        {periodicity ? (
          <Paragraph
            sx={{ alignSelf: "center" }}
            textStyle="ds.body.helper.regular"
            color="ds.text.neutral.quiet"
          >
            {periodicity}
          </Paragraph>
        ) : null}
      </div>

      {button.isLink && button.route ? (
        <Button
          mood="brand"
          onClick={button.onClick}
          intensity={button.intensity ?? "catchy"}
          sx={{ width: "-webkit-fill-available" }}
        >
          <Link
            to={button.route}
            sx={{
              textDecorationLine: "none",
              color:
                button.intensity === "quiet"
                  ? "ds.text.brand.standard"
                  : "ds.text.inverse.catchy",
            }}
          >
            {button.label}
          </Link>
        </Button>
      ) : (
        <Button
          mood="brand"
          onClick={button.onClick}
          intensity={button.intensity ?? "catchy"}
          sx={{ width: "-webkit-fill-available" }}
        >
          {button.label}
        </Button>
      )}

      <div sx={SX_STYLES.FEATURES_LIST}>
        <Paragraph
          textStyle="ds.body.reduced.strong"
          color="ds.text.neutral.quiet"
        >
          {featuresTitle}
        </Paragraph>

        <div
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            alignItems: "flex-start",
          }}
        >
          {featureList.map((feature) => {
            return (
              <div sx={{ display: "flex", gap: "8px" }} key={feature.label}>
                <Icon
                  size="xsmall"
                  name={feature.icon}
                  color="ds.text.brand.standard"
                  sx={{ alignSelf: "center" }}
                />
                <Paragraph
                  textStyle="ds.body.reduced.regular"
                  color="ds.text.neutral.quiet"
                >
                  {feature.label}
                </Paragraph>
              </div>
            );
          })}
        </div>
      </div>

      {infoBox ? (
        <Infobox
          size="medium"
          mood={infoBox.mood}
          title={infoBox.title}
          description={infoBox.description}
        />
      ) : null}
    </div>
  );
};

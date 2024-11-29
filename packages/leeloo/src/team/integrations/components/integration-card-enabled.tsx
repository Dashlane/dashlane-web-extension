import { Badge, Button, Heading } from "@dashlane/design-system";
import { Link } from "../../../libs/router";
import useTranslate from "../../../libs/i18n/useTranslate";
interface Props {
  containerTitle: string;
  subCardTitle: JSX.Element;
  editButtonLink: string;
  badgeLabel: string;
}
const I18N_KEYS = {
  INTEGRATIONS_EDIT_BUTTON: "team_integrations_edit_button",
};
export const IntegrationCardEnabled = ({
  containerTitle,
  subCardTitle,
  editButtonLink,
  badgeLabel,
}: Props) => {
  const { translate } = useTranslate();
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
        <Badge label={badgeLabel} mood="brand" intensity="quiet" />
        <Heading
          as="h2"
          textStyle="ds.title.section.medium"
          color="ds.text.neutral.catchy"
        >
          {containerTitle}
        </Heading>
      </div>

      <div
        sx={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "ds.background.alternate",
          padding: "24px",
          borderRadius: "8px",
        }}
      >
        <div sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Heading
            as="h3"
            textStyle="ds.title.block.medium"
            color="ds.text.neutral.catchy"
          >
            {subCardTitle}
          </Heading>
          <Badge
            label="Enabled"
            mood="positive"
            intensity="catchy"
            layout="labelOnly"
          />
        </div>
        <Button as={Link} to={editButtonLink} mood="brand" intensity="quiet">
          {translate(I18N_KEYS.INTEGRATIONS_EDIT_BUTTON)}
        </Button>
      </div>
    </div>
  );
};

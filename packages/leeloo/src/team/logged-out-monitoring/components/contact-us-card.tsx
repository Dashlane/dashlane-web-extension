import {
  Heading,
  LinkButton,
  mergeSx,
  Paragraph,
} from "@dashlane/design-system";
import { Card } from "@dashlane/ui-components";
import useTranslate from "../../../libs/i18n/useTranslate";
import { LOMO_STYLES } from "../styles";
const I18N_KEYS = {
  HEADER: "team_risk_detection_contact_us_secondary_card_title",
  SUBHEADER: "team_risk_detection_contact_us_secondary_card_subtitle",
  DESCRIPTION: "team_risk_detection_contact_us_secondary_card_description",
  BUTTON: "team_risk_detection_contact_us_secondary_card_button",
};
export const ContactUsSecondaryCard = ({
  onClick,
}: {
  onClick: () => void;
}) => {
  const { translate } = useTranslate();
  return (
    <Card sx={mergeSx([LOMO_STYLES.CARD, { padding: "24px" }])}>
      <Heading
        as="h4"
        textStyle="ds.title.supporting.small"
        color="ds.text.neutral.quiet"
      >
        {translate(I18N_KEYS.HEADER)}
      </Heading>
      <div sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Heading
          as="h5"
          color="ds.text.neutral.quiet"
          textStyle="ds.title.block.medium"
        >
          {translate(I18N_KEYS.SUBHEADER)}
        </Heading>
        <Paragraph color="ds.text.neutral.quiet">
          {translate(I18N_KEYS.DESCRIPTION)}
        </Paragraph>
      </div>
      <LinkButton onClick={onClick} sx={{ cursor: "pointer" }}>
        {translate(I18N_KEYS.BUTTON)}
      </LinkButton>
    </Card>
  );
};

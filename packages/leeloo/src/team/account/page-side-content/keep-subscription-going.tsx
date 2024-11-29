import {
  Card,
  LinkButton,
  Paragraph,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import { DASHLANE_CONTACT_FORM_DASHLANE_FOR_BUSINESS } from "../../urls";
const I18N_KEYS = {
  KEEP_SUBSCRIPTION_HEADER: "account_summary_keep_subscription_header",
  KEEP_SUBSCRIPTION_DESCRIPTION:
    "account_summary_keep_subscription_description",
  KEEP_SUBSCRIPTION_BUTTON: "account_summary_keep_subscription_button",
};
const SX_STYLES: ThemeUIStyleObject = {
  minWidth: "368px",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};
export const KeepSubscriptionGoing = () => {
  const { translate } = useTranslate();
  return (
    <Card sx={SX_STYLES}>
      <Paragraph
        textStyle="ds.title.block.medium"
        color="ds.text.neutral.catchy"
      >
        {translate(I18N_KEYS.KEEP_SUBSCRIPTION_HEADER)}
      </Paragraph>

      <div sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Paragraph>
          {translate(I18N_KEYS.KEEP_SUBSCRIPTION_DESCRIPTION)}
        </Paragraph>

        <LinkButton
          isExternal
          href={DASHLANE_CONTACT_FORM_DASHLANE_FOR_BUSINESS}
        >
          {translate(I18N_KEYS.KEEP_SUBSCRIPTION_BUTTON)}
        </LinkButton>
      </div>
    </Card>
  );
};

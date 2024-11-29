import { Card, LinkButton, Paragraph } from "@dashlane/design-system";
import { CancellationStatus } from "@dashlane/team-admin-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { DASHLANE_CONTACT_FORM_DASHLANE_FOR_BUSINESS } from "../../urls";
import { getKey } from "./helpers";
const I18N_KEYS = {
  DOWNGRADE_DESCRIPTION: "account_summary_downgrade_description",
  CONTACT_SUPPORT: "account_summary_contact_support_button",
};
interface Props {
  status: CancellationStatus;
  handleClickButton: () => void;
}
export const CancelSubscriptionSideContent = ({
  status,
  handleClickButton,
}: Props) => {
  const { translate } = useTranslate();
  return (
    <Card
      sx={{
        width: "368px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {status !== CancellationStatus.Unknown ? (
        <Paragraph
          textStyle="ds.title.block.medium"
          color="ds.text.neutral.catchy"
        >
          {getKey(status, "heading", translate)}
        </Paragraph>
      ) : null}

      <div sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Paragraph>{getKey(status, "paragraph", translate)}</Paragraph>

        {status !== CancellationStatus.Pending ? (
          <LinkButton
            onClick={handleClickButton}
            as="button"
            sx={{ "> button": { cursor: "pointer" } }}
          >
            {getKey(status, "button", translate)}
          </LinkButton>
        ) : null}
      </div>

      {status === CancellationStatus.None ? (
        <div sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <Paragraph>{translate(I18N_KEYS.DOWNGRADE_DESCRIPTION)}</Paragraph>
          <LinkButton
            isExternal
            href={DASHLANE_CONTACT_FORM_DASHLANE_FOR_BUSINESS}
          >
            {translate(I18N_KEYS.CONTACT_SUPPORT)}
          </LinkButton>
        </div>
      ) : null}
    </Card>
  );
};

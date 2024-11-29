import { useEffect, useState } from "react";
import { Heading, Infobox } from "@dashlane/design-system";
import { Card, CardContent } from "@dashlane/ui-components";
import useTranslate from "../../../libs/i18n/useTranslate";
import { Invites } from "../referral";
import { I18N_KEYS, INVITATION_LIMIT } from "../constants";
import { parseInvites } from "../helpers";
import { InviteTableRows } from "./invite-table-rows";
interface Props {
  sentInvites: Invites;
  isLimitReached: boolean;
}
export const ReferralHistory = ({ sentInvites, isLimitReached }: Props) => {
  const { translate } = useTranslate();
  const [pending, setPending] = useState<Invites>(null);
  const [successful, setSuccessful] = useState<Invites>(null);
  useEffect(() => {
    if (sentInvites && sentInvites.length > 0) {
      const { pendingInvites, successfulInvites } = parseInvites(sentInvites);
      setPending(pendingInvites);
      setSuccessful(successfulInvites);
    }
  }, [sentInvites]);
  return pending || successful ? (
    <Card>
      <CardContent
        sx={{ backgroundColor: "ds.background.default", border: "none" }}
      >
        <Heading
          as="h2"
          color="ds.text.neutral.catchy"
          textStyle="ds.title.section.medium"
        >
          {translate(I18N_KEYS.REFERRAL_PAGE_INVITE_HISTORY_CARD_TITLE)}
        </Heading>
        {isLimitReached ? (
          <Infobox
            title={translate(
              I18N_KEYS.REFERRAL_PAGE_INVITE_HISTORY_CARD_INFOBOX_LIMIT_TITLE,
              { invitationLimit: INVITATION_LIMIT }
            )}
            mood="positive"
            size="large"
            sx={{ margin: "16px 0" }}
          />
        ) : null}
        <div
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            backgroundColor: "ds.background.alternate",
            padding: "20px 16px",
            borderRadius: "4px",
            margin: "24px 0 8px",
          }}
        >
          <Heading
            as="h4"
            color="ds.text.neutral.quiet"
            textStyle="ds.title.supporting.small"
          >
            {translate(
              I18N_KEYS.REFERRAL_PAGE_INVITE_HISTORY_CARD_TABLE_HEADING_ROW_1
            )}
          </Heading>
          <Heading
            as="h4"
            color="ds.text.neutral.quiet"
            textStyle="ds.title.supporting.small"
          >
            {translate(
              I18N_KEYS.REFERRAL_PAGE_INVITE_HISTORY_CARD_TABLE_HEADING_ROW_2
            )}
          </Heading>
        </div>
        <InviteTableRows invites={successful} />
        <InviteTableRows invites={pending} />
      </CardContent>
    </Card>
  ) : null;
};

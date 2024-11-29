import { fromUnixTime } from "date-fns";
import { Paragraph } from "@dashlane/design-system";
import LocalizedTimeAgo from "../../../libs/i18n/localizedTimeAgo";
import { LocalizedDateTime } from "../../../libs/i18n/localizedDateTime";
import { LocaleFormat } from "../../../libs/i18n/helpers";
import { Invites } from "../referral";
import { I18N_KEYS } from "../constants";
export const InviteTableRows = ({ invites }: { invites: Invites }) => {
  return (
    <div>
      {invites && invites.length > 0
        ? invites.map((invite) => {
            const { inviteeLogin, creationDateUnix, accountCreationDateUnix } =
              invite;
            return (
              <div
                sx={{
                  display: "grid",
                  borderBottom: "1px solid ds.border.neutral.quiet.idle",
                }}
                key={inviteeLogin}
              >
                <div
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    backgroundColor: "ds.background.default",
                    padding: "16px 16px",
                    borderRadius: "4px",
                    margin: "8px 0",
                  }}
                >
                  <Paragraph>{inviteeLogin}</Paragraph>
                  {accountCreationDateUnix && creationDateUnix ? (
                    <Paragraph color="ds.text.positive.quiet">
                      <LocalizedDateTime
                        date={fromUnixTime(accountCreationDateUnix)}
                        format={LocaleFormat.LL}
                        i18n={{
                          key: I18N_KEYS.REFERRAL_PAGE_INVITE_HISTORY_CARD_TABLE_STATUS_INVITE_SUCCESS,
                          param: "signUpDate",
                        }}
                      />
                    </Paragraph>
                  ) : null}
                  {!accountCreationDateUnix && creationDateUnix ? (
                    <Paragraph>
                      <LocalizedTimeAgo
                        date={fromUnixTime(creationDateUnix)}
                        i18n={{
                          key: I18N_KEYS.REFERRAL_PAGE_INVITE_HISTORY_CARD_TABLE_STATUS_INVITE_PENDING,
                          param: "timeAgoSinceInvite",
                        }}
                      />
                    </Paragraph>
                  ) : null}
                </div>
              </div>
            );
          })
        : null}
    </div>
  );
};

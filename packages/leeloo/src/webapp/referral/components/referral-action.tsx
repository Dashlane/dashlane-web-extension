import {
  Button,
  Card,
  DSStyleObject,
  Heading,
  Icon,
  Paragraph,
  TextField,
  useToast,
} from "@dashlane/design-system";
import { Button as ButtonClickEvent, UserClickEvent } from "@dashlane/hermes";
import { openUrl } from "../../../libs/external-urls";
import { logEvent } from "../../../libs/logs/logEvent";
import { I18N_KEYS, INVITATION_LIMIT } from "../constants";
import { ReferralForm } from "./referral-form";
import useTranslate from "../../../libs/i18n/useTranslate";
const SX_STYLES: Record<string, Partial<DSStyleObject>> = {
  DIVIDER: {
    border: "none",
    borderTop: "1px solid ds.border.neutral.quiet.idle",
    width: "100%",
  },
};
interface Props {
  shareLink: string;
  xUrl: string;
}
export const ReferralAction = ({ shareLink, xUrl }: Props) => {
  const { translate } = useTranslate();
  const { showToast } = useToast();
  return (
    <Card>
      <Heading
        as="h2"
        color="ds.text.neutral.catchy"
        textStyle="ds.title.section.medium"
      >
        {translate(I18N_KEYS.REFERRAL_PAGE_REFERRAL_LINK_CARD_TITLE)}
      </Heading>
      <Paragraph sx={{ paddingTop: "8px" }}>
        {translate(I18N_KEYS.REFERRAL_PAGE_REFERRAL_LINK_CARD_DESCRIPTION_1, {
          invitationLimit: INVITATION_LIMIT,
        })}
      </Paragraph>
      <Paragraph sx={{ paddingTop: "4px" }}>
        {translate(I18N_KEYS.REFERRAL_PAGE_REFERRAL_LINK_CARD_DESCRIPTION_2)}
      </Paragraph>
      <hr sx={SX_STYLES.DIVIDER} />
      <Heading
        sx={{ paddingBottom: "16px" }}
        as="h3"
        color="ds.text.neutral.catchy"
        textStyle="ds.title.block.medium"
      >
        {translate(I18N_KEYS.REFERRAL_PAGE_COPY_LINK_SUBTITLE)}
      </Heading>
      <div
        sx={{
          display: "flex",
          gap: "16px",
        }}
      >
        <div
          sx={{
            width: "100%",
          }}
        >
          <TextField
            actions={[
              <Button
                aria-label="copy"
                icon={<Icon name="ActionCopyOutlined" />}
                layout="iconOnly"
                intensity="supershy"
                key="copy"
                tooltip={translate(
                  I18N_KEYS.REFERRAL_PAGE_COPY_LINK_BUTTON_TEXT
                )}
                onClick={() => {
                  logEvent(
                    new UserClickEvent({
                      button: ButtonClickEvent.CopyReferralLink,
                    })
                  );
                  void navigator.clipboard.writeText(shareLink);
                  showToast({
                    description: translate(
                      I18N_KEYS.REFERRAL_PAGE_COPY_LINK_SUCCESS_MESSAGE
                    ),
                  });
                }}
              />,
            ]}
            label={translate(
              I18N_KEYS.REFERRAL_PAGE_COPY_LINK_TEXT_FIELD_LABEL
            )}
            readOnly
            value={shareLink}
          />
        </div>
        <Button
          aria-label="share"
          icon={<Icon name="SocialTwitterFilled" />}
          intensity="quiet"
          key="share"
          layout="iconLeading"
          onClick={() => {
            logEvent(
              new UserClickEvent({
                button: ButtonClickEvent.ShareReferralLinkOnX,
              })
            );
            openUrl(xUrl);
          }}
          sx={{
            whiteSpace: "nowrap",
            alignSelf: "center",
          }}
        >
          {translate(
            I18N_KEYS.REFERRAL_PAGE_REFERRAL_LINK_CARD_SHARE_LINK_TEXT
          )}
        </Button>
      </div>
      <hr sx={SX_STYLES.DIVIDER} />
      <Heading
        as="h3"
        color="ds.text.neutral.catchy"
        textStyle="ds.title.block.medium"
        sx={{ padding: "0 0 16px" }}
      >
        {translate(
          I18N_KEYS.REFERRAL_PAGE_REFERRAL_LINK_CARD_EMAIL_INVITES_SUBTITLE
        )}
      </Heading>
      <ReferralForm />
    </Card>
  );
};

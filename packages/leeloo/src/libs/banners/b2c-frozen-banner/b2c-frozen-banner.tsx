import { Paragraph } from "@dashlane/design-system";
import { Button, ClickOrigin, UserClickEvent } from "@dashlane/hermes";
import useTranslate from "../../i18n/useTranslate";
import { logEvent } from "../../logs/logEvent";
import { GET_PREMIUM_URL } from "../../../app/routes/constants";
import { useSubscriptionCode } from "../../hooks/use-subscription-code";
const I18N_KEYS = {
  BANNER_MESSAGE: "webapp_frozen_state_banner_message",
  BANNER_CTA: "webapp_frozen_state_banner_cta",
};
export const B2CFrozenStateBanner = () => {
  const { translate } = useTranslate();
  const subscriptionCode = useSubscriptionCode();
  const buyDashlaneLink = `${GET_PREMIUM_URL}?subCode=${
    subscriptionCode ?? ""
  }`;
  const handleClick = () => {
    logEvent(
      new UserClickEvent({
        button: Button.UnfreezeAccount,
        clickOrigin: ClickOrigin.BannerFrozenAccount,
      })
    );
  };
  return (
    <div
      sx={{
        backgroundColor: "ds.container.expressive.danger.quiet.idle",
        height: "34px",
        padding: "8px",
        textAlign: "center",
      }}
    >
      <Paragraph
        textStyle={"ds.body.reduced.regular"}
        color={"ds.text.danger.standard"}
      >
        {translate(I18N_KEYS.BANNER_MESSAGE)}
        <Paragraph
          as={"a"}
          textStyle={"ds.body.reduced.link"}
          sx={{ marginLeft: "8px" }}
          href={buyDashlaneLink}
          onClick={handleClick}
          rel="noopener noreferrer"
          target="_blank"
        >
          {translate(I18N_KEYS.BANNER_CTA)}
        </Paragraph>
      </Paragraph>
    </div>
  );
};

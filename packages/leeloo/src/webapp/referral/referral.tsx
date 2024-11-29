import { useEffect, useState } from "react";
import { Flex, Heading, IndeterminateLoader } from "@dashlane/design-system";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { accountReferralApi } from "@dashlane/account-contracts";
import { PageView } from "@dashlane/hermes";
import { Connected as NotificationsDropdown } from "../bell-notifications/connected";
import { HeaderAccountMenu } from "../components/header/header-account-menu";
import { Header } from "../components/header/header";
import useTranslate from "../../libs/i18n/useTranslate";
import { logPageView } from "../../libs/logs/logEvent";
import {
  I18N_KEYS,
  INVITATION_LIMIT,
  SHARING_BASE_URL,
  X_POST_INTENT_URL,
  X_SHARING_BASE_URL,
} from "./constants";
import { ReferralHistory } from "./components/referral-history";
import { ReferralAction } from "./components/referral-action";
type Invite = {
  inviteeLogin: string;
  creationDateUnix: number;
  accountCreationDateUnix: number | null;
};
export type Invites = Invite[] | null;
export const Referral = () => {
  const { translate } = useTranslate();
  const [shareLink, setShareLink] = useState("");
  const [sentInvites, setSentInvites] = useState<Invites>(null);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [xUrl, setXUrl] = useState("");
  const shareLinkInfo = useModuleQuery(accountReferralApi, "getSharingLink");
  const invitationsHistoryInfo = useModuleQuery(
    accountReferralApi,
    "getInvitationsHistory"
  );
  const isShareLinkSuccess = shareLinkInfo.status === DataStatus.Success;
  const isInvitationHistorySuccess =
    invitationsHistoryInfo.status === DataStatus.Success;
  const getRedeemedInvitesCount = (invites: Invites) => {
    let redeemedInvitesCount = 0;
    if (invites) {
      invites.forEach((invite) => {
        if (invite.accountCreationDateUnix) {
          redeemedInvitesCount++;
        }
      });
    }
    return redeemedInvitesCount;
  };
  useEffect(() => {
    logPageView(PageView.Referral);
  }, []);
  useEffect(() => {
    if (isInvitationHistorySuccess && invitationsHistoryInfo.data.sent) {
      setSentInvites(invitationsHistoryInfo.data.sent);
      setIsLimitReached(
        getRedeemedInvitesCount(invitationsHistoryInfo.data.sent) >=
          INVITATION_LIMIT
      );
    }
  }, [invitationsHistoryInfo]);
  useEffect(() => {
    const xPostText = translate(
      I18N_KEYS.REFERRAL_PAGE_COPY_LINK_SHARE_ON_X_INTENT_TEXT
    );
    if (!shareLink && isShareLinkSuccess) {
      setShareLink(`${SHARING_BASE_URL}${shareLinkInfo.data.sharingId}`);
    }
    if (!xUrl && isShareLinkSuccess) {
      setXUrl(
        `${X_POST_INTENT_URL}?text=${xPostText}&url=${X_SHARING_BASE_URL}${shareLinkInfo.data.sharingId}`
      );
    }
  }, [shareLinkInfo]);
  return (
    <div
      sx={{
        backgroundColor: "ds.background.alternate",
        overflow: "scroll",
        minHeight: "100%",
      }}
    >
      {shareLinkInfo.status === DataStatus.Loading ||
      invitationsHistoryInfo.status === DataStatus.Loading ? (
        <Flex
          sx={{
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            position: "absolute",
          }}
        >
          <IndeterminateLoader size={88} mood="brand" />
        </Flex>
      ) : null}
      {isShareLinkSuccess ? (
        <>
          <Flex sx={{ paddingLeft: "32px", paddingRight: "32px" }}>
            <Header
              startWidgets={
                <Heading
                  as="h1"
                  color="ds.text.neutral.catchy"
                  textStyle="ds.title.section.large"
                >
                  {translate(I18N_KEYS.REFERRAL_PAGE_TITLE)}
                </Heading>
              }
              endWidget={
                <>
                  <HeaderAccountMenu />
                  <NotificationsDropdown />
                </>
              }
            />
          </Flex>
          <div
            sx={{
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "32px",
              maxWidth: "880px",
            }}
          >
            {!isLimitReached ? (
              <ReferralAction xUrl={xUrl} shareLink={shareLink} />
            ) : null}
            <ReferralHistory
              sentInvites={sentInvites}
              isLimitReached={isLimitReached}
            />
          </div>
        </>
      ) : null}
    </div>
  );
};

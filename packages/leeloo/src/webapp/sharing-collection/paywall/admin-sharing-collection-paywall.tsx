import { useRef } from "react";
import { FixedSizeList } from "react-window";
import { Heading } from "@dashlane/design-system";
import { ClickOrigin } from "@dashlane/hermes";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useUserLoginStatus } from "../../../libs/carbon/hooks/useUserLoginStatus";
import { CollectionSharingPaywall } from "../../paywall/paywall/collection-sharing/collection-sharing-paywall";
import { RecipientsList } from "../../sharing-invite/recipients/recipient-list";
import { CollectionSharingRoles } from "../sharing-collection-recipients";
import { useSharingTeamLoginsData } from "../../sharing-invite/hooks/useSharingTeamLogins";
const I18N_KEYS = {
  COLLECTION_RECIPIENTS_TITLE:
    "webapp_sharing_invite_collection_recipients_title",
};
export interface SharingCollectionBlockedProps {
  onRolesChanged?: (roles: CollectionSharingRoles[]) => void;
  roles?: CollectionSharingRoles[];
}
export const AdminSharingCollectionPaywall = ({
  ...rest
}: SharingCollectionBlockedProps) => {
  const { translate } = useTranslate();
  const currentUserLogin = useUserLoginStatus()?.login;
  const teamLogins = useSharingTeamLoginsData();
  const listRef = useRef<FixedSizeList>(null);
  const users = teamLogins
    .filter((login) => login !== currentUserLogin)
    .map((teamLogin) => ({
      id: teamLogin,
      itemCount: 0,
    }));
  return (
    <div sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Heading as="h1">
        {translate(I18N_KEYS.COLLECTION_RECIPIENTS_TITLE)}
      </Heading>

      <div sx={{ height: "auto", width: "640px" }}>
        <RecipientsList
          query={""}
          recipientsOnlyShowSelected={false}
          users={users}
          ref={listRef}
          allowNewContacts={false}
          canShareCollection={false}
          {...rest}
        />
        <CollectionSharingPaywall
          canShareCollection={false}
          clickOrigin={ClickOrigin.CollectionsSharingStarterLimitReachedModal}
        />
      </div>
    </div>
  );
};

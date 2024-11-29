import { Origin } from "@dashlane/hermes";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { Sharing } from "../../../sharing-invite/types";
import { SharingButton as BaseSharingButton } from "../../../sharing-invite/sharing-button";
const I18N_KEYS = {
  SHARING: "webapp_sharing_invite_share",
};
interface GetSharingProp {
  getSharing: (id: string) => Sharing;
}
interface PropsWithSharingInfo extends GetSharingProp {
  id: string;
  isShared: boolean;
  isAdmin: boolean;
  isDiscontinuedUser: boolean;
}
const SharingButton = ({ sharing }: { sharing: Sharing }) => {
  const { translate } = useTranslate();
  return (
    <BaseSharingButton
      tooltipPlacement="top-start"
      sharing={sharing}
      text={translate(I18N_KEYS.SHARING)}
      origin={Origin.ItemDetailView}
    />
  );
};
export const GrapheneShareActions = ({
  id,
  isShared,
  isAdmin,
  isDiscontinuedUser,
  getSharing,
}: PropsWithSharingInfo): JSX.Element | null => {
  if ((isShared && !isAdmin) || isDiscontinuedUser) {
    return null;
  }
  return <SharingButton sharing={getSharing(id)} />;
};

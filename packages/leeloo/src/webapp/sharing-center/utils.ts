import { GroupRecipient, UserRecipient } from "@dashlane/communication";
import { isUserGroup } from "./shared/items-list/util";
import { redirect } from "../../libs/router";
import { NamedRoutes } from "../../app/routes/types";
export interface Props {
  routes: NamedRoutes;
  location?: {
    pathname: string;
    state: {
      entity: UserRecipient | GroupRecipient;
    };
  };
}
export const redirectBackToSharingCenterPanel = ({
  routes,
  location,
}: Props) => {
  if (!location?.state?.entity) {
    redirect(routes.userSharingCenter);
    return;
  }
  if (isUserGroup(location?.state?.entity)) {
    redirect(routes.userSharingGroupInfo(location?.state?.entity?.groupId));
    return;
  }
  redirect(routes.userSharingUserInfo(location?.state?.entity?.alias));
};

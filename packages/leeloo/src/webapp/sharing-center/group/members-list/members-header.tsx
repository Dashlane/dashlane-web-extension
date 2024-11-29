import * as React from "react";
import { MemberPermission } from "@dashlane/communication";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { Header } from "../../../list-view/header";
const I18N_KEYS = {
  MEMBERS_ADMIN: "webapp_sharing_center_panel_members_admins",
  MEMBERS_OTHERS: "webapp_sharing_center_panel_members_others",
};
interface MemberHeaderProps {
  permissionLevel: MemberPermission;
}
export const MemberHeader = ({ permissionLevel }: MemberHeaderProps) => {
  const { translate } = useTranslate();
  const headerFields = [
    {
      key: "name",
      sortable: true,
      content:
        permissionLevel === "admin"
          ? translate(I18N_KEYS.MEMBERS_ADMIN)
          : translate(I18N_KEYS.MEMBERS_OTHERS),
    },
  ];
  return <Header header={headerFields} sxProps={{ p: "0" }} />;
};

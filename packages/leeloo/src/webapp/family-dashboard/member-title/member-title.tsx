import * as React from "react";
import { FamilyMemberRole, FamilyMemberRoles } from "@dashlane/communication";
import useTranslate from "../../../libs/i18n/useTranslate";
import styles from "./styles.css";
const I18N_KEYS = {
  ADMIN_TITLE: "webapp_family_dashboard_admin_title",
  ADMIN_ROLE: "webapp_family_dashboard_role_admin",
  REGULAR_ROLE: "webapp_family_dashboard_role_regular",
};
export interface MemberTitleProps {
  login: string;
  role: FamilyMemberRole;
}
export const MemberTitle = ({ login, role }: MemberTitleProps) => {
  const { translate } = useTranslate();
  const getMemberTitle = () => {
    return role === FamilyMemberRoles.ADMIN
      ? translate(I18N_KEYS.ADMIN_TITLE)
      : login;
  };
  const getRoleTitle = () => {
    return role === FamilyMemberRoles.ADMIN
      ? translate(I18N_KEYS.ADMIN_ROLE)
      : translate(I18N_KEYS.REGULAR_ROLE);
  };
  return (
    <div className={styles.memberColumn}>
      <p className={styles.title}>{getMemberTitle()}</p>
      <p className={styles.role}>{getRoleTitle()}</p>
    </div>
  );
};
export default MemberTitle;

import React, { useCallback } from "react";
import { FamilyMember } from "@dashlane/communication";
import MemberTitle from "../member-title/member-title";
import MemberActions from "../member-actions/member-actions";
import styles from "./styles.css";
export type MemberRowProps = {
  member: FamilyMember;
  onRemoveAction: (member: FamilyMember) => void;
};
export const MemberRow = ({ member, onRemoveAction }: MemberRowProps) => {
  const onRemoveHandler = useCallback(
    () => onRemoveAction(member),
    [member, onRemoveAction]
  );
  return (
    <li className={styles.memberWrapper}>
      <div className={styles.memberRow}>
        <MemberTitle login={member.login} role={member.role} />
        <MemberActions role={member.role} onRemoveAction={onRemoveHandler} />
      </div>
    </li>
  );
};
export default MemberRow;

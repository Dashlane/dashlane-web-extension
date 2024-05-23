import * as React from 'react';
import { FamilyMember } from '@dashlane/communication';
import { RemoveMemberDialog } from '../remove-member-dialog/remove-member-dialog';
import MemberRow from '../member-row/member-row';
export interface MemberListProps {
    admin: FamilyMember;
    regularMembers: FamilyMember[];
    removeMember: (userId: number, resetLink: boolean) => void;
}
interface MemberToRemove {
    showDialog: boolean;
    member?: FamilyMember;
}
export const MemberList = ({ admin, regularMembers, removeMember, }: MemberListProps) => {
    const [memberToRemove, setMemberToRemove] = React.useState<MemberToRemove>({
        showDialog: false,
        member: undefined,
    });
    const handleOpenRemoveDialog = (member: FamilyMember) => {
        setMemberToRemove({
            showDialog: true,
            member,
        });
    };
    const onCloseDialog = () => {
        setMemberToRemove({
            showDialog: false,
            member: undefined,
        });
    };
    const onCancelRemoveMember = () => {
        onCloseDialog();
    };
    const onRemoveMember = (resetLink: boolean) => {
        if (memberToRemove.member) {
            removeMember(memberToRemove.member.userId, resetLink);
        }
        onCloseDialog();
    };
    return (<>
      <ul>
        <MemberRow key={admin.userId} member={admin} onRemoveAction={handleOpenRemoveDialog}/>
        {regularMembers.map((member) => (<MemberRow key={member.userId} member={member} onRemoveAction={handleOpenRemoveDialog}/>))}
      </ul>
      {memberToRemove && memberToRemove.showDialog && memberToRemove.member ? (<RemoveMemberDialog memberLogin={memberToRemove.member.login} handleRemoveMember={onRemoveMember} handleOnCancel={onCancelRemoveMember}/>) : null}
    </>);
};
export default MemberList;

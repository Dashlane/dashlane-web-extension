import { TeamPlansProposeMembersResultContent } from "../../libs/api/types";
export const hasRefusedMembers = ({
  refusedMembers = {},
}: Partial<TeamPlansProposeMembersResultContent> = {}): boolean =>
  Object.keys(refusedMembers).length > 0;

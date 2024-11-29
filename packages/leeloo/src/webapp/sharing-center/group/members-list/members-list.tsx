import { ContentCard } from "../../../panel/standard/content-card";
import { GroupMemberRow } from "./group-member-row";
import { EmptySearchResults } from "../../shared/empty-search-results";
import { MemberHeader } from "./members-header";
interface MemberListProps {
  members: string[];
}
export const MembersList = ({ members }: MemberListProps) => {
  return (
    <div
      sx={{
        height: "100%",
        overflowY: "auto",
        mt: "15px",
        overflow: members.length === 0 ? "hidden" : "auto",
      }}
    >
      {members.length === 0 ? (
        <EmptySearchResults />
      ) : members.length ? (
        <ContentCard>
          <MemberHeader permissionLevel={"limited"} />
          {members.map((member: string) => (
            <GroupMemberRow key={member} member={member} />
          ))}
        </ContentCard>
      ) : null}
    </div>
  );
};

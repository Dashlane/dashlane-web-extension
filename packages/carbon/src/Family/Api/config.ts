import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { FamilyCommands } from "Family/Api/commands";
import {
  joinFamilyRequest,
  removeFamilyMemberRequest,
  resetFamilyJoinTokenRequest,
} from "Family/services";
import { getFamilyDetailsRequest } from "Family/services/getFamilyDetails";
import { leaveFamilyRequest } from "Family/services/leaveFamily";
export const config: CommandQueryBusConfig<FamilyCommands> = {
  commands: {
    joinFamily: { handler: joinFamilyRequest },
    leaveFamily: { handler: leaveFamilyRequest },
    removeFamilyMember: { handler: removeFamilyMemberRequest },
    resetFamilyJoinToken: { handler: resetFamilyJoinTokenRequest },
    getFamilyDetails: { handler: getFamilyDetailsRequest },
  },
  queries: {},
  liveQueries: {},
};

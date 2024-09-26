import {
  BaseDataModelObject,
  SpaceStatus,
  SpaceTiers,
} from "@dashlane/communication";
import { SpaceItem } from "DataManagement/Spaces/types";
import { PERSONAL_SPACE_ID } from "DataManagement/Spaces/constants";
export const isSpaceItem = (item: BaseDataModelObject): item is SpaceItem =>
  "SpaceId" in item && typeof (item as SpaceItem).SpaceId === "string";
export const getDefaultPersonalSpace = (): any => ({
  associatedEmail: null,
  billingAdmins: [],
  color: "",
  companyName: null,
  info: {
    name: "",
    forcedDomainsEnabled: false,
    teamDomains: [],
  },
  invitationDate: null,
  isBillingAdmin: false,
  isSSOUser: false,
  isTeamAdmin: false,
  joinDate: null,
  letter: "",
  membersNumber: null,
  planType: null,
  revokeDate: null,
  status: SpaceStatus.Accepted,
  teamAdmins: [],
  teamId: PERSONAL_SPACE_ID,
  teamName: null,
  tier: SpaceTiers.Free,
  shouldDelete: false,
});

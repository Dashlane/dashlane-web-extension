import { Credential, PlatformInfo } from "@dashlane/communication";
import {
  ForceCategorizable,
  ForceCategorizableKWType,
  SpaceWithForceCategorization,
} from "DataManagement/SmartTeamSpaces/forced-categorization.domain-types";
import { ChangeHistory } from "DataManagement/ChangeHistory";
import { PersonalData } from "Session/Store/personalData/types";
export interface TeamSpaceContentControlState {
  readonly itemCountByType: Record<ForceCategorizableKWType, number>;
  readonly items: ForceCategorizable[];
  readonly spaces: SpaceWithForceCategorization[];
  readonly credentials: Credential[];
  readonly deviceName: string;
  readonly login: string;
  readonly personalData: PersonalData;
  readonly platformInfo: PlatformInfo;
}
export interface TeamSpaceContentControlChanges {
  readonly deletions: Record<ForceCategorizableKWType, string[]>;
  readonly hiddenItemIds: string[];
  readonly updates: ForceCategorizable[];
  readonly changeHistories: ChangeHistory[];
}

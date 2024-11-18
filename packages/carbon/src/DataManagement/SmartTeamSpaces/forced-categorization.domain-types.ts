import { Omit } from "utility-types";
import {
  Credential,
  DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY,
  DataModelType,
  Email,
  GeneratedPassword,
  Space,
} from "@dashlane/communication";
import { PersonalData } from "Session/Store/personalData/types";
export type ForceCategorizable = Credential | Email | GeneratedPassword;
export type ForceCategorizableKWType = Extract<
  DataModelType,
  "KWAuthentifiant" | "KWEmail" | "KWGeneratedPassword"
>;
export type ForceCategorizableFieldsGetter<T extends ForceCategorizable> =
  T extends GeneratedPassword
    ? (item: T, credentials: Credential[]) => string[]
    : (item: T) => string[];
export enum TeamDomainsMatchResult {
  SomeFieldsMatch,
  NoFieldMatch,
}
export interface ForceCategorizationTeamSpacePick {
  teamSpace: SpaceWithForceCategorization["details"];
  domainsMatchResult: TeamDomainsMatchResult;
}
export interface SpaceWithForceCategorization extends Space {
  details: Omit<Space["details"], "info"> & {
    info: {
      forcedDomainsEnabled: true;
      teamDomains: string[];
      removeForcedContentEnabled: boolean;
    };
  };
}
export type PersonalDataItemTypeFromKWType<
  T extends keyof typeof DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY
> = PersonalData[(typeof DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY)[T]][number];

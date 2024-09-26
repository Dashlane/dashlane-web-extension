import { Omit } from "utility-types";
import {
  Credential,
  DataModelType,
  Email,
  GeneratedPassword,
  Space,
} from "@dashlane/communication";
import dataTypes from "Session/Store/personalData/dataTypes";
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
export type PersonalDataItemTypeFromKWType<T extends keyof typeof dataTypes> =
  PersonalData[(typeof dataTypes)[T]][number];

import { BaseDataModelObject, BreachesFilterField, BreachesSortField, BreachLeakedDataType, Mappers, } from '@dashlane/communication';
export interface VersionedBreachContent {
    readonly breachModelVersion: number;
}
export enum BreachStatus {
    PENDING = 'PENDING',
    VIEWED = 'VIEWED',
    ACKNOWLEDGED = 'ACKNOWLEDGED'
}
export interface VersionedBreach extends BaseDataModelObject {
    kwType: 'KWSecurityBreach';
    BreachId: string;
    Content: VersionedBreachContent;
    ContentRevision: number;
    LeakedPasswords: string[];
    Status: BreachStatus;
}
export interface VersionedBreachesMetadata {
    latestPublicBreachesRevision: number;
    latestDataLeaksBreachesUpdate: number;
}
export enum BreachEnvStatus {
    Legacy = 'legacy',
    Live = 'live',
    ***** = '*****',
    Deleted = 'deleted'
}
export enum BreachCriticality {
    Info = 1,
    Warning = 2,
    Error = 3
}
export interface BreachDescription {
    readonly [lang: string]: string;
}
export interface BreachContent extends VersionedBreachContent {
    readonly announcedDate?: string;
    readonly breachCreationDate?: number;
    readonly breachUpdateDate?: number;
    readonly breachModelVersion: 1;
    readonly criticality?: BreachCriticality;
    readonly description?: BreachDescription;
    readonly domains: string[];
    readonly eventDate: string;
    readonly id: string;
    readonly lastModificationRevision: number;
    readonly name?: string;
    readonly leakedData?: BreachLeakedDataType[];
    readonly relatedLinks?: string[];
    readonly restrictedArea?: string[];
    readonly sensitiveDomain?: boolean;
    readonly status?: BreachEnvStatus;
    readonly template?: string;
}
export interface Breach extends VersionedBreach {
    Content: BreachContent;
}
export interface DataLeaksBreachContent extends BreachContent {
    readonly impactedEmails: string[];
}
export interface DataLeaksBreach extends Breach {
    Content: DataLeaksBreachContent;
}
export type BreachMappers = Mappers<Breach, BreachesSortField, BreachesFilterField>;

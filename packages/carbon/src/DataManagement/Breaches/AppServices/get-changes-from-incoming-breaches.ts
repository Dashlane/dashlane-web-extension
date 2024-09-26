import { BreachLeakedDataType, Credential } from "@dashlane/communication";
import { getDomainForCredential } from "DataManagement/Credentials/get-domain-for-credential";
import {
  BreachContent,
  BreachStatus,
  VersionedBreach,
} from "DataManagement/Breaches/types";
import { BreachesUpdaterChanges } from "DataManagement/Breaches/AppServices/types";
import { IncomingBreach } from "DataManagement/Breaches/Gateways/types";
import { isDataLeaksBreachContent } from "DataManagement/Breaches/guards";
import { makeBreachFromContent } from "DataManagement/Breaches/AppServices/makeBreachFromBreachContent";
import {
  findByBreachId,
  hasBreachLeakedDataOfType,
  hasBreachLeakedPrivateInfo,
  isBreachDeleted,
} from "DataManagement/Breaches/breach-helpers";
const changeAsDeletion = (
  deletedBreach: VersionedBreach
): BreachesUpdaterChanges => ({
  updates: [],
  deletions: [deletedBreach.Id],
});
const changeAsUpdate = (
  newOrUpdatedBreach: VersionedBreach
): BreachesUpdaterChanges => ({
  updates: [newOrUpdatedBreach],
  deletions: [],
});
const noChange = (): BreachesUpdaterChanges => ({
  updates: [],
  deletions: [],
});
const mergedChanges = (
  lhs: BreachesUpdaterChanges,
  rhs: BreachesUpdaterChanges
): BreachesUpdaterChanges => ({
  updates: [...lhs.updates, ...rhs.updates],
  deletions: [...lhs.deletions, ...rhs.deletions],
});
const updateExistingBreach = (
  breach: VersionedBreach,
  incomingBreach: BreachContent,
  affectedPasswords: string[]
): VersionedBreach => {
  const currentLeakedPasswords = withoutDuplicates(
    breach.LeakedPasswords || []
  );
  const updatedLeakedPasswords = withoutDuplicates([
    ...breach.LeakedPasswords,
    ...affectedPasswords,
  ]);
  const isLeakedPasswordsUpdated =
    currentLeakedPasswords.length !== updatedLeakedPasswords.length;
  const updatedStatus = isLeakedPasswordsUpdated
    ? BreachStatus.PENDING
    : breach.Status;
  return {
    ...breach,
    Content: incomingBreach,
    ContentRevision: incomingBreach.lastModificationRevision,
    LeakedPasswords: updatedLeakedPasswords,
    Status: updatedStatus,
  };
};
const getImpactedCredentials = (
  credentialsPerDomain: Map<string, Credential[]>,
  breach: IncomingBreach
): Credential[] =>
  (breach.content.domains ?? []).reduce((memo, domain) => {
    const domainCredentials = credentialsPerDomain.get(domain) ?? [];
    return [...memo, ...domainCredentials];
  }, []);
const wasCredentialPasswordSetBefore =
  (eventDate: string) => (credential: Credential) => {
    const modificationDate =
      credential.ModificationDatetime || credential.CreationDatetime || 0;
    return modificationDate * 1000 < Date.parse(eventDate);
  };
const hasNonEmptyPassword = (credential: Credential) =>
  Boolean(credential.Password);
const withoutDuplicates = <T>(arr: T[]) => Array.from(new Set<T>(arr));
const getCompromisedPasswords = (
  incomingBreach: IncomingBreach,
  impactedCredentials: Credential[]
): string[] => {
  const { content } = incomingBreach;
  const { leakedPasswords } = incomingBreach;
  const isPasswordsLeak = hasBreachLeakedDataOfType(
    content,
    BreachLeakedDataType.Password
  );
  let compromisedPasswords = leakedPasswords;
  if (isPasswordsLeak) {
    const { eventDate } = content;
    const passwordsFromCredentials = impactedCredentials
      .filter(wasCredentialPasswordSetBefore(eventDate))
      .filter(hasNonEmptyPassword)
      .map((cred: Credential) => cred.Password);
    compromisedPasswords = [...leakedPasswords, ...passwordsFromCredentials];
  }
  return withoutDuplicates(compromisedPasswords || []);
};
const shouldSkipBreach = (
  content: BreachContent,
  impactedCredentials: Credential[],
  compromisedPasswords: string[]
) => {
  const isPublicBreach = !isDataLeaksBreachContent(content);
  const hasCompromisedPasswords = compromisedPasswords.length > 0;
  const hasLeakedPrivateInfo = hasBreachLeakedPrivateInfo(content);
  const hasImpactedCredentials = impactedCredentials.length > 0;
  return (
    isPublicBreach &&
    !hasCompromisedPasswords &&
    (!hasLeakedPrivateInfo || !hasImpactedCredentials)
  );
};
const getVaultChangeForIncomingBreach = function (
  credentialsPerDomain: Map<string, Credential[]>,
  existingBreaches: VersionedBreach[],
  incomingBreach: IncomingBreach
): BreachesUpdaterChanges {
  const { content } = incomingBreach;
  const { id, lastModificationRevision } = content;
  const existingBreach = findByBreachId(id, existingBreaches);
  if (existingBreach) {
    if (lastModificationRevision <= existingBreach.ContentRevision) {
      return noChange();
    }
    if (isBreachDeleted(content)) {
      return changeAsDeletion(existingBreach);
    }
  }
  const impactedCredentials = getImpactedCredentials(
    credentialsPerDomain,
    incomingBreach
  );
  const compromisedPasswords = getCompromisedPasswords(
    incomingBreach,
    impactedCredentials
  );
  if (shouldSkipBreach(content, impactedCredentials, compromisedPasswords)) {
    return noChange();
  }
  if (existingBreach) {
    return changeAsUpdate(
      updateExistingBreach(existingBreach, content, compromisedPasswords)
    );
  }
  return changeAsUpdate(makeBreachFromContent(content, compromisedPasswords));
};
export function getChangesFromIncomingBreaches(
  credentials: Credential[],
  breaches: VersionedBreach[],
  incomingBreaches: IncomingBreach[]
): BreachesUpdaterChanges {
  const initialChanges: BreachesUpdaterChanges = {
    updates: [],
    deletions: [],
  };
  const credentialsPerDomain = new Map();
  credentials.forEach((credential) => {
    const domain = getDomainForCredential(credential) || "";
    const domainCredentials = credentialsPerDomain.get(domain) ?? [];
    credentialsPerDomain.set(domain, [...domainCredentials, credential]);
  });
  return incomingBreaches.reduce<BreachesUpdaterChanges>(
    (changes, incomingBreach) =>
      mergedChanges(
        changes,
        getVaultChangeForIncomingBreach(
          credentialsPerDomain,
          breaches,
          incomingBreach
        )
      ),
    initialChanges
  );
}

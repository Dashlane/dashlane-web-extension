import {
  DomainIconDetailsMap,
  DomainIconDetailsMapSchema,
} from "@dashlane/vault-contracts";
export const isDomainIconDetailsMap = (
  uut: unknown
): uut is DomainIconDetailsMap => {
  return DomainIconDetailsMapSchema.safeParse(uut).success;
};

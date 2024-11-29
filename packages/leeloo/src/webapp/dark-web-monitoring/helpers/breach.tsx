import { BreachItemView } from "@dashlane/communication";
export function getBreachDomain({
  domains,
}: BreachItemView): string | undefined {
  return domains ? domains.find((element) => element) : undefined;
}
export function getBreachTitle(breach: BreachItemView): string | undefined {
  if (breach.name) {
    return breach.name;
  }
  return getBreachDomain(breach);
}

import { safeCast } from "@dashlane/framework-types";
import { RevisionSummary } from "@dashlane/sharing-contracts";
export const determineUpdatesFromSummary = <
  T extends {
    revision: number;
  }
>(
  summaries: RevisionSummary[],
  currentState: Record<string, T>
) =>
  summaries.reduce(
    (updates, summary) => {
      const currentObject = currentState[summary.id];
      if (currentObject) {
        if (currentObject.revision < summary.revision) {
          updates.updatedIds.push(summary.id);
        } else {
          updates.unchanged.push(currentObject);
        }
      } else {
        updates.newIds.push(summary.id);
      }
      return updates;
    },
    {
      newIds: safeCast<string[]>([]),
      updatedIds: safeCast<string[]>([]),
      unchanged: safeCast<T[]>([]),
    }
  );

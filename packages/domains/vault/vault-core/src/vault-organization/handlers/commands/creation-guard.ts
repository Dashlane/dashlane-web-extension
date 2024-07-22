import { hasProperty } from "@dashlane/framework-types";
interface CarbonCollectionCreationSuccesReturnType {
  success: boolean;
  id: string;
}
export const isCarbonCreationCollectionResultId = (
  x: unknown
): x is CarbonCollectionCreationSuccesReturnType => {
  return (
    typeof x === "object" &&
    x !== null &&
    hasProperty(x, "id") &&
    typeof x.id === "string" &&
    hasProperty(x, "success") &&
    typeof x.success === "boolean"
  );
};

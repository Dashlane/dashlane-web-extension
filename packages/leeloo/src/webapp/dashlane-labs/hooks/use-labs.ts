import { useModuleCommands, useModuleQuery } from "@dashlane/framework-react";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { featureFlipsApi } from "@dashlane/framework-contracts";
export type UseLabs = Pick<
  ReturnType<typeof useModuleCommands<typeof featureFlipsApi>>,
  "refreshAvailableLabs" | "toggleLab"
> &
  (
    | {
        status: DataStatus.Error | DataStatus.Loading;
      }
    | {
        status: DataStatus.Success;
        labs: ReturnType<
          typeof useModuleQuery<typeof featureFlipsApi, "userAvailableLabs">
        >["data"];
      }
  );
export const useLabs = (): UseLabs => {
  const { data, status } = useModuleQuery(featureFlipsApi, "userAvailableLabs");
  const { toggleLab, refreshAvailableLabs } =
    useModuleCommands(featureFlipsApi);
  if (status !== DataStatus.Success) {
    return {
      status,
      refreshAvailableLabs,
      toggleLab,
    };
  }
  return {
    status,
    refreshAvailableLabs,
    toggleLab,
    labs: data,
  };
};

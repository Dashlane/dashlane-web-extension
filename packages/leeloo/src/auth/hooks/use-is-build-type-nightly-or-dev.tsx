import {
  ApplicationBuildType,
  platformInfoApi,
} from "@dashlane/framework-contracts";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
export function __REDACTED__() {
  const { data, status } = useModuleQuery(platformInfoApi, "platformInfo");
  return (
    status === DataStatus.Success &&
    (data.buildType === ApplicationBuildType.__REDACTED__ ||
      data.buildType === ApplicationBuildType.DEV)
  );
}

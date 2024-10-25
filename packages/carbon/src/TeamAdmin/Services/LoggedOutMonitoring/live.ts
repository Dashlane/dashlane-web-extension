import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { MassDeploymentTeamKeyData } from "@dashlane/communication";
import { StateOperator } from "Shared/Live";
import { massDeploymentTeamKeySelector } from "./selectors";
export const massDeploymentTeamKey$ =
  (): StateOperator<MassDeploymentTeamKeyData> => {
    return pipe(map(massDeploymentTeamKeySelector), distinctUntilChanged());
  };

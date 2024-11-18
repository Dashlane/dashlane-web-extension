import { map } from "rxjs";
import { success } from "@dashlane/framework-types";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { GetTeamAdminSharingDataQuery } from "@dashlane/sharing-contracts";
import { TeamAdminSharingDataStore } from "../store/team-admin-sharing-data.store";
@QueryHandler(GetTeamAdminSharingDataQuery)
export class GetTeamAdminSharingDataUseCase
  implements IQueryHandler<GetTeamAdminSharingDataQuery>
{
  constructor(private readonly store: TeamAdminSharingDataStore) {}
  execute() {
    return this.store.state$.pipe(
      map((teamAdminSharingData) => success(teamAdminSharingData))
    );
  }
}

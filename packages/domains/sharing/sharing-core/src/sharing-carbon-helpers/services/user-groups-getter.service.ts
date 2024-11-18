import { firstValueFrom, map, Observable } from "rxjs";
import { z } from "zod";
import { UserGroupDownload } from "@dashlane/server-sdk/v1";
import { CarbonLegacyClient } from "@dashlane/communication";
import { UserGroupDownload as CarbonUserGroupDownload } from "@dashlane/sharing";
import { Injectable } from "@dashlane/framework-application";
import { isFailure } from "@dashlane/framework-types";
import { convertCarbonUserGroupDownload } from "../utils/convert-carbon-usergroupdownload";
export const UserGroupDownloadListSchema = z.array(
  z.object({
    groupId: z.string(),
    name: z.string(),
    externalId: z.string().nullable().optional(),
    teamId: z.number().optional(),
    type: z.enum(["users", "teamAdmins"]),
    publicKey: z.string(),
    privateKey: z.string(),
    revision: z.number(),
    users: z.array(
      z.object({
        userId: z.string(),
        alias: z.string(),
        referrer: z.string(),
        groupKey: z.string().nullable().optional(),
        acceptSignature: z.string().nullable().optional(),
        permission: z.enum(["admin", "limited"]),
        rsaStatus: z.enum(["noKey", "publicKey", "sharingKeys"]),
        status: z.enum(["pending", "accepted", "refused", "revoked"]),
        proposeSignatureUsingAlias: z.boolean().optional(),
        proposeSignature: z.string().optional(),
      })
    ),
  })
);
export type UserGroupDownloadList = z.infer<typeof UserGroupDownloadListSchema>;
@Injectable()
export class UserGroupsGetterService {
  public constructor(private client: CarbonLegacyClient) {}
  public getRawCarbon$() {
    const {
      queries: { carbonState },
    } = this.client;
    return carbonState({
      path: "userSession.sharingData.userGroups",
    });
  }
  public async getRawCarbon() {
    const groups = await firstValueFrom(this.getRawCarbon$());
    if (isFailure(groups)) {
      throw new Error(
        "Failure getting user groups state from carbon sharing data"
      );
    }
    return groups.data;
  }
  public async get() {
    const rawResult = await this.getRawCarbon();
    const parsedGroupData = UserGroupDownloadListSchema.safeParse(rawResult);
    if (!parsedGroupData.success) {
      throw new Error("Invalid format of user group state");
    }
    return parsedGroupData.data;
  }
  public async getForGroupIds(groupIds: string[]) {
    return (await this.get()).filter((group) =>
      groupIds.includes(group.groupId)
    );
  }
  public async getCarbonUserGroupForGroupId(groupId: string) {
    return (await this.getCarbonUserGroups()).find(
      (group) => group.groupId === groupId
    );
  }
  public async getCarbonUserGroupForGroupIds(groupIds: string[]) {
    return (await this.getCarbonUserGroups()).filter((group) =>
      groupIds.includes(group.groupId)
    );
  }
  public getCarbonUserGroups$(): Observable<UserGroupDownload[]> {
    return this.getRawCarbon$().pipe(
      map((rawCarbonResult) => {
        if (isFailure(rawCarbonResult)) {
          throw new Error(
            "Failure getting user groups state from carbon sharing data"
          );
        }
        const parsedGroupData = UserGroupDownloadListSchema.safeParse(
          rawCarbonResult.data
        );
        if (!parsedGroupData.success) {
          throw new Error(
            "Failure parsing ser groups state from carbon sharing data"
          );
        }
        return (parsedGroupData.data as CarbonUserGroupDownload[]).map(
          convertCarbonUserGroupDownload
        );
      })
    );
  }
  public async getCarbonUserGroups(): Promise<UserGroupDownload[]> {
    return ((await this.getRawCarbon()) as CarbonUserGroupDownload[]).map(
      convertCarbonUserGroupDownload
    );
  }
}

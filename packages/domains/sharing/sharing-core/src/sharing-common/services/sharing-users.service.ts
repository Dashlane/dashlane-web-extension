import { Injectable } from "@dashlane/framework-application";
import { Permission } from "@dashlane/sharing-contracts";
import {
  ShareableResource,
  SharingUserRecipient,
  UserInvite,
} from "../sharing.types";
import {
  CurrentUserWithKeyPair,
  CurrentUserWithKeysGetterService,
} from "../../sharing-carbon-helpers";
import { SharingInvitesCryptoService } from "../../sharing-crypto";
import { SharingCommonGateway } from "./sharing.gateway";
interface UserWithPublicKey {
  login: string;
  permission: Permission;
  publicKey: string | null;
}
@Injectable()
export class SharingUsersService {
  public constructor(
    private currentUserGetter: CurrentUserWithKeysGetterService,
    private invitesCryptoService: SharingInvitesCryptoService,
    private sharingGateway: SharingCommonGateway
  ) {}
  public async createSignedUserInvites(
    userRecipients: SharingUserRecipient[],
    resource: ShareableResource,
    shouldAddCurrentUser = true
  ): Promise<UserInvite[]> {
    const usersWithSpkiPublicKeys = userRecipients.length
      ? await this.sharingGateway.getPublicKeysForUsers(
          userRecipients.map((recipient) => recipient.login)
        )
      : [];
    const currentUser = await this.currentUserGetter.getCurrentUserWithKeys();
    const currentUserWithPublicKey = shouldAddCurrentUser
      ? [
          {
            login: currentUser.login,
            publicKey: currentUser.publicKey,
            permission: Permission.Admin,
          },
        ]
      : [];
    const userList = [
      ...currentUserWithPublicKey,
      ...usersWithSpkiPublicKeys.map((user) => ({
        ...user,
        permission:
          userRecipients.find((recipient) => recipient.login === user.login)
            ?.permission ?? Permission.Limited,
      })),
    ];
    return Promise.all(
      userList.map((user) => this.createInvite(user, resource, currentUser))
    );
  }
  public async createSignedUserInvitesPerResource(
    userRecipients: SharingUserRecipient[],
    resources: ShareableResource[]
  ) {
    const usersWithPublicKeys = userRecipients.length
      ? await this.sharingGateway.getPublicKeysForUsers(
          userRecipients.map((recipient) => recipient.login)
        )
      : [];
    const userLoginsWithPublicKeys = usersWithPublicKeys.map(
      (user) => user.login
    );
    const usersWithoutPublicKey = userRecipients
      .filter(
        (recipient) => !userLoginsWithPublicKeys.includes(recipient.login)
      )
      .map(({ login }) => ({ login, publicKey: null }));
    const userList = [...usersWithPublicKeys, ...usersWithoutPublicKey].map(
      (user) => ({
        ...user,
        permission:
          userRecipients.find((recipient) => recipient.login === user.login)
            ?.permission ?? Permission.Limited,
      })
    );
    const result = await Promise.all(
      resources.map(async (resource) => {
        const invites = await Promise.all(
          userList.map((user) => this.createInvite(user, resource))
        );
        return { resource, invites };
      })
    );
    const invitesRecord: Record<string, UserInvite[]> = {};
    result.forEach(({ resource, invites }) => {
      invitesRecord[resource.uuid] = invites;
    });
    return invitesRecord;
  }
  private async createInvite(
    user: UserWithPublicKey,
    resource: ShareableResource,
    currentUser?: CurrentUserWithKeyPair
  ) {
    const isCurrentUser = currentUser?.login === user.login;
    const invite = await this.invitesCryptoService.createSignedInvite(
      user.login,
      resource,
      user.publicKey,
      isCurrentUser ? currentUser.privateKey : undefined
    );
    return {
      ...invite,
      id: user.login,
      alias: user.login,
      permission: isCurrentUser ? Permission.Admin : user.permission,
    };
  }
}

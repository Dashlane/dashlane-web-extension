import { Module } from "@dashlane/framework-application";
import {
  CredentialsGetterService,
  CurrentSpaceGetterService,
  CurrentUserWithKeysGetterService,
  ItemGroupsGetterService,
  NotesGetterService,
  SecretsGetterService,
  UserGroupsGetterService,
} from ".";
import { InviteGetterService } from "./services/invites-getter.service";
@Module({
  sharedModuleName: "sharing-carbon-helpers",
  providers: [
    ItemGroupsGetterService,
    CredentialsGetterService,
    CurrentSpaceGetterService,
    CurrentUserWithKeysGetterService,
    InviteGetterService,
    NotesGetterService,
    SecretsGetterService,
    UserGroupsGetterService,
  ],
  exports: [
    ItemGroupsGetterService,
    CredentialsGetterService,
    CurrentSpaceGetterService,
    CurrentUserWithKeysGetterService,
    InviteGetterService,
    NotesGetterService,
    SecretsGetterService,
    UserGroupsGetterService,
  ],
  imports: [],
})
export class SharingCarbonHelpersModule {}

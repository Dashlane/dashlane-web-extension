const base64 = require("base-64");
import {
  ApplicationModulesAccess,
  Credential,
  isCredential,
  Note,
  Secret,
  UserGroupDownload,
} from "@dashlane/communication";
import { UserUpload } from "@dashlane/sharing/types/createItemGroup";
import { ParsedURL } from "@dashlane/url-parser";
import {
  ItemGroupDownload,
  UserDownload,
} from "@dashlane/sharing/types/serverResponse";
import { UserUpdate } from "@dashlane/sharing/types/updateItemGroupMembers";
import { CollectionDownload } from "@dashlane/server-sdk/v1";
import { ICryptoService } from "Libs/CryptoCenter/SharingCryptoService";
import { ItemGroupResponse } from "Libs/WS/Sharing/2/PerformItemGroupAction";
import { sendExceptionLog } from "Logs/Exception";
import { asyncMap } from "Utils/async-map";
import { asyncFilter } from "Helpers/async-filter";
import { AuditLogDetails } from "./ItemGroupService";
import { validateItemGroup } from "./SharingValidationService";
import { getItemGroupKey } from "./SharingHelpers";
import { State } from "Store/types";
import { activeSpacesSelector } from "Session/selectors";
import { makeFeatureFlipsSelectors } from "Feature/selectors";
export function generateAcceptSignature(
  crypto: ICryptoService,
  privateKey: string,
  groupId: string,
  groupKey: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.asymmetricEncryption
      .sign(privateKey, base64.encode(groupId + "-accepted-" + groupKey))
      .then(resolve, reject);
  });
}
export function isAcceptSignatureValid(
  crypto: ICryptoService,
  acceptSignature: string,
  publicKey: string,
  data: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    crypto.asymmetricEncryption
      .verify(publicKey, acceptSignature, data)
      .then(resolve, reject);
  });
}
export function generateProposeSignature(
  crypto: ICryptoService,
  groupKey: string,
  contentToSign: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.symmetricEncryption
      .signHmacSHA256(groupKey, base64.encode(contentToSign))
      .then(resolve, reject);
  });
}
export function isProposeSignatureValid(
  crypto: ICryptoService,
  proposeSignature: string,
  contentToSign: string,
  groupKey: string
): Promise<boolean> {
  return generateProposeSignature(crypto, groupKey, contentToSign).then(
    (newProposeSignature) => {
      return proposeSignature === newProposeSignature;
    }
  );
}
export async function validateProposeSignature(
  context: string,
  crypto: ICryptoService,
  key: string,
  proposeSignature: string,
  signedContent: string
) {
  const proposeSignatureValid =
    await crypto.symmetricEncryption.verifyHmacSHA256(
      key,
      proposeSignature,
      signedContent
    );
  if (!proposeSignatureValid) {
    const error = new Error(
      `${context}: INVALID_PROPOSE_CREATION Failed to validate newly created propose signature`
    );
    sendExceptionLog({
      error,
    });
    throw error;
  }
}
function isUserUpload(
  userPatch: UserUpload | UserUpdate
): userPatch is UserUpload {
  return "alias" in userPatch;
}
type UserDownloadExtra = UserDownload & {
  matchProposeSignature: boolean;
  validProposeSignature: boolean;
};
type ItemGroupDownloadExtra = ItemGroupDownload & {
  users: UserDownloadExtra[];
  matchItemGroupKey: boolean;
};
function isUserDownloadExtra(
  userDownload: UserDownload | UserDownloadExtra
): userDownload is UserDownloadExtra {
  return "validProposeSignature" in userDownload;
}
function getMessageForItemGroupUser(itemGroupUser: UserDownloadExtra) {
  const isValid = isUserDownloadExtra(itemGroupUser)
    ? itemGroupUser.validProposeSignature
    : "not-found";
  const matchSignature =
    isUserDownloadExtra(itemGroupUser) &&
    itemGroupUser.matchProposeSignature !== undefined
      ? itemGroupUser.matchProposeSignature
      : "not-found";
  return `  Status:${itemGroupUser.status} Permission:${itemGroupUser.permission} ValidProposeSignature:${isValid} MatchesProposeSignature:${matchSignature}`;
}
function createErrorMessage(
  context: string,
  users: (UserUpload | UserUpdate)[],
  itemGroups: ItemGroupDownloadExtra[]
) {
  const usersMessage = users
    .map((user) => {
      const aliasStatus = isUserUpload(user)
        ? !!user.proposeSignatureUsingAlias
        : "updating";
      return `Invalid Uploaded User UsingAlias:${aliasStatus} Permission:${user.permission}`;
    })
    .join("\n");
  const itemGroupsMessage = itemGroups
    .map((invalidGroup) =>
      [
        `Invalid ItemGroup ID:${invalidGroup.groupId} Revision:${invalidGroup.revision} TeamID:${invalidGroup.teamId} MatchItemGroupKey:${invalidGroup.matchItemGroupKey}`,
        `Invalid ItemGroup Users:`,
        invalidGroup.users.map(getMessageForItemGroupUser).join("\n"),
      ].join("\n")
    )
    .join("\n");
  const errorSummary = `${context}: INVALID_PROPOSE_IN_RESPONSE Invalid item group on share`;
  const errorMessage = [errorSummary, usersMessage, itemGroupsMessage].join(
    "\n"
  );
  return errorMessage;
}
async function addExtraPropertiesToUsers(
  users: UserDownload[],
  uploadUsers: (UserUpload | UserUpdate)[],
  crypto: ICryptoService,
  itemGroupKey: string
): Promise<UserDownloadExtra[]> {
  return await asyncMap(users, async (user): Promise<UserDownloadExtra> => {
    const uploadUserMatch = uploadUsers.find(
      (uploadUser) => uploadUser.userId === user.userId
    );
    return {
      ...user,
      validProposeSignature: await isProposeSignatureValid(
        crypto,
        user.proposeSignature,
        user.userId,
        itemGroupKey
      ),
      matchProposeSignature:
        uploadUserMatch && user
          ? uploadUserMatch.proposeSignature === user.proposeSignature
          : undefined,
    };
  });
}
export async function validateItemGroupResponse(
  context: string,
  crypto: ICryptoService,
  response: ItemGroupResponse,
  publicKey: string,
  privateKey: string,
  itemGroupKey: string,
  userLogin: string,
  users: (UserUpload | UserUpdate)[],
  userGroups: UserGroupDownload[],
  skipItemGroupCheck = false,
  collections?: CollectionDownload[]
) {
  try {
    const invalidUploadedUsers = await asyncFilter(
      users,
      async (user) =>
        !(await isProposeSignatureValid(
          crypto,
          user.proposeSignature,
          user.userId,
          itemGroupKey
        ))
    );
    const invalidGroups = await asyncFilter(
      response.itemGroups,
      async (itemGroupDownload) =>
        !(
          await validateItemGroup(
            itemGroupDownload,
            userGroups,
            privateKey,
            publicKey,
            userLogin,
            collections
          )
        ).isValid
    );
    const isInvalid = skipItemGroupCheck
      ? invalidUploadedUsers.length > 0
      : invalidGroups.length > 0 || invalidUploadedUsers.length > 0;
    if (isInvalid) {
      const invalidGroupsExtra = await asyncMap(
        invalidGroups,
        async (invalidGroup): Promise<ItemGroupDownloadExtra> => ({
          ...invalidGroup,
          users: await addExtraPropertiesToUsers(
            invalidGroup.users,
            users,
            crypto,
            itemGroupKey
          ),
          matchItemGroupKey:
            itemGroupKey ===
            (await getItemGroupKey(
              invalidGroup,
              userGroups,
              privateKey,
              userLogin,
              collections
            )),
        })
      );
      const errorMessage = createErrorMessage(
        context,
        invalidUploadedUsers,
        invalidGroupsExtra
      );
      await sendExceptionLog({
        error: new Error(errorMessage),
      });
    }
  } catch (error) {
    error.message = `[validateItemGroupResponse]: ERROR_VALIDATING_PROPOSE_IN_RESPONSE Error validating item group response ${error.message}`;
    await sendExceptionLog({
      error,
    });
  }
}
function getSharingItemType(
  item: Credential | Note | Secret
): "AUTHENTIFIANT" | "SECURENOTE" | "SECRET" {
  switch (item.kwType) {
    case "KWAuthentifiant":
      return "AUTHENTIFIANT";
    case "KWSecureNote":
      return "SECURENOTE";
    default:
      return "SECRET";
  }
}
export async function createAuditLogDetails(
  applicationModulesAccess: ApplicationModulesAccess,
  state: State,
  item?: Credential | Note | Secret
): Promise<AuditLogDetails> {
  const space = activeSpacesSelector(state)[0];
  const featureFlips = await makeFeatureFlipsSelectors(
    applicationModulesAccess
  ).featureFlipsSelector();
  const hasSharingLogsEnabled = featureFlips["audit_logs_sharing"];
  const captureLog =
    (!!item?.SpaceId && space?.info?.collectSensitiveDataAuditLogsEnabled) ??
    false;
  if (!hasSharingLogsEnabled || !captureLog) {
    return undefined;
  }
  const urlToUse =
    isCredential(item) && item?.Url
      ? new ParsedURL(item?.Url).getHostname()
      : "";
  const validatedUrl = urlToUse ? urlToUse : "";
  const domain = isCredential(item) ? validatedUrl : undefined;
  const type = getSharingItemType(item);
  return { captureLog, domain, type };
}
export type TypeOfArray<T> = T extends Array<infer Q> ? Q : never;

import { Diff } from "utility-types";
import { defaultTo, equals, isNil, pick } from "ramda";
import { Enum } from "typescript-string-enums";
import {
  type Credential,
  type CredentialDetailView,
  type DataModelObject,
  SaveOrigin,
  type SharingData,
  type Space,
  type TrustedUrl,
} from "@dashlane/communication";
import { ParsedURL } from "@dashlane/url-parser";
import { evaluatePasswordStrength } from "Health/Strength/evaluatePasswordStrength";
import {
  cleanUrlForPersonalData,
  getUpdatedTrustedUrlList,
} from "DataManagement/Credentials/url/";
import { normalizeUsernames } from "DataManagement/Credentials/usernames";
import { saveGeneratedPassword as actionSaveGeneratedPassword } from "Session/Store/actions";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import { StoreService } from "Store";
export const SaveFrom = Enum(
  "MANUAL",
  "SAVE_PASSWORD",
  "DATACAPTURE",
  "IMPORT"
);
export type SaveFrom = Enum<typeof SaveFrom>;
import { sendExceptionLog } from "Logs/Exception";
import {
  makeNewPersonalDataItemBase,
  makeUpdatedPersonalDataItemBase,
  notifySharersOnUpdate,
} from "DataManagement/helpers";
import { associateGeneratedPasswordsToCredential } from "DataManagement/GeneratedPassword/associated-credential";
import { PersonalData } from "Session/Store/personalData/types";
import { detailView } from "DataManagement/Credentials/views/detail";
import { IconDomains } from "Session/Store/Icons";
import { getSharingStatusDetail } from "Sharing/2/Services/views";
import { getSmartCategorizedSpace } from "DataManagement/SmartTeamSpaces/helpers";
import {
  SaveCredential,
  SaveCredentialContent,
  SaveCredentialContentKeys,
} from "DataManagement/Credentials/types";
import { getIcon } from "DataManagement/Icons/get-icons";
import {
  ApplicationModulesAccess,
  CredentialLinkedServices,
  LinkedWebsiteSource,
} from "@dashlane/communication";
export const sharedFields: (keyof Credential)[] = [
  "Email",
  "Login",
  "Note",
  "OtpSecret",
  "OtpUrl",
  "Password",
  "SecondaryLogin",
  "Title",
  "Url",
  "UseFixedUrl",
  "UserSelectedUrl",
  "LinkedServices",
];
const assignCategory = <T extends SaveCredential>(
  item: T,
  category: string
): T => ({
  ...item,
  content: {
    ...item.content,
    category,
  },
});
const defaultToEmptyString = defaultTo("");
export function beforeCredentialChange(
  item: SaveCredential,
  personalData: PersonalData
): SaveCredential {
  const categories = personalData.credentialCategories;
  const itemCategory = item.content.category;
  if (!itemCategory) {
    return item;
  }
  const existingCategoryById = categories.find(
    (existingCategory) => existingCategory.Id === itemCategory
  );
  if (existingCategoryById) {
    return item;
  }
  const existingCategoryByName = categories.find(
    (existingCategory) => existingCategory.CategoryName === itemCategory
  );
  if (existingCategoryByName) {
    return assignCategory(item, existingCategoryByName.Id);
  }
  return assignCategory(item, "");
}
export async function makeUpdatedCredential(
  updatedItem: SaveCredential,
  existingItem: Credential
): Promise<Credential> {
  const now = getUnixTimestamp();
  const credentialSpecificProps = await makeCredentialSpecificProps(
    updatedItem,
    existingItem,
    now
  );
  return {
    ...existingItem,
    ...makeUpdatedPersonalDataItemBase({
      existingItem,
      updatedItem,
      itemUpdateDate: now,
    }),
    ...credentialSpecificProps,
  };
}
export async function makeNewCredential(
  newItem: SaveCredential
): Promise<Credential> {
  const now = getUnixTimestamp();
  const credentialSpecificProps = await makeCredentialSpecificProps(
    newItem,
    null,
    now
  );
  const newCredential = {
    ...makeNewPersonalDataItemBase(newItem, now),
    ...credentialSpecificProps,
  };
  return initializeTitleWithDomain(newCredential);
}
function initializeTitleWithDomain(credential: Credential): Credential {
  const { Title, Url } = credential;
  return {
    ...credential,
    Title: Title || defaultToEmptyString(new ParsedURL(Url).getRootDomain()),
  };
}
export type MakeCredentialSpecificResult = Diff<Credential, DataModelObject>;
type GetItemFieldParams<K extends keyof Credential> = {
  itemField: SaveCredentialContentKeys;
  existingItemField: K;
  defaultValue: Credential[K];
};
function makeItemFieldValueGetter(
  content: SaveCredentialContent,
  existingItem?: Credential
) {
  return <K extends keyof Credential>({
    itemField,
    existingItemField,
    defaultValue,
  }: GetItemFieldParams<K>): Credential[K] => {
    return !isNil(content[itemField])
      ? content[itemField]
      : existingItem && !isNil(existingItem[existingItemField])
      ? existingItem[existingItemField]
      : defaultValue;
  };
}
export interface UrlFields {
  Url: string;
  UserSelectedUrl: string;
  UseFixedUrl: boolean;
  TrustedUrlGroup: TrustedUrl[];
}
function getUrlFields(
  newItem: SaveCredential,
  existingItem?: Credential
): UrlFields {
  const { url } = newItem.content;
  const isUrlUndefined = url === undefined;
  const existingUserSelectedUrl = existingItem?.UserSelectedUrl ?? "";
  const existingUseFixedUrl = existingItem?.UseFixedUrl ?? false;
  const existingTrustedUrlGroup = existingItem?.TrustedUrlGroup ?? [];
  const isManualSave = newItem.origin === SaveOrigin.MANUAL;
  const urlHasBeenUpdated = !isUrlUndefined && existingItem?.Url !== url;
  const newUrl = cleanUrlForPersonalData(
    isUrlUndefined ? existingItem?.Url : url,
    {
      keepQueryString: isManualSave,
    }
  );
  const selectedUrlDetails =
    isManualSave && urlHasBeenUpdated
      ? {
          UserSelectedUrl: newUrl,
          UseFixedUrl: true,
        }
      : {
          UserSelectedUrl: existingUserSelectedUrl,
          UseFixedUrl: existingUseFixedUrl,
        };
  return {
    Url: newUrl,
    TrustedUrlGroup: getUpdatedTrustedUrlList(existingTrustedUrlGroup, newUrl),
    ...selectedUrlDetails,
  };
}
export async function makeCredentialSpecificProps(
  item: SaveCredential,
  existingItem?: Credential,
  now: number = getUnixTimestamp()
): Promise<MakeCredentialSpecificResult> {
  const { content } = item;
  const linkedServices: CredentialLinkedServices = {
    associated_domains:
      content.linkedWebsites?.addedByUser?.map((linkedWebsite: string) => {
        return {
          source: LinkedWebsiteSource.Manual,
          domain: linkedWebsite,
        };
      }) ??
      existingItem?.LinkedServices?.associated_domains ??
      [],
  };
  const getItemFieldValue = makeItemFieldValueGetter(content, existingItem);
  const { email, login, secondaryLogin } = normalizeUsernames(
    getItemFieldValue({
      itemField: "email",
      existingItemField: "Email",
      defaultValue: "",
    }),
    getItemFieldValue({
      itemField: "login",
      existingItemField: "Login",
      defaultValue: "",
    }),
    getItemFieldValue({
      itemField: "secondaryLogin",
      existingItemField: "SecondaryLogin",
      defaultValue: "",
    })
  );
  const Password = getItemFieldValue({
    itemField: "password",
    existingItemField: "Password",
    defaultValue: "",
  });
  const isPasswordModified =
    !existingItem || existingItem.Password !== Password;
  const modificationDatetimeProp = isPasswordModified
    ? { ModificationDatetime: now }
    : {};
  return {
    AutoLogin: getItemFieldValue({
      itemField: "autoLogin",
      existingItemField: "AutoLogin",
      defaultValue: true,
    }),
    AutoProtected: getItemFieldValue({
      itemField: "protectWithMasterPassword",
      existingItemField: "AutoProtected",
      defaultValue: false,
    }),
    Category: getItemFieldValue({
      itemField: "category",
      existingItemField: "Category",
      defaultValue: "",
    }),
    Checked: getItemFieldValue({
      itemField: "checked",
      existingItemField: "Checked",
      defaultValue: false,
    }),
    Email: email,
    Login: login,
    Note: getItemFieldValue({
      itemField: "note",
      existingItemField: "Note",
      defaultValue: "",
    }),
    Password,
    SecondaryLogin: secondaryLogin,
    Status: "ACCOUNT_NOT_VERIFIED",
    Strength: Password ? await evaluatePasswordStrength(Password) : 0,
    SubdomainOnly: getItemFieldValue({
      itemField: "onlyForThisSubdomain",
      existingItemField: "SubdomainOnly",
      defaultValue: false,
    }),
    Title: getItemFieldValue({
      itemField: "title",
      existingItemField: "Title",
      defaultValue: "",
    }),
    ...getUrlFields(item, existingItem),
    OtpSecret: getItemFieldValue({
      itemField: "otpSecret",
      existingItemField: "OtpSecret",
      defaultValue: undefined,
    }),
    OtpUrl: getItemFieldValue({
      itemField: "otpUrl",
      existingItemField: "OtpUrl",
      defaultValue: undefined,
    }),
    LinkedServices: linkedServices,
    ...modificationDatetimeProp,
  };
}
export async function notifySharersCredentialUpdated(
  storeService: StoreService,
  originalCredential: Credential,
  newCredential: Credential,
  applicationModulesAccess: ApplicationModulesAccess
) {
  const hasUpdatedFields = !equals(
    pick(sharedFields, originalCredential),
    pick(sharedFields, newCredential)
  );
  if (!hasUpdatedFields) {
    return true;
  }
  try {
    await notifySharersOnUpdate(
      storeService,
      newCredential,
      applicationModulesAccess
    );
    return true;
  } catch (error) {
    const augmentedError = new Error(
      `[Sharing] - Failed to update shared item: ${error}`
    );
    sendExceptionLog({ error: augmentedError });
    return false;
  }
}
export function afterCredentialSaved(
  storeService: StoreService,
  item: Credential
) {
  const updatedGeneratedPasswords = associateGeneratedPasswordsToCredential(
    storeService.getPersonalData().generatedPasswords,
    item
  );
  updatedGeneratedPasswords.forEach((updatedGeneratedPassword) => {
    storeService.dispatch(
      actionSaveGeneratedPassword(updatedGeneratedPassword)
    );
  });
}
export function viewCredential(
  credential: Credential,
  sharingData: SharingData,
  userId: string,
  limitedSharedItems: {
    [id: string]: boolean;
  },
  icons: IconDomains,
  spaces: Space[]
): CredentialDetailView | undefined {
  if (!credential) {
    return undefined;
  }
  const getSharingStatusById = getSharingStatusDetail(
    limitedSharedItems,
    sharingData,
    userId
  );
  const getIconById = getIcon(icons);
  const getSmartCategorizedSpaceForCredential =
    getSmartCategorizedSpace(spaces);
  return detailView(
    getSharingStatusById,
    getIconById,
    getSmartCategorizedSpaceForCredential,
    credential
  );
}

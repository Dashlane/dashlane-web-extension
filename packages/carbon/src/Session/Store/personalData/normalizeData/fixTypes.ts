import {
  BaseDataModelObject,
  Credential,
  CredentialLinkedServices,
  DataModelObject,
  EmbeddedAttachment,
  GeneratedPassword,
  LinkedWebsite,
  Note,
  Passkey,
  TrustedUrl,
} from "@dashlane/communication";
import { fixPropertiesTypes } from "Session/Store/fixTypes";
import { VersionedBreach } from "DataManagement/Breaches/types";
const commonNumberProperties: (keyof DataModelObject)[] = [
  "CreationDatetime",
  "LastBackupTime",
  "UserModificationDatetime",
];
const commonStringProperties: (keyof DataModelObject)[] = ["Id", "SpaceId"];
export function fixCredentialTypesFromTransaction(
  cred: Credential
): Credential {
  const booleanProperties = [
    "AutoLogin",
    "AutoProtected",
    "Checked",
    "SharedObject",
    "SubdomainOnly",
    "UseFixedUrl",
    "limitedPermissions",
  ];
  const numberProperties = [
    "LastUse",
    "ModificationDatetime",
    "NumberUse",
    "Strength",
  ].concat(commonNumberProperties);
  const jsonProperties: string[] = ["Attachments", "LinkedServices"];
  const stringProperties = [
    "Alias",
    "Category",
    "ConnectionOptions",
    "Email",
    "Login",
    "Note",
    "OtpSecret",
    "OtpUrl",
    "Password",
    "Port",
    "SID",
    "SecondaryLogin",
    "Server",
    "Title",
    "Url",
    "UserSelectedUrl",
  ].concat(commonStringProperties);
  const {
    TrustedUrlGroup,
    Attachments,
    LinkedServices,
    domainIcon,
    ...fixedCredential
  } = fixPropertiesTypes<Credential>(
    booleanProperties,
    numberProperties,
    jsonProperties,
    stringProperties,
    cred
  );
  const fixedAttachments = Array.isArray(Attachments)
    ? { Attachments: Attachments.map(fixAttachmentProperties) }
    : {};
  const domainIconMerge =
    typeof domainIcon === "object" && domainIcon !== null
      ? { domainIcon: fixDomainIconTypes(domainIcon) }
      : {};
  const fixedLinkedServices = LinkedServices
    ? { LinkedServices: fixLinkedServicesTypes(LinkedServices) }
    : {};
  const fixedTrustedUrlGroup =
    TrustedUrlGroup && TrustedUrlGroup.length > 0
      ? TrustedUrlGroup.map(fixTrustedUrlTypes)
      : [];
  return {
    ...fixedCredential,
    ...fixedAttachments,
    ...fixedLinkedServices,
    ...domainIconMerge,
    TrustedUrlGroup: fixedTrustedUrlGroup,
  };
}
export function fixTrustedUrlTypes(trustedUrl: {
  [key in keyof TrustedUrl]: any;
}): TrustedUrl {
  const booleanProperties = [] as string[];
  const numberProperties = [] as string[];
  const jsonProperties: string[] = [];
  const stringProperties = ["TrustedUrl", "TrustedUrlExpire"];
  return fixPropertiesTypes<TrustedUrl>(
    booleanProperties,
    numberProperties,
    jsonProperties,
    stringProperties,
    trustedUrl
  );
}
type DomainIcon = Credential["domainIcon"];
export function fixDomainIconTypes(domainIcon: {
  [key in keyof DomainIcon]: any;
}): DomainIcon {
  const booleanProperties = [] as string[];
  const numberProperties = [] as string[];
  const jsonProperties: string[] = [];
  const stringProperties = ["backgroundColor", "mainColor"];
  const { urls, ...fixedDomainIcon } = fixPropertiesTypes<DomainIcon>(
    booleanProperties,
    numberProperties,
    jsonProperties,
    stringProperties,
    domainIcon
  );
  const fixedUrls =
    typeof urls === "object" && urls !== null
      ? fixAllStringObject(urls)
      : ({} as {
          [key: string]: string;
        });
  return { ...fixedDomainIcon, urls: fixedUrls };
}
export function fixLinkedServicesTypes(LinkedServices: {
  [key in keyof CredentialLinkedServices]: any;
}): CredentialLinkedServices {
  const fixedAssociatedDomains = Array.isArray(
    LinkedServices.associated_domains
  )
    ? LinkedServices.associated_domains.map(fixAssociatedDomainProperties)
    : [];
  return {
    ...LinkedServices,
    associated_domains: fixedAssociatedDomains,
  };
}
function fixAssociatedDomainProperties(associatedDomain: {
  [key in keyof LinkedWebsite]: any;
}): LinkedWebsite {
  const booleanProperties = [] as string[];
  const numberProperties = [] as string[];
  const jsonProperties = [] as string[];
  const stringProperties = ["domain", "source"];
  return fixPropertiesTypes<LinkedWebsite>(
    booleanProperties,
    numberProperties,
    jsonProperties,
    stringProperties,
    associatedDomain
  );
}
export function fixAllStringObject(item: { [k: string]: any }): {
  [k: string]: string;
} {
  const booleanProperties = [] as string[];
  const numberProperties = [] as string[];
  const jsonProperties: string[] = [];
  const stringProperties = Object.keys(item);
  return fixPropertiesTypes<{
    [k: string]: string;
  }>(
    booleanProperties,
    numberProperties,
    jsonProperties,
    stringProperties,
    item
  );
}
export function fixNoteTypesFromTransaction(note: {
  [key in keyof Note]: any;
}): Note {
  const booleanProperties = ["Secured"];
  const numberProperties = ["CreationDate", "UpdateDate"].concat(
    commonNumberProperties
  );
  const jsonProperties: string[] = ["Attachments"];
  const stringProperties = ["Title", "Content", "Category"].concat(
    commonStringProperties
  );
  const { Attachments, Type, ...fixedNote } = fixPropertiesTypes<Note>(
    booleanProperties,
    numberProperties,
    jsonProperties,
    stringProperties,
    note
  );
  const fixedAttachments = Array.isArray(Attachments)
    ? { Attachments: Attachments.map(fixAttachmentProperties) }
    : {};
  const defaultedType = Type || "GRAY";
  return {
    ...fixedNote,
    ...fixedAttachments,
    Type: defaultedType,
  };
}
export function fixAttachmentProperties(attachment: {
  [key in keyof EmbeddedAttachment]: any;
}): EmbeddedAttachment {
  const booleanProperties = [] as string[];
  const numberProperties = [
    "version",
    "localSize",
    "remoteSize",
    "creationDatetime",
    "userModificationDatetime",
  ];
  const jsonProperties: string[] = [];
  const stringProperties = [
    "id",
    "type",
    "filename",
    "downloadKey",
    "cryptoKey",
    "owner",
  ];
  return fixPropertiesTypes<EmbeddedAttachment>(
    booleanProperties,
    numberProperties,
    jsonProperties,
    stringProperties,
    attachment
  );
}
export function fixNoteTypesFromStore(note: Note) {
  const jsonProperties: (keyof Note)[] = ["Attachments"];
  const fixedProperties = {};
  jsonProperties
    .filter((key) => !!note[key])
    .forEach((key) => {
      fixedProperties[key] = JSON.stringify(note[key]);
    });
  return Object.assign({}, note, fixedProperties);
}
export function fixCredentialTypesFromStore(credential: Credential) {
  const jsonProperties: (keyof Credential)[] = [
    "Attachments",
    "LinkedServices",
  ];
  const fixedProperties = {};
  jsonProperties
    .filter((key) => !!credential[key])
    .forEach((key) => {
      fixedProperties[key] = JSON.stringify(credential[key]);
    });
  return Object.assign({}, credential, fixedProperties);
}
export function fixGeneratedPasswordsTypes(
  generatedPassword: GeneratedPassword
): GeneratedPassword {
  const booleanProperties: string[] = [];
  const numberProperties = ["GeneratedDate"].concat(commonNumberProperties);
  const jsonProperties: string[] = [];
  const stringProperties: string[] = [];
  return fixPropertiesTypes<GeneratedPassword>(
    booleanProperties,
    numberProperties,
    jsonProperties,
    stringProperties,
    generatedPassword
  );
}
export function fixCommonPropertiesTypes(
  dataModelObject: BaseDataModelObject
): BaseDataModelObject {
  return fixPropertiesTypes<BaseDataModelObject>(
    [],
    commonNumberProperties,
    [],
    [],
    dataModelObject
  );
}
export function fixBreachTypesFromTransaction(
  breach: VersionedBreach
): VersionedBreach {
  const numberProperties = [...commonNumberProperties, "ContentRevision"];
  const jsonProperties = ["Content", "LeakedPasswords"];
  const stringProperties = [...commonStringProperties, "BreachId", "Status"];
  const fixedBreach = fixPropertiesTypes(
    [],
    numberProperties,
    jsonProperties,
    stringProperties,
    breach
  );
  if (!Array.isArray(fixedBreach.LeakedPasswords)) {
    fixedBreach.LeakedPasswords = [];
  }
  return fixedBreach;
}
export function fixBreachTypesFromStore(breach: VersionedBreach) {
  const jsonProperties: (keyof VersionedBreach)[] = [
    "Content",
    "LeakedPasswords",
  ];
  const fixedProperties = {};
  jsonProperties
    .filter((key) => !!breach[key])
    .forEach((key) => {
      fixedProperties[key] = JSON.stringify(breach[key]);
    });
  if (!Array.isArray(breach.LeakedPasswords)) {
    fixedProperties["LeakedPasswords"] = JSON.stringify([]);
  }
  return {
    ...breach,
    ...fixedProperties,
  };
}
export function fixPasskeyTypesFromTransaction(passkey: Passkey): Passkey {
  const booleanProperties: (keyof Passkey)[] = [];
  const numberProperties: (keyof Passkey)[] = [
    ...commonNumberProperties,
    "Counter",
    "KeyAlgorithm",
  ];
  const jsonProperties: (keyof Passkey)[] = ["PrivateKey"];
  const stringProperties: (keyof Passkey)[] = [
    ...commonStringProperties,
    "CredentialId",
    "RpId",
    "RpName",
    "UserDisplayName",
    "UserHandle",
  ];
  const result = fixPropertiesTypes(
    booleanProperties,
    numberProperties,
    jsonProperties,
    stringProperties,
    passkey
  );
  return result;
}

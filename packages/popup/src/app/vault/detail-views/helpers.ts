import color from "color";
import { colors } from "@dashlane/ui-components";
import { format, parseISO } from "date-fns";
import {
  AnonymousRevealVaultItemFieldEvent,
  DomainType,
  Field,
  hashDomain,
  ItemType,
  UserCopyVaultItemFieldEvent,
  UserRevealVaultItemFieldEvent,
} from "@dashlane/hermes";
import { ParsedURL } from "@dashlane/url-parser";
import { VaultItemType } from "@dashlane/vault-contracts";
import type { Route } from "@dashlane/framework-infra/spi";
import { openExternalUrl } from "../../../libs/externalUrls";
import {
  openWebAppAndClosePopup,
  vaultItemTypeToHermesItemTypeMap,
} from "../../helpers";
import { logOpenCredentialUrl } from "../../../libs/logs/events/vault/open-external-vault-item-link";
import { logEvent } from "../../../libs/logs/logEvent";
export const openItemInWebapp = async (identifier: string, route: Route) => {
  await openWebAppAndClosePopup({
    route: route,
    id: identifier,
  });
};
export const openCredential = async (url: string, identifier: string) => {
  await openWebAppAndClosePopup({
    route: "/passwords",
    id: identifier,
  });
};
export const openCredentialWebsite = async (id: string, URL: string) => {
  await logOpenCredentialUrl(id, URL);
  await openExternalUrl(URL);
};
export const copyItemToClipboard = async ({
  value,
  itemType,
  field,
  itemId,
  isProtected,
}: {
  value: string;
  itemType: VaultItemType;
  field: Field;
  itemId: string;
  isProtected?: boolean;
}) => {
  await navigator.clipboard.writeText(value);
  return new Promise<void>((resolve, reject) => {
    try {
      void logEvent(
        new UserCopyVaultItemFieldEvent({
          itemType:
            vaultItemTypeToHermesItemTypeMap[itemType] ?? ItemType.Credential,
          field: field,
          itemId: itemId,
          isProtected: isProtected ?? false,
        })
      );
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
export const getHeaderBackgroundColor = (
  initialBackgroundColor: string | undefined
) => {
  const HEX_COLOR_REGEXP = /^#([0-9A-F]{3}){1,2}$/i;
  const domainBackgroundColor = initialBackgroundColor ?? colors.dashGreen00;
  let backgroundColor = domainBackgroundColor.startsWith("#")
    ? domainBackgroundColor
    : `#${domainBackgroundColor}`;
  if (!HEX_COLOR_REGEXP.test(backgroundColor)) {
    backgroundColor = colors.white;
  }
  const contrast = color(backgroundColor).contrast(color("white"));
  const backgroundStyle =
    contrast < 1.1
      ? {
          backgroundColor: colors.dashGreen00,
        }
      : { backgroundColor };
  return { backgroundStyle, backgroundColor };
};
export const sendLogsForRevealPassword = async (
  id: string,
  URL: string,
  isProtected: boolean
) => {
  void logEvent(
    new UserRevealVaultItemFieldEvent({
      field: Field.Password,
      isProtected: isProtected,
      itemId: id,
      itemType: ItemType.Credential,
    })
  );
  const rootDomain = new ParsedURL(URL).getRootDomain();
  void logEvent(
    new AnonymousRevealVaultItemFieldEvent({
      field: Field.Password,
      itemType: ItemType.Credential,
      domain: {
        id: await hashDomain(rootDomain),
        type: DomainType.Web,
      },
    })
  );
};
export const formatMarkdownSource = (value: string) => {
  return value.replace(/\n/gi, "&nbsp; \n");
};
export const dateFormatter = (date?: string, code?: string) => {
  if (!date || !code) {
    return "";
  }
  const parsedDate = parseISO(date);
  const monthYearFormat = code === "en-US" ? "MMMM dd yyyy" : "dd MMMM yyyy";
  return format(parsedDate, monthYearFormat);
};

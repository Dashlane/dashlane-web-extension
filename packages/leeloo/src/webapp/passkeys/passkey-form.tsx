import { ChangeEvent, useEffect } from "react";
import {
  TextArea,
  TextField,
  Tooltip,
  WebsiteField,
} from "@dashlane/design-system";
import { PremiumStatusSpace } from "@dashlane/communication";
import {
  DomainType,
  ItemTypeWithLink,
  PageView,
  UserOpenExternalVaultItemLinkEvent,
} from "@dashlane/hermes";
import { Passkey } from "@dashlane/vault-contracts";
import { ParsedURL } from "@dashlane/url-parser";
import { logEvent, logPageView } from "../../libs/logs/logEvent";
import { useFrozenState } from "../../libs/frozen-state/frozen-state-dialog-context";
import useTranslate from "../../libs/i18n/useTranslate";
import { openUrl } from "../../libs/external-urls";
import { ContentCard } from "../panel/standard/content-card";
import { SpaceSelect } from "../space-select/space-select";
const I18N_KEYS = {
  PASSKEY_DETAIL: "webapp_passkey_edition_title_passkey_detail",
  PASSKEY_ORGANISATION: "webapp_passkey_edition_title_organisation",
  WEBSITE: "webapp_credential_edition_field_website",
  GO_TO_WEBSITE: "webapp_credential_edition_field_website_action_goto",
  USERNAME: "webapp_passkey_edition_field_username",
  USERNAME_PLACEHOLDER: "webapp_passkey_edition_field_username_placeholder",
  ITEM_NAME: "webapp_passkey_edition_field_item_name",
  ITEM_NAME_PLACEHOLDER: "webapp_passkey_edition_field_item_name_placeholder",
  FIELD_NOTES: "webapp_passkey_edition_field_notes",
  FIELD_PLACEHOLDER_NO_NOTES:
    "webapp_passkey_edition_field_placeholder_no_notes",
  SPACE_TOOLTIP: "webapp_passkey_edition_field_force_categorized",
  SPACE_PERSONAL: "webapp_credential_edition_field_space_personal",
};
export interface PasskeyFormProps {
  passkeyContent: Passkey;
  spaceDetails: PremiumStatusSpace | null;
  signalEditedValues: (newPasskeyContent: Passkey) => void;
}
export const PasskeyForm = ({
  passkeyContent,
  spaceDetails,
  signalEditedValues,
}: PasskeyFormProps) => {
  const { translate } = useTranslate();
  const { shouldShowFrozenStateDialog: isUserFrozen } = useFrozenState();
  const currentSpaceName =
    spaceDetails?.teamName ?? translate(I18N_KEYS.SPACE_PERSONAL);
  const { userDisplayName, rpId, itemName, note, spaceId, id } = passkeyContent;
  useEffect(() => {
    logPageView(PageView.ItemPasskeyDetails);
  }, []);
  const handleWebsiteChange = (
    eventOrValue: ChangeEvent<any> | any,
    key = ""
  ): void => {
    if (eventOrValue instanceof Event && key) {
      throw new Error(
        "handleChange was called with both a ChangeEvent and key."
      );
    }
  };
  const handleContentChanged =
    (field: keyof Passkey) =>
    (
      eventOrValue:
        | React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
          >
        | string
    ) => {
      const updatedValue =
        typeof eventOrValue === "string"
          ? eventOrValue
          : eventOrValue.target.value;
      signalEditedValues({
        ...passkeyContent,
        [field]: updatedValue,
      });
    };
  const shouldDisableSpaceChange = Boolean(
    (spaceDetails?.info.forcedDomainsEnabled &&
      passkeyContent.spaceId === spaceDetails?.teamId) ||
      isUserFrozen
  );
  if (isUserFrozen === null) {
    return null;
  }
  return (
    <div sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <ContentCard
        title={translate(I18N_KEYS.PASSKEY_DETAIL)}
        additionalSx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <TextField
          key="passkeyUsername"
          readOnly
          value={userDisplayName}
          label={translate(I18N_KEYS.USERNAME)}
          placeholder={translate(I18N_KEYS.USERNAME_PLACEHOLDER)}
        />
        <WebsiteField
          label={translate(I18N_KEYS.WEBSITE)}
          onChange={handleWebsiteChange}
          showOpenWebsite={{
            label: translate(I18N_KEYS.GO_TO_WEBSITE),
            onClick: () => {
              logEvent(
                new UserOpenExternalVaultItemLinkEvent({
                  itemId: id,
                  itemType: ItemTypeWithLink.Passkey,
                  domainType: DomainType.Web,
                })
              );
              openUrl(new ParsedURL(rpId).getUrlWithFallbackHttpsProtocol());
            },
          }}
          value={rpId}
        />
        <TextArea
          data-name="note"
          readOnly={isUserFrozen}
          label={translate(I18N_KEYS.FIELD_NOTES)}
          placeholder={translate(I18N_KEYS.FIELD_PLACEHOLDER_NO_NOTES)}
          value={note}
          onChange={handleContentChanged("note")}
        />
      </ContentCard>

      <ContentCard
        title={translate(I18N_KEYS.PASSKEY_ORGANISATION)}
        additionalSx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <TextField
          key="passkeyItemName"
          value={itemName ?? userDisplayName}
          onChange={handleContentChanged("itemName")}
          label={translate(I18N_KEYS.ITEM_NAME)}
          placeholder={translate(I18N_KEYS.ITEM_NAME_PLACEHOLDER)}
          readOnly={isUserFrozen}
        />
        <Tooltip
          content={translate(I18N_KEYS.SPACE_TOOLTIP, {
            space: currentSpaceName,
          })}
          passThrough={!shouldDisableSpaceChange}
        >
          <div>
            <SpaceSelect
              spaceId={spaceId}
              isDisabled={shouldDisableSpaceChange}
              onChange={(newSpaceId) =>
                handleContentChanged("spaceId")(newSpaceId)
              }
              isUsingNewDesign
            />
          </div>
        </Tooltip>
      </ContentCard>
    </div>
  );
};

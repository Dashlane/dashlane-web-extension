import { useEffect, useRef, useState } from "react";
import {
  Checkbox,
  Infobox,
  SelectField,
  SelectOption,
  TextField,
  Tooltip,
  useToast,
} from "@dashlane/design-system";
import { NoteType } from "@dashlane/communication";
import { NoteColors } from "@dashlane/vault-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { TextMaxSizeReached } from "./text-max-size-reached";
import { SpaceSelect } from "../../space-select/space-select";
import { getColorsAsOptions, noteColors } from "../../services";
import {
  logUserEventAskAuthentication,
  useProtectedItemsUnlocker,
} from "../../unlock-items";
import { LockedItemType } from "../../unlock-items/types";
import { SecureNoteContent } from "./content";
import {
  CollectionsField,
  CollectionsFieldRef,
} from "../../credentials/form/collections-field/collections-field";
import { ContentCard } from "../../panel/standard/content-card";
import { ColorIcon } from "../color-icon";
import { FieldCollection } from "../../credentials/form/collections-field/collections-field-context";
import { useIsSSOUser } from "../../account/security-settings/hooks/useIsSSOUser";
import { useIsMPlessUser } from "../../account/security-settings/hooks/use-is-mpless-user";
import { SaveSecureNoteContentValues } from "../../personal-data/types";
import { useFrozenState } from "../../../libs/frozen-state/frozen-state-dialog-context";
const I18N_KEYS = {
  NO_CATEGORY: "webapp_secure_notes_addition_no_category",
  PERSONAL_SPACE: "webapp_form_field_personal_space",
  INFO_BOX_ATTACHMENTS: "webapp_secure_notes_infobox_has_attachments",
  INFO_BOX_SHARED: "webapp_secure_notes_infobox_shared",
  SECURITY_LABEL:
    "webapp_secure_notes_addition_field_tab_option_security_label",
  CONTENT_NOTE_DETAILS: "webapp_secure_notes_form_content_note_details",
  CONTENT_NOTE_DETAILS_TITLE:
    "webapp_secure_notes_form_content_note_details_title",
  CONTENT_ITEM_ORGANIZATION:
    "webapp_secure_notes_form_content_item_organization",
  CONTENT_ITEM_ORGANIZATION_FORCED_CATEGORIZATION:
    "webapp_credential_edition_field_force_categorized",
  CONTENT_ITEM_ORGANIZATION_COLOR:
    "webapp_secure_notes_form_content_item_organization_color",
  CONTENT_PREFERENCES: "webapp_secure_notes_form_content_preferences",
  SECURITY_TITLE:
    "webapp_secure_notes_addition_field_tab_option_security_title",
  SECURITY_DESCRIPTION:
    "webapp_secure_notes_addition_field_tab_option_security_description",
  CHANGE_SECURED_SETTING_ON: "webapp_secure_notes_edition_unlocker_on_success",
  CHANGE_SECURED_SETTING_OFF:
    "webapp_secure_notes_edition_unlocker_off_success",
  COLORS: {
    BLUE: "webapp_secure_notes_addition_field_type_option_blue",
    BROWN: "webapp_secure_notes_addition_field_type_option_brown",
    GRAY: "webapp_secure_notes_addition_field_type_option_gray",
    GREEN: "webapp_secure_notes_addition_field_type_option_green",
    ORANGE: "webapp_secure_notes_addition_field_type_option_orange",
    PINK: "webapp_secure_notes_addition_field_type_option_pink",
    PURPLE: "webapp_secure_notes_addition_field_type_option_purple",
    RED: "webapp_secure_notes_addition_field_type_option_red",
    YELLOW: "webapp_secure_notes_addition_field_type_option_yellow",
  },
};
const I18N_KEYS_SECURED_SETTING_ON = {
  title: "webapp_secure_notes_edition_unlocker_title_on",
  subtitle: "webapp_secure_notes_edition_unlocker_description_on",
};
const I18N_KEYS_SECURED_SETTING_OFF = {
  title: "webapp_secure_notes_edition_unlocker_title_off",
  subtitle: "webapp_secure_notes_edition_unlocker_description_off",
};
export const MAX_AUTHORIZED_CHARACTERS = 10000;
export interface SecureNotesFormProps {
  title: string;
  content: string;
  color: string;
  data: SaveSecureNoteContentValues;
  spaceId: string;
  isSecured: boolean;
  isNewItem: boolean;
  isShared: boolean;
  isAdmin: boolean;
  isDisabled: boolean;
  isDisableSecureNotesFFActive: boolean;
  hasAttachment: boolean;
  onModifyData: () => void;
  onSpaceIdChange: (newSpaceId: string) => void;
  onColorChange: (newColor: NoteColors) => void;
  onTitleChange: (newTitle: string) => void;
  onContentChange: (content: string) => void;
  onIsSecuredChange: (newBool: boolean) => void;
  onIsSubmitDisabled: (newBool: boolean) => void;
  onCollectionsToUpdate: (collectionsToUpdate: FieldCollection[]) => void;
  setHasDialogsOpenedByChildren: (isDialogOpen: boolean) => void;
}
export const SecureNoteContentForm = ({
  title,
  color,
  spaceId,
  content,
  isSecured,
  isNewItem,
  isShared,
  isAdmin,
  isDisabled,
  isDisableSecureNotesFFActive,
  hasAttachment,
  data,
  onModifyData,
  onCollectionsToUpdate,
  onSpaceIdChange,
  onTitleChange,
  onContentChange,
  onColorChange,
  onIsSubmitDisabled,
  onIsSecuredChange,
  setHasDialogsOpenedByChildren,
}: SecureNotesFormProps) => {
  const [isMaxSizeReached, setIsMaxSizeReached] = useState(false);
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const isSSOUser = useIsSSOUser();
  const { isMPLessUser } = useIsMPlessUser();
  const collectionsFieldRef = useRef<CollectionsFieldRef>(null);
  const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } =
    useProtectedItemsUnlocker();
  const vaultItemCollections =
    collectionsFieldRef.current?.getVaultItemCollections();
  const { shouldShowFrozenStateDialog: isDiscontinuedUser } = useFrozenState();
  const isSecurityOptionsAvailable = !isSSOUser && !isMPLessUser;
  const isEditing = !!data.id;
  const colorsMap = noteColors.reduce((map, cl) => {
    map[cl] = translate(I18N_KEYS.COLORS[cl]);
    return map;
  }, {});
  const colorOptions = getColorsAsOptions(
    colorsMap,
    noteColors,
    ColorIcon(color as NoteType)
  );
  const changeSecuredSetting = (newValue: boolean) => {
    onIsSecuredChange(newValue);
    showToast({
      description: newValue
        ? translate(I18N_KEYS.CHANGE_SECURED_SETTING_ON)
        : translate(I18N_KEYS.CHANGE_SECURED_SETTING_OFF),
      closeActionLabel: translate("_common_dialog_dismiss_button"),
    });
  };
  const handleAutoProtectedChange = () => {
    const newValue = !isSecured;
    if (!areProtectedItemsUnlocked && !isNewItem) {
      logUserEventAskAuthentication();
      openProtectedItemsUnlocker({
        itemType: LockedItemType.SecureNoteSetting,
        options: {
          fieldsKeys: newValue
            ? I18N_KEYS_SECURED_SETTING_ON
            : I18N_KEYS_SECURED_SETTING_OFF,
          translated: false,
        },
        successCallback: () => changeSecuredSetting(newValue),
      });
    } else {
      changeSecuredSetting(newValue);
    }
  };
  const handleSpaceChange = (newSpaceId: string) => {
    if (spaceId === newSpaceId) {
      return;
    }
    onSpaceIdChange(newSpaceId);
    collectionsFieldRef.current?.clearVaultItemCollections();
  };
  const isInSharedCollection = Boolean(
    vaultItemCollections?.some(
      (collection: FieldCollection) => collection.isShared
    )
  );
  const isSharedWithLimitedRights = data.limitedPermissions;
  const shouldDisableSpaceChange =
    isInSharedCollection || isSharedWithLimitedRights || isDisabled || isShared;
  useEffect(() => {
    if (content.length > MAX_AUTHORIZED_CHARACTERS && !isMaxSizeReached) {
      setIsMaxSizeReached(true);
      onIsSubmitDisabled(true);
    } else if (content.length < MAX_AUTHORIZED_CHARACTERS && isMaxSizeReached) {
      setIsMaxSizeReached(false);
      onIsSubmitDisabled(false);
    }
  }, [content.length, isMaxSizeReached, onIsSubmitDisabled]);
  return (
    <>
      {(isShared || hasAttachment) && (
        <Infobox
          mood="neutral"
          size="small"
          title={
            isShared
              ? translate(I18N_KEYS.INFO_BOX_SHARED)
              : translate(I18N_KEYS.INFO_BOX_ATTACHMENTS)
          }
          sx={{ margin: "10px 0px" }}
        />
      )}

      <div sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <ContentCard title={translate(I18N_KEYS.CONTENT_NOTE_DETAILS)}>
          <TextField
            label={translate(I18N_KEYS.CONTENT_NOTE_DETAILS_TITLE)}
            value={title}
            readOnly={isDisabled || (isShared && !isAdmin)}
            onChange={(event) => onTitleChange(event.target.value)}
          />
          <SecureNoteContent
            title={title}
            content={content}
            isSecured={isSecured}
            setContent={onContentChange}
            limitedPermissions={isShared && !isAdmin}
            readonly={isDisabled || isDisableSecureNotesFFActive}
            isEditing={isEditing}
            spaceId={spaceId}
          />
          <TextMaxSizeReached
            isMaxSizeReached={isMaxSizeReached}
            currentSize={content.length}
          />
        </ContentCard>

        <ContentCard
          title={translate(I18N_KEYS.CONTENT_ITEM_ORGANIZATION)}
          additionalSx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <SelectField
            value={color}
            data-name="colorSelect"
            label={translate(I18N_KEYS.CONTENT_ITEM_ORGANIZATION_COLOR)}
            onChange={onColorChange}
            readOnly={isDisabled}
          >
            {colorOptions.map((colorOption) => (
              <SelectOption key={colorOption.value} value={colorOption.value}>
                {colorOption.label}
              </SelectOption>
            ))}
          </SelectField>
          <Tooltip
            wrapTrigger
            content={translate(
              I18N_KEYS.CONTENT_ITEM_ORGANIZATION_FORCED_CATEGORIZATION,
              {
                space: spaceId,
              }
            )}
            passThrough={!shouldDisableSpaceChange}
          >
            <SpaceSelect
              spaceId={spaceId ?? ""}
              disabled={shouldDisableSpaceChange}
              onChange={handleSpaceChange}
              defaultSpaceId={spaceId ?? ""}
              isUsingNewDesign
            />
          </Tooltip>
          <CollectionsField
            hasLabel={false}
            vaultItem={{
              spaceId: spaceId ?? "",
              vaultItemId: data.id,
              vaultItemTitle: title,
              isSharedWithLimitedRights: data.limitedPermissions,
            }}
            ref={collectionsFieldRef}
            signalEditedValues={onModifyData}
            isAddCollectionDisabled={!!isDiscontinuedUser || hasAttachment}
            setHasOpenedDialogs={setHasDialogsOpenedByChildren}
            setCollectionsToUpdate={onCollectionsToUpdate}
          />
        </ContentCard>

        {isSecurityOptionsAvailable ? (
          <ContentCard title={translate(I18N_KEYS.CONTENT_PREFERENCES)}>
            <Checkbox
              id="securityToggle"
              label={translate(I18N_KEYS.SECURITY_TITLE)}
              description={translate(I18N_KEYS.SECURITY_DESCRIPTION)}
              checked={isSecured}
              onChange={handleAutoProtectedChange}
            />
          </ContentCard>
        ) : null}
      </div>
    </>
  );
};

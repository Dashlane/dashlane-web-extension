import { ClipboardEvent, FormEvent, useCallback, useState } from "react";
import { Button, Checkbox, TextArea, TextField } from "@dashlane/design-system";
import { DataStatus } from "@dashlane/framework-react";
import { useIsPersonalSpaceDisabled } from "../../../libs/hooks/use-is-personal-space-disabled";
import useTranslate from "../../../libs/i18n/useTranslate";
import { SharedAccess } from "../../shared-access";
import { useIsSSOUser } from "../../account/security-settings/hooks/useIsSSOUser";
import { useIsMPlessUser } from "../../account/security-settings/hooks/use-is-mpless-user";
import { SaveSecretContentValues } from "../../personal-data/types";
import { ContentCard } from "../../panel/standard/content-card";
import { SpaceSelect } from "../../space-select/space-select";
import { SecretsTabs } from "../edit/types";
import { useFrozenState } from "../../../libs/frozen-state/frozen-state-dialog-context";
import { EmbeddedAttachmentsForm } from "../../secure-files/components/embedded-attachments-form";
import { Field, ItemType, UserCopyVaultItemFieldEvent } from "@dashlane/hermes";
import {
  logUserEventAskAuthentication,
  useProtectedItemsUnlocker,
} from "../../unlock-items";
import { LockedItemType, UnlockerAction } from "../../unlock-items/types";
import { CopyToClipboardButton } from "../../credentials/edit/copy-to-clipboard-control";
import { logEvent } from "../../../libs/logs/logEvent";
import { useActivityLogReport } from "../../hooks/use-activity-log-report";
const { CONTENT, SHARED_ACCESS, DOCUMENT_STORAGE } = SecretsTabs;
const I18N_KEYS = {
  TEXT_MAX_SIZE: "webapp_secure_notes_edition_field_text_max_size_reached",
  DETAILS_BOX: "webapp_secrets_box_title_details",
  ORGANIZATION_BOX: "webapp_secrets_box_title_organization",
  TITLE_FIELD: "webapp_secrets_title_field",
  CONTENT_FIELD: "webapp_secrets_content_field",
  CONTENT_FIELD_PLACEHOLDER: "webapp_secrets_content_field_placeholder",
  PREFERENCES_BOX: "webapp_secrets_box_title_preferences",
  MP_TITLE: "webapp_secrets_preferences_mp_title",
  MP_DESC: "webapp_secrets_preferences_mp_description",
  SECRET_ACTION_SHOW_SECRET_CONTENT:
    "webapp_secret_edition_action_show_secret_content",
  SECRET_ACTION_HIDE_SECRET_CONTENT:
    "webapp_secret_edition_action_hide_secret_content",
  SECRET_ACTION_COPY_SECRET_CONTENT:
    "webapp_secret_edition_action_copy_secret_content",
  SECRET_CONTENT_COPIED: "webapp_secret_edition_action_secret_copied",
};
export interface SecretFormProps {
  activeTab: SecretsTabs;
  isAdmin: boolean;
  isSecured: boolean;
  isAttachmentUploading: boolean;
  isNewItem: boolean;
  secretValues: SaveSecretContentValues;
  handleChange: (
    key: keyof Omit<SaveSecretContentValues, "id" | "limitedPermissions">,
    value: string | boolean
  ) => void;
  handleFileInfoDetached: (fileId: string) => void;
  onModalDisplayStateChange?: (isModalOpen: boolean) => void;
}
export const MAX_AUTHORIZED_CHARACTERS = 10000;
export const SecretForm = ({
  activeTab,
  isAdmin,
  isSecured,
  isAttachmentUploading,
  isNewItem,
  secretValues,
  handleChange,
  handleFileInfoDetached,
  onModalDisplayStateChange,
}: SecretFormProps) => {
  const { translate } = useTranslate();
  const [error, setError] = useState("");
  const { shouldShowFrozenStateDialog: isUserFrozen } = useFrozenState();
  const isSSOUser = useIsSSOUser();
  const { isMPLessUser } = useIsMPlessUser();
  const isRequireMPOptionAvailable = !isSSOUser && !isMPLessUser;
  const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } =
    useProtectedItemsUnlocker();
  const { logRevealSecretContent, logCopiedSecretContent } =
    useActivityLogReport();
  const personalSpaceConfig = useIsPersonalSpaceDisabled();
  const isPersonalSpaceEnabled =
    personalSpaceConfig.status === DataStatus.Success &&
    !personalSpaceConfig.isDisabled;
  const { id, limitedPermissions, title, content, spaceId, secured } =
    secretValues;
  const [shouldDisplaySecretContent, setShouldDisplaySecretContent] = useState(
    content === ""
  );
  const isSecretLocked = isSecured && !areProtectedItemsUnlocked;
  const hasSecretContent = Boolean(content.length);
  const hasTeamSpaceId = Boolean(spaceId);
  const checkInputUpdate = (event: FormEvent<HTMLTextAreaElement>) => {
    const currentValue = event.currentTarget.value;
    if (currentValue.length > MAX_AUTHORIZED_CHARACTERS) {
      setError(
        translate(I18N_KEYS.TEXT_MAX_SIZE, {
          charLeft: MAX_AUTHORIZED_CHARACTERS - (currentValue.length - 1),
        })
      );
      event.preventDefault();
    }
  };
  const checkInputPaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    const pasteValue = event.clipboardData.getData("text/plain");
    if (
      event.currentTarget.value.length + pasteValue.length >
      MAX_AUTHORIZED_CHARACTERS
    ) {
      setError(
        translate(I18N_KEYS.TEXT_MAX_SIZE, {
          charLeft:
            MAX_AUTHORIZED_CHARACTERS - event.currentTarget.value.length,
        })
      );
      event.preventDefault();
    }
  };
  const handleAutoProtectedChange = () => {
    if (!areProtectedItemsUnlocked && !isNewItem) {
      logUserEventAskAuthentication();
      openProtectedItemsUnlocker({
        action: UnlockerAction.Show,
        itemType: LockedItemType.Secret,
        successCallback: () => handleChange("secured", Boolean(!secured)),
      });
    } else {
      handleChange("secured", Boolean(!secured));
    }
  };
  const handleProtectedItemUnlocking = useCallback(
    (override, onSuccess) =>
      new Promise<void>((resolve, reject) => {
        if (override || !isSecretLocked) {
          onSuccess();
          return resolve();
        }
        openProtectedItemsUnlocker({
          action: UnlockerAction.Show,
          itemType: LockedItemType.Secret,
          successCallback: () => {
            onSuccess();
            return resolve();
          },
          cancelCallback: reject,
        });
      }),
    [isSecretLocked, openProtectedItemsUnlocker]
  );
  const toggleShowSecretContent = () => {
    setShouldDisplaySecretContent((oldValue) => !oldValue);
    if (!shouldDisplaySecretContent && hasTeamSpaceId) {
      logRevealSecretContent(title);
    }
  };
  const handleToggleShowSecretContent = () => {
    handleProtectedItemUnlocking(
      shouldDisplaySecretContent,
      toggleShowSecretContent
    ).catch(() => {
      setShouldDisplaySecretContent(false);
    });
  };
  if (isUserFrozen === null) {
    return null;
  }
  return (
    <>
      {activeTab === CONTENT && (
        <div aria-labelledby="tab-secret-detail" id="content-secret-detail">
          <ContentCard title={translate(I18N_KEYS.DETAILS_BOX)}>
            <TextField
              data-name="title"
              label={translate(I18N_KEYS.TITLE_FIELD)}
              value={title}
              onChange={(event) => handleChange("title", event.target.value)}
              disabled={limitedPermissions}
              readOnly={isUserFrozen}
              sx={{ marginBottom: "8px" }}
            />
            <TextArea
              data-name="content"
              label={translate(I18N_KEYS.CONTENT_FIELD)}
              placeholder={translate(I18N_KEYS.CONTENT_FIELD_PLACEHOLDER)}
              value={
                shouldDisplaySecretContent || !hasSecretContent
                  ? content
                  : "••••••••"
              }
              onBeforeInput={checkInputUpdate}
              onPaste={checkInputPaste}
              onChange={(event) => {
                if (error) {
                  setError("");
                }
                handleChange("content", event.target.value);
              }}
              disabled={limitedPermissions}
              readOnly={
                (!shouldDisplaySecretContent && hasSecretContent) ||
                isUserFrozen
              }
              feedback={
                error
                  ? {
                      text: error,
                    }
                  : undefined
              }
              error={!!error}
              actions={[
                <Button
                  key="secret-content-visibility"
                  layout="iconOnly"
                  icon={
                    shouldDisplaySecretContent
                      ? "ActionHideOutlined"
                      : "ActionRevealOutlined"
                  }
                  mood="brand"
                  intensity="supershy"
                  sx={{ marginRight: "16px" }}
                  onClick={handleToggleShowSecretContent}
                  aria-label={
                    shouldDisplaySecretContent
                      ? translate(I18N_KEYS.SECRET_ACTION_HIDE_SECRET_CONTENT)
                      : translate(I18N_KEYS.SECRET_ACTION_SHOW_SECRET_CONTENT)
                  }
                  tooltip={
                    shouldDisplaySecretContent
                      ? translate(I18N_KEYS.SECRET_ACTION_HIDE_SECRET_CONTENT)
                      : translate(I18N_KEYS.SECRET_ACTION_SHOW_SECRET_CONTENT)
                  }
                />,
                ...(hasSecretContent
                  ? [
                      <CopyToClipboardButton
                        key="copy-secret-content"
                        data={content}
                        checkProtected={() => isSecretLocked}
                        copyLabel={translate(
                          I18N_KEYS.SECRET_ACTION_COPY_SECRET_CONTENT
                        )}
                        onCopy={() => {
                          logEvent(
                            new UserCopyVaultItemFieldEvent({
                              itemId: id,
                              itemType: ItemType.Secret,
                              field: Field.Secret,
                              isProtected: isSecured,
                            })
                          );
                          if (hasTeamSpaceId) {
                            logCopiedSecretContent(title);
                          }
                        }}
                        itemType={LockedItemType.Secret}
                        tooltipLocation="right"
                      />,
                    ]
                  : []),
              ]}
            />
          </ContentCard>
          {isPersonalSpaceEnabled ? (
            <SpaceSelect
              disabled={isUserFrozen}
              contentCardLabel={translate(I18N_KEYS.ORGANIZATION_BOX)}
              wrapInContentCard
              isUsingNewDesign
              defaultSpaceId={spaceId ?? ""}
              spaceId={spaceId ?? ""}
              onChange={(nextSpaceId) => handleChange("spaceId", nextSpaceId)}
            />
          ) : null}
          {isRequireMPOptionAvailable ? (
            <ContentCard
              title={translate(I18N_KEYS.PREFERENCES_BOX)}
              additionalSx={{ marginTop: "16px" }}
            >
              <Checkbox
                readOnly={isUserFrozen}
                label={translate(I18N_KEYS.MP_TITLE)}
                description={translate(I18N_KEYS.MP_DESC)}
                checked={Boolean(secured)}
                onChange={handleAutoProtectedChange}
              />
            </ContentCard>
          ) : null}
        </div>
      )}

      {activeTab === DOCUMENT_STORAGE && (
        <div
          aria-labelledby="tab-secret-attachments"
          id="content-secret-attachments"
        >
          <EmbeddedAttachmentsForm
            attachments={secretValues.attachments}
            additionalProps={{
              itemId: id,
              itemType: ItemType.Secret,
              handleFileInfoDetached: (secureFileInfoId: string) => {
                handleFileInfoDetached(secureFileInfoId);
              },
              onModalDisplayStateChange,
              isUploading: isAttachmentUploading,
            }}
          />
        </div>
      )}

      {activeTab === SHARED_ACCESS && (
        <div
          aria-labelledby="tab-secret-shared-access"
          id="content-secret-shared-access"
        >
          <SharedAccess isAdmin={isAdmin} id={id} />
        </div>
      )}
    </>
  );
};

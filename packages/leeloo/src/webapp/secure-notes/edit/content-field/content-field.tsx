import { useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useFeatureFlips } from "@dashlane/framework-react";
import { Button, TextArea } from "@dashlane/design-system";
import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { MarkdownToolbar } from "../markdown-toolbar/markdown-toolbar-component";
import { formatMarkdownSource } from "../../helpers";
import {
  UnlockerAction,
  useProtectedItemsUnlocker,
} from "../../../unlock-items";
import { LockedItemType } from "../../../unlock-items/types";
import { CopyToClipboardButton } from "../../../credentials/edit/copy-to-clipboard-control";
import { useActivityLogReport } from "../../../hooks/use-activity-log-report";
import styles from "./styles.css";
export type FieldElement = HTMLTextAreaElement;
export const SUPPORT_MARKDOWN_IN_NOTES =
  FEATURE_FLIPS_WITHOUT_MODULE.SupportMarkdownInSecureNotes;
interface SecureNoteContentFieldProps {
  title?: string;
  placeholder?: string;
  isSecured: boolean;
  value: string;
  disabled?: boolean;
  readonly?: boolean;
  isEditing?: boolean;
  fieldRef: React.RefObject<HTMLTextAreaElement>;
  setContent: (content: string) => void;
  spaceId: string;
}
const I18N_KEYS = {
  CONTENT_LABEL: "webapp_secure_notes_form_content_label",
  SECURE_NOTE_ACTION_SHOW_NOTE_CONTENT:
    "webapp_secure_note_edition_action_show_note_content",
  SECURE_NOTE_ACTION_HIDE_NOTE_CONTENT:
    "webapp_secure_note_edition_action_hide_note_content",
  SECURE_NOTE_ACTION_COPY_NOTE:
    "webapp_secure_note_edition_action_copy_note_content",
  SECURE_NOTE_CONTENT_COPIED:
    "webapp_secure_note_edition_action_notes_content_copied",
};
export const SecureNoteContentField = ({
  fieldRef,
  value,
  title,
  isSecured,
  placeholder,
  disabled,
  readonly,
  isEditing,
  setContent,
  spaceId,
}: SecureNoteContentFieldProps) => {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const { translate } = useTranslate();
  const retrievedFFStatus = useFeatureFlips();
  const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } =
    useProtectedItemsUnlocker();
  const { logCopiedSecureNoteContent, logRevealSecureNoteContent } =
    useActivityLogReport();
  const hasNoteContent = Boolean(value.length);
  const hasTeamSpaceId = Boolean(spaceId);
  const isMarkdownSupportEnabled = Boolean(
    retrievedFFStatus.data?.[SUPPORT_MARKDOWN_IN_NOTES]
  );
  const [shouldDisplayNoteContent, setShouldDisplayNoteContent] = useState(
    value === ""
  );
  const isNoteLocked = isSecured && !areProtectedItemsUnlocked;
  const handleProtectedItemUnlocking = useCallback(
    (override, onSuccess) =>
      new Promise<void>((resolve, reject) => {
        if (override || !isNoteLocked) {
          onSuccess();
          return resolve();
        }
        openProtectedItemsUnlocker({
          action: UnlockerAction.Show,
          itemType: LockedItemType.SecureNote,
          successCallback: () => {
            onSuccess();
            return resolve();
          },
          cancelCallback: reject,
        });
      }),
    [isNoteLocked, openProtectedItemsUnlocker]
  );
  const toggleShowNoteContent = () => {
    if (isSecured && title && hasTeamSpaceId && !shouldDisplayNoteContent) {
      logRevealSecureNoteContent(title);
    }
    setShouldDisplayNoteContent((oldValue) => !oldValue);
  };
  const handleToggleShowNoteContent = () => {
    handleProtectedItemUnlocking(
      shouldDisplayNoteContent,
      toggleShowNoteContent
    ).catch(() => {
      setShouldDisplayNoteContent(false);
    });
  };
  return (
    <div
      sx={{
        display: "flex",
        flex: "1 1",
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
        cursor: "text",
      }}
    >
      {isMarkdownSupportEnabled ? (
        <div
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          {!disabled && (
            <MarkdownToolbar
              content={value}
              setContent={setContent}
              fieldRef={fieldRef}
              isPreviewing={isPreviewing}
              setIsPreviewing={(isPreviewing: boolean) =>
                setIsPreviewing(isPreviewing)
              }
            />
          )}
          {isPreviewing ? (
            <div className={styles.markdown}>
              <ReactMarkdown
                source={formatMarkdownSource(value)}
                softBreak="br"
              />
            </div>
          ) : (
            <TextArea
              label={translate(I18N_KEYS.CONTENT_LABEL)}
              ref={fieldRef}
              name={title}
              className={styles.textarea}
              sx={{
                width: "100%",
                padding: "10px 0px",
              }}
              placeholder={placeholder}
              value={
                shouldDisplayNoteContent || !hasNoteContent || !isSecured
                  ? value
                  : "••••••••"
              }
              disabled={disabled}
              readOnly={
                (!shouldDisplayNoteContent && hasNoteContent && isSecured) ||
                readonly
              }
              onChange={(event) => {
                setContent(event.target.value);
              }}
              actions={[
                ...(isSecured
                  ? [
                      <Button
                        key="secure-note-content-visibility"
                        layout="iconOnly"
                        icon={
                          shouldDisplayNoteContent
                            ? "ActionHideOutlined"
                            : "ActionRevealOutlined"
                        }
                        mood="brand"
                        intensity="supershy"
                        sx={{ marginRight: "16px" }}
                        onClick={handleToggleShowNoteContent}
                        aria-label={
                          shouldDisplayNoteContent
                            ? translate(
                                I18N_KEYS.SECURE_NOTE_ACTION_HIDE_NOTE_CONTENT
                              )
                            : translate(
                                I18N_KEYS.SECURE_NOTE_ACTION_SHOW_NOTE_CONTENT
                              )
                        }
                        tooltip={
                          shouldDisplayNoteContent
                            ? translate(
                                I18N_KEYS.SECURE_NOTE_ACTION_HIDE_NOTE_CONTENT
                              )
                            : translate(
                                I18N_KEYS.SECURE_NOTE_ACTION_SHOW_NOTE_CONTENT
                              )
                        }
                      />,
                    ]
                  : []),
                ...(hasNoteContent
                  ? [
                      <CopyToClipboardButton
                        key="copy-secure-note-content"
                        data={value}
                        checkProtected={() => isNoteLocked}
                        copyLabel={translate(
                          I18N_KEYS.SECURE_NOTE_ACTION_COPY_NOTE
                        )}
                        itemType={LockedItemType.SecureNote}
                        tooltipLocation="right"
                      />,
                    ]
                  : []),
              ]}
            />
          )}
        </div>
      ) : (
        <TextArea
          label={translate(I18N_KEYS.CONTENT_LABEL)}
          ref={fieldRef}
          name={title}
          sx={{
            width: "100%",
            padding: "10px 0px",
          }}
          placeholder={placeholder}
          readOnly={
            (!shouldDisplayNoteContent && hasNoteContent && isSecured) ||
            readonly
          }
          onChange={(event) => setContent(event.target.value)}
          value={
            shouldDisplayNoteContent || !hasNoteContent || !isSecured
              ? value
              : "••••••••"
          }
          actions={[
            ...(isSecured
              ? [
                  <Button
                    key="secure-note-content-visibility"
                    layout="iconOnly"
                    icon={
                      shouldDisplayNoteContent
                        ? "ActionHideOutlined"
                        : "ActionRevealOutlined"
                    }
                    mood="brand"
                    intensity="supershy"
                    sx={{ marginRight: "16px" }}
                    onClick={handleToggleShowNoteContent}
                    aria-label={
                      shouldDisplayNoteContent
                        ? translate(
                            I18N_KEYS.SECURE_NOTE_ACTION_HIDE_NOTE_CONTENT
                          )
                        : translate(
                            I18N_KEYS.SECURE_NOTE_ACTION_SHOW_NOTE_CONTENT
                          )
                    }
                    tooltip={
                      shouldDisplayNoteContent
                        ? translate(
                            I18N_KEYS.SECURE_NOTE_ACTION_HIDE_NOTE_CONTENT
                          )
                        : translate(
                            I18N_KEYS.SECURE_NOTE_ACTION_SHOW_NOTE_CONTENT
                          )
                    }
                  />,
                ]
              : []),
            ...(hasNoteContent
              ? [
                  <CopyToClipboardButton
                    key="copy-secure-note-content"
                    data={value}
                    checkProtected={() => isNoteLocked}
                    copyLabel={translate(
                      I18N_KEYS.SECURE_NOTE_ACTION_COPY_NOTE
                    )}
                    itemType={LockedItemType.SecureNote}
                    tooltipLocation="right"
                    onCopy={() => {
                      if (isEditing && title && hasTeamSpaceId) {
                        logCopiedSecureNoteContent(title);
                      }
                    }}
                  />,
                ]
              : []),
          ]}
        />
      )}
    </div>
  );
};

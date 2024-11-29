import {
  DialogBody,
  DialogFooter,
  Heading,
  LoadingIcon,
  Paragraph,
} from "@dashlane/ui-components";
import {
  ShareCredentialError,
  ShareNoteError,
} from "@dashlane/sharing-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { DetailedItem } from "../../../libs/dashlane-style/detailed-item";
import { getSharingFailureMessage } from "./helpers";
import { CredentialThumbnail } from "../../../libs/dashlane-style/credential-info/credential-thumbnail";
import { CredentialInfoSize } from "../../../libs/dashlane-style/credential-info/credential-info";
import { useShareItemsErrors } from "../hooks/use-share-items-errors";
import { NoteIcon } from "../../note-icon";
import { itemSx, SHARING_INVITE_CONTENT_HEIGHT } from "../item";
import { SharingLimitReachedDialogContent } from "../limit-reached-dialog-content";
const I18N_KEYS = {
  CANCEL: "webapp_sharing_invite_cancel",
  FAIL_DETAIL: "webapp_sharing_invite_failure_detail_2",
  FAILURE: "webapp_sharing_invite_failure_2",
  SHARE_AGAIN: "webapp_sharing_invite_share_items_again",
};
export interface ShareInviteFailureStepProps {
  itemsCount: number;
  limitExceededError: boolean;
  isLoading: boolean;
  onDismiss: () => void;
  shareAllItems: () => void;
}
interface CredentialProps {
  error: ShareCredentialError;
}
export interface NoteProps {
  error: ShareNoteError;
}
const CredentialError = (props: CredentialProps) => {
  const { error } = props;
  const { title, domain, text, reason } = error;
  const { translate } = useTranslate();
  const message = getSharingFailureMessage(translate, reason);
  const detailedItemParams = {
    title,
    text,
    logo: (
      <CredentialThumbnail
        size={CredentialInfoSize.SMALL}
        title={title}
        domain={domain}
      />
    ),
    infoAction: message,
  };
  return (
    <li key={error.id} sx={itemSx}>
      <DetailedItem {...detailedItemParams} />
    </li>
  );
};
const NoteError = (props: NoteProps) => {
  const { error } = props;
  const { id, title, color, reason } = error;
  const { translate } = useTranslate();
  const message = getSharingFailureMessage(translate, reason);
  const logo = <NoteIcon noteType={color} />;
  const detailedItemParams = { title, text: "", logo, infoAction: message };
  return (
    <li key={id} sx={itemSx}>
      <DetailedItem {...detailedItemParams} />
    </li>
  );
};
export const ShareInviteFailureStep = (props: ShareInviteFailureStepProps) => {
  const {
    itemsCount,
    isLoading,
    onDismiss,
    shareAllItems,
    limitExceededError,
  } = props;
  const { translate } = useTranslate();
  const errors = useShareItemsErrors();
  if (limitExceededError) {
    return <SharingLimitReachedDialogContent closeDialog={onDismiss} />;
  }
  if (!errors.data) {
    return null;
  }
  const { credentialsErrors, notesErrors } = errors.data;
  const errorsCount = credentialsErrors.length + notesErrors.length;
  const subtitle = translate(I18N_KEYS.FAIL_DETAIL, {
    count: itemsCount,
    errorsCount,
  });
  return (
    <>
      <Heading as="h1" size="small" sx={{ mb: "16px" }}>
        {translate(I18N_KEYS.FAILURE, { count: itemsCount })}
      </Heading>
      <DialogBody>
        <Paragraph>{subtitle}</Paragraph>
        <ul
          sx={{
            borderTopWidth: "1px",
            borderTopStyle: "solid",
            borderTopColor: "ds.border.neutral.quiet.idle",
            marginTop: "10px",
            maxHeight: SHARING_INVITE_CONTENT_HEIGHT,
            overflowY: "scroll",
          }}
        >
          {credentialsErrors.map((e) => (
            <CredentialError error={e} key={e.id} />
          ))}
          {notesErrors.map((e) => (
            <NoteError error={e} key={e.id} />
          ))}
        </ul>
      </DialogBody>
      <DialogFooter
        secondaryButtonTitle={translate(I18N_KEYS.CANCEL)}
        secondaryButtonOnClick={onDismiss}
        secondaryButtonProps={{ disabled: isLoading, type: "button" }}
        primaryButtonTitle={
          isLoading ? (
            <LoadingIcon size={24} color="ds.text.inverse.catchy" />
          ) : (
            translate(I18N_KEYS.SHARE_AGAIN)
          )
        }
        primaryButtonOnClick={shareAllItems}
        primaryButtonProps={{
          disabled: isLoading,
          type: "button",
        }}
      />
    </>
  );
};

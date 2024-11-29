import { EmbeddedAttachment } from "@dashlane/communication";
import { ItemType } from "@dashlane/hermes";
export interface SecureAttachmentProps {
  attachment: EmbeddedAttachment;
  disableActions: boolean;
  setDisableActions: (state: boolean) => void;
  handleFileInfoDetached?: (secureFileInfoId: string) => void;
  isAttachmentEnabled?: boolean;
  onModalDisplayStateChange?: (isModalOpen: boolean) => void;
  parentId?: string;
  parentType: ItemType;
}

import {
  CredentialPasswordHistoryItemView,
  PasswordHistoryItemView,
} from "@dashlane/communication";
import { Flex } from "@dashlane/design-system";
import { InfiniteScroll } from "../../../libs/pagination/infinite-scroll";
import { usePasswordHistorySharingStatus } from "../../shared-access/hooks/use-password-history-sharing-status";
import { PasswordHistoryRow } from "./list-item/password-history-row";
import { PasswordCopyHandlerParams } from "../types";
interface Props {
  isLoading: boolean;
  hasNext: boolean;
  loadNext: () => void;
  hasPrevious?: boolean;
  loadPrevious?: () => void;
  paginatedDataItems: PasswordHistoryItemView[];
  onPasswordCopied: (copyHandlerParams: PasswordCopyHandlerParams) => void;
  onCreateNewCredential: (generatedPassword: string, website?: string) => void;
  onOpenRestorePasswordDialog: (
    newSelectedItem: CredentialPasswordHistoryItemView
  ) => void;
}
export const PasswordHistoryList = ({
  isLoading,
  hasNext,
  loadNext,
  hasPrevious = false,
  loadPrevious = () => {},
  paginatedDataItems,
  onPasswordCopied,
  onCreateNewCredential,
  onOpenRestorePasswordDialog,
}: Props) => {
  const sharingStatusData = usePasswordHistorySharingStatus(paginatedDataItems);
  if (!sharingStatusData) {
    return null;
  }
  return (
    <Flex flexDirection="column" sx={{ overflow: "hidden" }}>
      <InfiniteScroll
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        isLoading={isLoading}
        loadNext={loadNext}
        loadPrevious={loadPrevious}
      >
        {paginatedDataItems.map((item: PasswordHistoryItemView) => (
          <PasswordHistoryRow
            key={[item.id, item.timestamp].join("")}
            item={item}
            sharingStatus={sharingStatusData[item.id]}
            onPasswordCopied={onPasswordCopied}
            onCreateNewCredential={onCreateNewCredential}
            onOpenRestorePasswordDialog={onOpenRestorePasswordDialog}
          />
        ))}
      </InfiniteScroll>
    </Flex>
  );
};

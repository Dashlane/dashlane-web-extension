import { useToast } from '@dashlane/design-system';
import { AnonymousCopyVaultItemFieldEvent, DomainType, Field, hashDomain, ItemType, UserCopyVaultItemFieldEvent, } from '@dashlane/hermes';
import { ParsedURL } from '@dashlane/url-parser';
import { VaultItemType } from '@dashlane/vault-contracts';
import { logEvent } from 'src/libs/logs/logEvent';
import { vaultItemTypeToHermesItemTypeMap } from 'src/app/helpers';
import { useUIStateStorageRepositoryContext } from 'src/app/UIState/ui-state-storage-repository-context';
import { useAlertAutofillEngine } from 'src/app/use-autofill-engine';
import { ActiveItemDetail } from 'src/app/vault/detail-views/vault-item-detail-view-provider';
export function useOnCopyAction() {
    const { showToast } = useToast();
    const { saveData } = useUIStateStorageRepositoryContext();
    const alertAutofillEngine = useAlertAutofillEngine();
    const onCopyAction = async (copyValue: string, credentialId: string, field: Field, itemType = VaultItemType.Credential, notification: string, isProtected = false, credentialUrl = '') => {
        await navigator.clipboard.writeText(copyValue);
        const rootDomain = new ParsedURL(credentialUrl).getRootDomain();
        void alertAutofillEngine(credentialId, copyValue, itemType, field);
        void logEvent(new UserCopyVaultItemFieldEvent({
            itemType: vaultItemTypeToHermesItemTypeMap[itemType] ?? ItemType.Credential,
            field: field,
            itemId: credentialId,
            isProtected: isProtected,
        }));
        void logEvent(new AnonymousCopyVaultItemFieldEvent({
            itemType: vaultItemTypeToHermesItemTypeMap[itemType] ?? ItemType.Credential,
            field: field,
            domain: {
                id: await hashDomain(rootDomain),
                type: DomainType.Web,
            },
        }));
        showToast({
            description: notification,
        });
        saveData(ActiveItemDetail.storageKey, new ActiveItemDetail(itemType, credentialId));
    };
    return onCopyAction;
}

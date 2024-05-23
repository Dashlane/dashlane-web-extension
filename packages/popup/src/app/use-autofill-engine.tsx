import React from 'react';
import { Field } from '@dashlane/hermes';
import { hashString } from '@dashlane/framework-services';
import { VaultSourceType } from '@dashlane/autofill-contracts';
import { VaultItemType } from '@dashlane/vault-contracts';
import { computeHash } from '@dashlane/framework-infra/src/cryptography/browser/compute-hash';
import { AutofillEngineClientType, VaultIngredient, } from '@dashlane/autofill-engine/dist/autofill-engine/src/types';
import { AutofillEngineCommands, connectToAutofillEngine, WebExtensionApiManager, } from '@dashlane/autofill-engine/dist/autofill-engine/src/client';
import { hermesFieldToVaultIngredient, vaultItemTypeTypeToVaultSourceTypeMap, } from './helpers';
export const useAutofillEngineCommands = (): AutofillEngineCommands => {
    const commands = React.useMemo<AutofillEngineCommands>(() => connectToAutofillEngine(new WebExtensionApiManager().getBrowserApi(), {}, AutofillEngineClientType.Popup), []);
    return commands;
};
export const useAlertAutofillEngine = () => {
    const autofillEngine = useAutofillEngineCommands();
    const alertAutofillEngine = async (itemId: string, copyValue: string, itemType: VaultItemType, field: Field) => {
        autofillEngine.dataCopiedToClipboardDetected(await hashString(computeHash, copyValue), itemId, {
            type: vaultItemTypeTypeToVaultSourceTypeMap[itemType] ??
                VaultSourceType.Credential,
            property: hermesFieldToVaultIngredient[field],
        } as VaultIngredient);
    };
    return alertAutofillEngine;
};

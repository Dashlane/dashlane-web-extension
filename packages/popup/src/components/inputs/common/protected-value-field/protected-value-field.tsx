import { Fragment, memo, useState } from 'react';
import { Field, ItemType, UserRevealVaultItemFieldEvent, } from '@dashlane/hermes';
import { HideIcon, jsx, RevealIcon } from '@dashlane/ui-components';
import { IconButtonWithTooltip } from 'src/components/icon-button-with-tooltip/icon-button-with-tooltip';
import Input from 'src/components/inputs/common/input/input';
import { CopyIconButton } from 'src/app/vault/detail-views/credential-detail-view/form-fields/copy-icon-button';
import useProtectedItemsUnlocker from 'src/app/protected-items-unlocker/useProtectedItemsUnlocker';
import { ConfirmLabelMode } from 'src/app/protected-items-unlocker/master-password-dialog';
import { logEvent } from 'src/libs/logs/logEvent';
interface ProtectedValueFieldActionsProps {
    isItemVisible: boolean;
    revealValueLabel: string;
    hideValueLabel: string;
    copyValueLabel: string;
    onCopyClick: () => void;
    onShowClick?: () => void;
    onHideClick?: () => void;
}
const FIELD_LOGS = {
    cardNumber: Field.CardNumber,
    securityCode: Field.SecurityCode,
    IBAN: Field.Iban,
    BIC: Field.Bic,
};
const ProtectedValueActionsComponent = ({ isItemVisible, revealValueLabel, hideValueLabel, copyValueLabel, onCopyClick, onHideClick, onShowClick, }: ProtectedValueFieldActionsProps) => {
    return (<>
      {!isItemVisible ? (<IconButtonWithTooltip tooltipContent={revealValueLabel} tooltipMaxWidth={162} onClick={onShowClick} icon={<RevealIcon title={revealValueLabel}/>}/>) : (<IconButtonWithTooltip tooltipContent={hideValueLabel} tooltipMaxWidth={162} onClick={onHideClick} icon={<HideIcon title={hideValueLabel}/>}/>)}
      <CopyIconButton copyAction={onCopyClick} text={copyValueLabel}/>
    </>);
};
const ProtectedValueActions = memo(ProtectedValueActionsComponent);
interface ProtectedValueFieldProps extends Omit<ProtectedValueFieldActionsProps, 'isItemVisible'> {
    value: string;
    valueFieldLabel: string;
    valueFieldId: string;
    protectedItemId: string;
    fieldType: ItemType;
}
const ProtectedValueFieldComponent = ({ value, valueFieldLabel, valueFieldId, onCopyClick, protectedItemId, fieldType, ...actionProps }: ProtectedValueFieldProps) => {
    const [isItemVisible, setIsItemVisible] = useState(false);
    const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } = useProtectedItemsUnlocker();
    const executeIfUnlocked = (onItemUnlockedCallback: () => void, confirmLabelMode: ConfirmLabelMode) => {
        const onItemUnlocked = () => {
            logEvent(new UserRevealVaultItemFieldEvent({
                field: FIELD_LOGS[valueFieldId],
                isProtected: true,
                itemId: protectedItemId,
                itemType: fieldType,
            }));
            onItemUnlockedCallback();
        };
        if (!areProtectedItemsUnlocked) {
            return openProtectedItemsUnlocker({
                confirmLabelMode: confirmLabelMode,
                onSuccess: onItemUnlocked,
                onError: () => {
                },
                onCancel: () => {
                },
                showNeverAskOption: false,
                credentialId: protectedItemId,
            });
        }
        logEvent(new UserRevealVaultItemFieldEvent({
            field: FIELD_LOGS[valueFieldId],
            isProtected: true,
            itemId: protectedItemId,
            itemType: fieldType,
        }));
        onItemUnlockedCallback();
    };
    const onShowClick = () => {
        setIsItemVisible(true);
        actionProps.onShowClick?.();
    };
    const onHideClick = () => {
        setIsItemVisible(false);
        actionProps.onHideClick?.();
    };
    return (<Input id={valueFieldId} label={valueFieldLabel} value={value} readonly={true} actions={<ProtectedValueActions {...actionProps} isItemVisible={isItemVisible} onShowClick={() => executeIfUnlocked(onShowClick, ConfirmLabelMode.Show)} onCopyClick={() => executeIfUnlocked(onCopyClick, ConfirmLabelMode.Copy)} onHideClick={onHideClick}/>} inputType={isItemVisible ? 'text' : 'password'}/>);
};
export const ProtectedValueField = memo(ProtectedValueFieldComponent);

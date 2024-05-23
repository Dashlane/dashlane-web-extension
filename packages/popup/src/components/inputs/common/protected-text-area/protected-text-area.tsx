import { Fragment, memo, useState } from 'react';
import { HideIcon, jsx, RevealIcon } from '@dashlane/ui-components';
import { IconButtonWithTooltip } from 'src/components/icon-button-with-tooltip/icon-button-with-tooltip';
import { CopyIconButton } from 'src/app/vault/detail-views/credential-detail-view/form-fields/copy-icon-button';
import useProtectedItemsUnlocker from 'src/app/protected-items-unlocker/useProtectedItemsUnlocker';
import { ConfirmLabelMode } from 'src/app/protected-items-unlocker/master-password-dialog';
import TextareaInput from '../text-area-input/text-area-input';
interface ProtectedTextAreaActionsProps {
    revealValueLabel: string;
    hideValueLabel: string;
    copyValueLabel: string;
    onCopyClick: () => void;
    onShowClick?: () => void;
    onHideClick?: () => void;
}
const ProtectedTextAreaActionComponent = ({ isItemVisible, revealValueLabel, hideValueLabel, copyValueLabel, onCopyClick, onHideClick, onShowClick, }: ProtectedTextAreaActionsProps & {
    isItemVisible: boolean;
}) => {
    return (<>
      {isItemVisible ? (<IconButtonWithTooltip tooltipContent={hideValueLabel} tooltipMaxWidth={162} onClick={onHideClick} icon={<HideIcon title={hideValueLabel}/>}/>) : (<IconButtonWithTooltip tooltipContent={revealValueLabel} tooltipMaxWidth={162} onClick={onShowClick} icon={<RevealIcon title={revealValueLabel}/>}/>)}
      <CopyIconButton copyAction={onCopyClick} text={copyValueLabel}/>
    </>);
};
const ProtectedValueActions = memo(ProtectedTextAreaActionComponent);
interface ProtectedTextAreaProps extends ProtectedTextAreaActionsProps {
    value: string;
    valueFieldLabel: string;
    valueFieldId: string;
    protectedItemId: string;
}
const ProtectedTextAreaComponent = ({ value, valueFieldLabel, valueFieldId, onCopyClick, protectedItemId, ...actionProps }: ProtectedTextAreaProps) => {
    const [isItemVisible, setIsItemVisible] = useState(false);
    const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } = useProtectedItemsUnlocker();
    const executeIfUnlocked = (onItemUnlockedCallback: () => void, confirmLabelMode: ConfirmLabelMode) => {
        if (!areProtectedItemsUnlocked) {
            return openProtectedItemsUnlocker({
                confirmLabelMode: confirmLabelMode,
                onSuccess: onItemUnlockedCallback,
                onError: () => {
                },
                onCancel: () => {
                },
                showNeverAskOption: false,
                credentialId: protectedItemId,
            });
        }
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
    return (<TextareaInput id={valueFieldId} label={valueFieldLabel} value={value} actions={<ProtectedValueActions {...actionProps} isItemVisible={isItemVisible} onShowClick={() => executeIfUnlocked(onShowClick, ConfirmLabelMode.Show)} onCopyClick={() => executeIfUnlocked(onCopyClick, ConfirmLabelMode.Copy)} onHideClick={onHideClick}/>} isItemHidden={!isItemVisible}/>);
};
export const ProtectedTextArea = memo(ProtectedTextAreaComponent);

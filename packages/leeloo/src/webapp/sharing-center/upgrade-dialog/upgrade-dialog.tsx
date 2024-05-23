import React from 'react';
import { FlexContainer } from '@dashlane/ui-components';
import { jsx } from '@dashlane/design-system';
import { UpgradeDialogFamily, UpgradeDialogWork } from './';
import { UserMessageTypes } from '@dashlane/communication';
import { useUserMessage } from './useUserMessage';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import { isAccountBusiness, isAccountFamily } from 'libs/account/helpers';
import { DataStatus } from '@dashlane/carbon-api-consumers';
interface UpgradeDialogProps {
    hasSharedUsers: boolean;
}
export const UpgradeDialog = ({ hasSharedUsers }: UpgradeDialogProps) => {
    const premiumStatus = usePremiumStatus();
    const { hasDismissedMessage: familyDialogDismissed, dismissMessage: dismissFamilyMessage, } = useUserMessage(UserMessageTypes.SHARING_CENTER_FAMILY);
    const { hasDismissedMessage: workDialogDismissed, dismissMessage: dismissWorkMessage, } = useUserMessage(UserMessageTypes.SHARING_CENTER_WORK);
    const loaded = premiumStatus.status === DataStatus.Success;
    const showFamilyDialog = loaded &&
        premiumStatus.data &&
        !familyDialogDismissed &&
        !isAccountBusiness(premiumStatus.data) &&
        !isAccountFamily(premiumStatus.data) &&
        hasSharedUsers;
    const showWorkDialog = loaded &&
        premiumStatus.data &&
        !workDialogDismissed &&
        !isAccountBusiness(premiumStatus.data) &&
        hasSharedUsers;
    if (!showFamilyDialog && !showWorkDialog) {
        return null;
    }
    return (<div>
      <FlexContainer flexDirection="column" gap="16px" sx={{
            padding: '60px 32px 0px 8px',
            position: 'sticky',
            top: '0px',
        }}>
        {showFamilyDialog ? (<UpgradeDialogFamily onClose={dismissFamilyMessage}/>) : null}
        {showWorkDialog ? (<UpgradeDialogWork onClose={dismissWorkMessage}/>) : null}
      </FlexContainer>
    </div>);
};

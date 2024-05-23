import React from 'react';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { useFeatureFlips } from '@dashlane/framework-react';
import { LeakedMasterPasswordInfobox } from './leaked-master-password-infobox';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { WeakMasterPasswordInfobox } from './weak-master-password-infobox';
import { useWeakMasterPassword } from 'webapp/leaked-master-password/hooks/use-weak-master-password';
import { useLeakedMasterPassword } from 'webapp/leaked-master-password/hooks/use-leaked-master-password';
const IMS_WEB_WEAK_PROD = FEATURE_FLIPS_WITHOUT_MODULE.ImsWebWeakMpProd;
const CheckLeakedAndWeakMP = () => {
    const isWeakMasterPassword = useWeakMasterPassword();
    const isLeakedMasterPassword = useLeakedMasterPassword();
    if (isLeakedMasterPassword) {
        return <LeakedMasterPasswordInfobox />;
    }
    if (isWeakMasterPassword) {
        return <WeakMasterPasswordInfobox />;
    }
    return null;
};
const CheckLeaked = () => {
    const isLeakedMasterPassword = useLeakedMasterPassword();
    return isLeakedMasterPassword ? <LeakedMasterPasswordInfobox /> : null;
};
export const ChangeMasterPasswordInfoboxWrapper = () => {
    const retrievedFFStatus = useFeatureFlips();
    if (retrievedFFStatus.status !== DataStatus.Success) {
        return null;
    }
    const isWeakMasterPassEnabled = retrievedFFStatus.data[IMS_WEB_WEAK_PROD];
    if (isWeakMasterPassEnabled) {
        return <CheckLeakedAndWeakMP />;
    }
    else {
        return <CheckLeaked />;
    }
};

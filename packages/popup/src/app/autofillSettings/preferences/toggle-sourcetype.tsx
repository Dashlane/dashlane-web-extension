import { AutofillableDataModel, autofillSettingsApi, } from '@dashlane/autofill-contracts';
import { jsx, Toggle } from '@dashlane/design-system';
import { useModuleCommands } from '@dashlane/framework-react';
import { logAutofillToggledForSourceTypes } from '../logs';
interface Props {
    label: string;
    sourceTypes: AutofillableDataModel[];
    disabledSourceTypes: AutofillableDataModel[];
    disabled: boolean;
    readOnly?: boolean;
}
export const ToggleSourceType = ({ label, sourceTypes, disabledSourceTypes, disabled, readOnly = false, }: Props) => {
    const { addDisabledSourceTypes, removeDisabledSourceTypes } = useModuleCommands(autofillSettingsApi);
    const areSourceTypesEnabled = sourceTypes.some((sourceType) => !disabledSourceTypes.includes(sourceType));
    const toggleAutofillForSourceTypes = () => {
        if (areSourceTypesEnabled) {
            addDisabledSourceTypes({ sourceTypes });
            logAutofillToggledForSourceTypes(sourceTypes, 'disabled');
        }
        else {
            removeDisabledSourceTypes({ sourceTypes });
            logAutofillToggledForSourceTypes(sourceTypes, 'enabled');
        }
    };
    return (<Toggle label={label} checked={areSourceTypesEnabled} onChange={toggleAutofillForSourceTypes} disabled={disabled} sx={{ fontSize: '14px' }} readOnly={readOnly}/>);
};

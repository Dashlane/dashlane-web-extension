import React from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import { SpaceSelect, spaceSelectFormLabelSx, } from 'webapp/space-select/space-select';
interface Props {
    name: string;
    disabled?: boolean;
}
const SpaceFieldComponent = ({ name, disabled }: Props) => {
    const { setFieldValue } = useFormikContext();
    return (<Field name={name}>
      {({ field }: FieldProps) => (<SpaceSelect labelSx={spaceSelectFormLabelSx} spaceId={field.value ?? ''} onChange={(newSpaceId) => {
                setFieldValue(name, newSpaceId);
            }} disabled={disabled}/>)}
    </Field>);
};
export const SpaceField = React.memo(SpaceFieldComponent);

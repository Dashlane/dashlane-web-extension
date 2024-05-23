import { jsx } from '@dashlane/design-system';
import { FlexContainer } from '@dashlane/ui-components';
import { useState } from 'react';
import { SpaceSelect, spaceSelectFormLabelSx, } from 'webapp/space-select/space-select';
export interface SecretOptions {
    spaceId: string;
}
interface Props {
    data?: SecretOptions;
    disabled?: boolean;
    saveSecretOptions: (options: SecretOptions) => void;
}
export const SecretOptionsForm = ({ data, saveSecretOptions }: Props) => {
    const [spaceId, setSpaceId] = useState(data?.spaceId ?? '');
    const handleSpaceSelection = (newSpaceId: string) => {
        setSpaceId(newSpaceId);
        saveSecretOptions({
            spaceId: newSpaceId,
        });
    };
    return (<FlexContainer flexDirection="column">
      <SpaceSelect labelSx={spaceSelectFormLabelSx} spaceId={spaceId ?? ''} onChange={handleSpaceSelection}/>
    </FlexContainer>);
};

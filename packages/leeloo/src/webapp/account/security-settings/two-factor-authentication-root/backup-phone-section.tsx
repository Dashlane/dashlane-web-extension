import * as React from 'react';
import { jsx, TextInput } from '@dashlane/ui-components';
interface Props {
    recoveryPhone: string | undefined;
}
export const BackupPhoneSection = ({ recoveryPhone }: Props) => {
    return (<React.Fragment>
      <TextInput sx={{ marginTop: '15px' }} value={recoveryPhone} disabled={true}/>
    </React.Fragment>);
};

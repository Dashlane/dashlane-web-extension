import React from 'react';
import { MemberPermission } from '@dashlane/communication';
import { jsx, Paragraph, ThemeUIStyleObject } from '@dashlane/ui-components';
import { TranslatorInterface } from 'libs/i18n/types';
import { RadioButton, RadioButtonGroup, } from 'libs/dashlane-style/radio-button';
import { mergeSx } from '@dashlane/design-system';
export interface Props {
    canRevoke?: boolean;
    loading?: boolean;
    onSelectPermission: (permission: MemberPermission) => void;
    permission: MemberPermission | 'revoke';
    translate: TranslatorInterface;
}
const permissionTitleSx: ThemeUIStyleObject = {
    marginBottom: '8px',
    fontWeight: 600,
};
export const SharingPermissions = (props: Props) => {
    const { canRevoke, loading, onSelectPermission, permission, translate } = props;
    const handleChange = (event: React.FormEvent<HTMLInputElement>) => onSelectPermission(event.currentTarget.value as MemberPermission);
    return (<RadioButtonGroup disabled={loading} groupName="permission" value={permission} onChange={handleChange}>
      <RadioButton value="admin">
        <div sx={mergeSx([permissionTitleSx, { color: 'ds.text.neutral.catchy' }])}>
          {translate('webapp_sharing_permissions_full_rights')}
        </div>
        <Paragraph color="ds.text.neutral.quiet" size="x-small">
          {translate('webapp_sharing_permissions_full_rights_detail')}
        </Paragraph>
      </RadioButton>
      <RadioButton value="limited">
        <div sx={mergeSx([permissionTitleSx, { color: 'ds.text.neutral.catchy' }])}>
          {translate('webapp_sharing_permissions_limited_rights')}
        </div>
        <Paragraph color="ds.text.neutral.quiet" size="x-small">
          {translate('webapp_sharing_permissions_limited_rights_detail')}
        </Paragraph>
      </RadioButton>
      {canRevoke ? (<RadioButton value="revoke">
          <div sx={mergeSx([permissionTitleSx, { color: 'ds.text.danger.quiet' }])}>
            {translate('webapp_sharing_permissions_revoke')}
          </div>
          <Paragraph color="ds.text.neutral.quiet" size="x-small">
            {translate('webapp_sharing_permissions_revoke_detail')}
          </Paragraph>
        </RadioButton>) : null}
    </RadioButtonGroup>);
};

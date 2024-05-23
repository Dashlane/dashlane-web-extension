import { Fragment, memo } from 'react';
import { Icon, jsx } from '@dashlane/design-system';
import { Tooltip } from '@dashlane/ui-components';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import useTranslate from 'libs/i18n/useTranslate';
import { useIsPersonalSpaceDisabled } from 'libs/hooks/use-is-personal-space-disabled';
import { useTeamSpaceContext } from 'team/settings/components/TeamSpaceContext';
import { useSpaceName } from 'webapp/vault/use-space-name';
import { SpaceSelect } from 'webapp/space-select/space-select';
import { Label } from './layout/label';
interface Props {
    spaceId: string;
    setSpaceId: (spaceId: string) => void;
    isLocked?: boolean;
}
const id = 'createActionSidemenuSpaceInputId';
export const SpaceInput = memo(({ spaceId, setSpaceId, isLocked }: Props) => {
    const { translate } = useTranslate();
    const { teamId } = useTeamSpaceContext();
    const spaceName = useSpaceName(spaceId);
    const isPersonalSpaceDisabled = useIsPersonalSpaceDisabled();
    if (!teamId ||
        !(isPersonalSpaceDisabled.status === DataStatus.Success &&
            !isPersonalSpaceDisabled.isDisabled)) {
        return null;
    }
    return (<>
      <Label htmlFor={id} sx={{
            display: 'inline-flex',
            gap: '4px',
            alignItems: 'center',
            marginTop: '16px',
        }}>
        {translate('collections_dialog_create_space_label')}
        {isLocked && <Icon name="LockFilled" size="xsmall"/>}
      </Label>
      <Tooltip content={translate('collections_dialog_edit_space_id_locked_info', {
            space: spaceName,
        })} passThrough={!isLocked}>
        <div>
          <SpaceSelect id={id} spaceId={spaceId ?? ''} hideLabel isDisabled={isLocked} onChange={setSpaceId} sx={{
            flex: '1',
        }}/>
        </div>
      </Tooltip>
    </>);
});

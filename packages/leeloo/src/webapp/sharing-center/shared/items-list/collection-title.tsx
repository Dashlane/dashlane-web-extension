import { Badge, jsx, Paragraph } from '@dashlane/design-system';
import { SharedCollectionRole } from '@dashlane/sharing-contracts';
import IntelligentTooltipOnOverflow from 'libs/dashlane-style/intelligent-tooltip-on-overflow';
import { CollectionLogo } from 'webapp/sharing-notifications/collections/collection-logo';
import { CollectionItemView } from 'webapp/sharing-center/shared/items-list/item-row';
import { useCollectionPermissionsForUser, useCollectionRoleForGroup, } from 'webapp/sharing-invite/hooks/use-collection-permissions';
import useTranslate from 'libs/i18n/useTranslate';
interface CollectionTitleProps {
    item: CollectionItemView;
    isInGroupList: boolean;
}
export const CollectionTitle = ({ item, isInGroupList, }: CollectionTitleProps) => {
    const { translate } = useTranslate();
    const roleIfUser = useCollectionPermissionsForUser(item.id, item.login).role;
    const roleIfGroup = useCollectionRoleForGroup(item.id, item.login);
    const role = isInGroupList ? roleIfGroup : roleIfUser;
    const roleStringKey = role === SharedCollectionRole.Manager
        ? 'webapp_sharing_invite_item_select_dropdown_manager_label'
        : 'webapp_sharing_invite_item_select_dropdown_editor_label';
    const roleLabel = translate(roleStringKey);
    const roleLabelMood = role === SharedCollectionRole.Manager ? 'brand' : 'danger';
    return (<div sx={{
            display: 'flex',
            alignItems: 'center',
        }}>
      <CollectionLogo />
      <div sx={{
            display: 'flex',
            flexDirection: 'column',
        }}>
        <div sx={{
            alignItems: 'center',
            display: 'flex',
            width: '300px',
        }}>
          <IntelligentTooltipOnOverflow tooltipText={item.title} sx={{
            whiteSpace: 'nowrap',
            margin: '0 0 0 16px',
        }}>
            <Paragraph textStyle="ds.body.standard.regular" color="ds.text.neutral.catchy">
              {item.title}
            </Paragraph>
          </IntelligentTooltipOnOverflow>

          <div sx={{
            marginLeft: '8px',
            whiteSpace: 'nowrap',
        }}>
            <Badge mood={roleLabelMood} label={roleLabel}/>
          </div>
        </div>
      </div>
    </div>);
};

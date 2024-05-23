import { Placement, Tooltip } from '@dashlane/ui-components';
import { Badge, BadgeProps, jsx } from '@dashlane/design-system';
import { MemberPermission } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import styles from './permission-badge.css';
const I18N_KEYS = {
    FULL_ACCESS: 'webapp_sharing_center_panel_items_full_access',
    LIMITED_ACCESS: 'webapp_sharing_center_panel_items_limited_access',
};
export interface PermissionBadgeProps {
    level: MemberPermission;
    tooltipText: string;
    tooltipPlacement?: Placement;
}
export const PermissionBadge = ({ level, tooltipText = 'top', tooltipPlacement = 'right', }: PermissionBadgeProps) => {
    const { translate } = useTranslate();
    let badgeCopy;
    let mood: BadgeProps['mood'];
    if (level === 'admin') {
        badgeCopy = translate(I18N_KEYS.FULL_ACCESS);
        mood = 'brand';
    }
    else {
        badgeCopy = translate(I18N_KEYS.LIMITED_ACCESS);
        mood = 'danger';
    }
    return (<Tooltip placement={tooltipPlacement} content={tooltipText} sx={{ maxWidth: '200px' }}>
      <div className={styles.badgeContainer}>
        <Badge mood={mood} label={badgeCopy}/>
      </div>
    </Tooltip>);
};
